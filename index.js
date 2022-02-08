// Import HTTP server packages
const http = require("http");
const url = require("url");

// Import file system handler package
const fs = require("fs");

// Import Rasp Pi GPIO control package
var Gpio = require("onoff").Gpio;

// Store a dictionary of which button is on which GPIO
const lightButtonGPIOs = {
  power: 2,
  bright: 3,
  dim: 4,
};

const deviceGpioList = {
  center: {
    power: 17,
    bright: 27,
    dim: 22,
  },
  left: {
    power: 13,
    bright: 19,
    dim: 26,
  },
  right: {
    power: 16,
    bright: 20,
    dim: 21,
  },
  dome: {
    power: 12,
  },
};

// TODO: Update to reset all lights
Object.keys(deviceGpioList).forEach((device) => {
  if (device === "dome") {
    //use the GPIO that we specified, and specify that it is output
    var lightSwitch = new Gpio(deviceGpioList[device].power, "out");

    // Switch the GPIO value to LOW (off)
    console.log(
      `Turning off dome light, GPIO: ${deviceGpioList[device].power}`
    );
    lightSwitch.writeSync(1);
  } else {
    // Reset each button to it's non-pressed value
    Object.values(deviceGpioList[device]).forEach((GPIO) => {
      //use the GPIO that we specified, and specify that it is output
      var button = new Gpio(GPIO, "out");

      // Reset button to default value (not pressed)
      console.log(`Resetting ${device} light GPIO ${GPIO} to HIGH`);
      button.writeSync(1);
    });
  }
});

// Do a momentary press of the provided button
const pressButton = (GPIO, holdSeconds = 0.2) => {
  //use the GPIO that we specified, and specify that it is output
  var button = new Gpio(GPIO, "out");
  const holdMilli = holdSeconds * 1000;

  console.log(`Setting GPIO ${GPIO} to LOW`);
  button.writeSync(0);

  // Press the button
  setTimeout(() => {
    console.log(`Setting GPIO ${GPIO} to HIGH`);
    button.writeSync(1);
  }, holdMilli);
};

http
  .createServer(function (req, res) {
    // Define storage for which device(s) we're going to control
    let activeGpioList = {};

    // Grab the passed query string
    const queryObject = url.parse(req.url, true).query;

    // Determine which devices we want to minipulate
    if (queryObject.targets) {
      // Convert the string array to a proper array
      const targetsArr = queryObject.targets.split(",");
      const cleanTargetsArr = [];
      // Then strip out any invalid chars
      targetsArr.forEach((elem, i) => {
        cleanTargetsArr.push(
          targetsArr[i]
            .replace(/\'/g, "")
            .replace(/\[/g, "")
            .replace(/\]/g, "")
            .replace(/\ /g, "")
            .replace(/\"/g, "")
            .replace(/\`/g, "")
            .replace(/\,/g, "")
        );
      });

      // Add each targeted device to the active target object
      cleanTargetsArr.forEach((target) => {
        // Skip if the target value provided doesn't
        //    match one of the defined targets in the master object
        if (!deviceGpioList[target]) {
          return;
        }
        // Add the device provided by the target
        //    element to the list of targets to minipulate
        activeGpioList[target] = deviceGpioList[target];
      });
      // Sets all targets to active if only invalid target keywords were passed
      if (Object.keys(activeGpioList).length <= 0) {
        activeGpioList = deviceGpioList;
      }
    } else {
      // Set all targets to active if no values are passed
      activeGpioList = deviceGpioList;
    }

    // Turn the power on
    if (queryObject.action === "togglePower") {
      Object.keys(activeGpioList).forEach((device) => {
        if (device === "dome") {
          //use the GPIO that we specified, and specify that it is output
          var lightSwitch = new Gpio(activeGpioList[device].power, "out");

          // Switch the GPIO value to the opposite of what it is currently
          console.log(
            `Toggling dome light power, GPIO: ${activeGpioList[device].power}`
          );
          console.log("Dome Light Read:", lightSwitch.readSync().valueOf());
          !lightSwitch.readSync()
            ? lightSwitch.writeSync(0)
            : lightSwitch.writeSync(1);
        } else {
          console.info(
            `Toggling ${device} light power, GPIO: ${activeGpioList[device].power}`
          );
          pressButton(activeGpioList[device].power);
        }
      });
    }

    // Increase brightness by 1 controller step
    if (queryObject.action === "brightOneStep") {
      Object.keys(activeGpioList).forEach((device) => {
        if (device === "dome") {
          // Nothing for a dome light to do here, so skip it
          return;
        } else {
          console.info(
            `Raising ${device} light brightness by 1 step, GPIO: ${activeGpioList[device].bright}`
          );
          pressButton(activeGpioList[device].bright);
        }
      });
    }
    // Decrease brightness by 1 controller step
    if (queryObject.action === "dimOneStep") {
      Object.keys(activeGpioList).forEach((device) => {
        if (device === "dome") {
          // Nothing for a dome light to do here, so skip it
          return;
        } else {
          console.info(
            `Lowering ${device} light brightness by 1 step, GPIO: ${activeGpioList[device].dim}`
          );
          pressButton(activeGpioList[device].dim);
        }
      });
    }

    // Hold brightness button for 5 seconds to simulate full brightness
    if (queryObject.action === "fullBright") {
      Object.keys(activeGpioList).forEach((device) => {
        if (device === "dome") {
          // Nothing for a dome light to do here, so skip it
          return;
        } else {
          console.info(
            `Setting ${device} light as bright as possible, GPIO: ${activeGpioList[device].bright}`
          );
          pressButton(activeGpioList[device].bright, 5);
        }
      });
    }
    // Hold dimmer button for 5 seconds to simulate lowest brightness
    if (queryObject.action === "fullDim") {
      Object.keys(activeGpioList).forEach((device) => {
        if (device === "dome") {
          // Nothing for a dome light to do here, so skip it
          return;
        } else {
          console.info(
            `Setting ${device} light as dim as possible, GPIO: ${activeGpioList[device].dim}`
          );
          pressButton(activeGpioList[device].dim, 5);
        }
      });
    }

    // Set the brightness to a speific precentage out of 100
    if ((queryObject.action = "customBright" && queryObject.percent)) {
      const holdTime =
        queryObject.percent * 0.03 >= 0.5
          ? queryObject.percent * 0.03
          : queryObject.percent * 0.03 + 0.5;

      Object.keys(activeGpioList).forEach((device) => {
        if (device === "dome") {
          // Nothing for a dome light to do here, so skip it
          return;
        } else {
          // Full dim
          console.info(
            `Setting ${device} light as dim as possible, GPIO: ${activeGpioList[device].dim}`
          );
          pressButton(activeGpioList[device].dim, 5);

          // set the provided brightness after fully dim
          setTimeout(() => {
            console.info(
              `Setting ${device} light to ${queryObject.percent}%, GPIO: ${activeGpioList[device].bright}`
            );
            pressButton(activeGpioList[device].bright, holdTime);
          }, 5200);
        }
      });
    }

    // Write out our documentation to the DOM
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream("index.html").pipe(res);
  })
  // Run on the default HTTP port (Requires that node be run as SUDO)
  .listen(80);
