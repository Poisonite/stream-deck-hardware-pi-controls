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

const lightGpioList = [
  {
    power: 17,
    bright: 27,
    dim: 22,
  },
  {
    power: 2,
    bright: 3,
    dim: 4,
  },
  {
    power: 17,
    bright: 27,
    dim: 22,
  },
];

// Reset each button to it's non-pressed value
Object.values(lightButtonGPIOs).forEach((GPIO) => {
  //use the GPIO that we specified, and specify that it is output
  var button = new Gpio(GPIO, "out");

  // Reset button to default value (not pressed)
  console.log(`Resetting GPIO ${GPIO} to HIGH`);
  button.writeSync(1);
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
    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject);
    // Turn the power on
    if (queryObject.action === "togglePower") {
      console.info(`Toggling power, GPIO: ${lightButtonGPIOs.power}`);
      pressButton(lightButtonGPIOs.power);
    }
    // Increase brightness by 1 controller step
    if (queryObject.action === "brightOneStep") {
      console.info(
        `Raise brightness by 1 step, GPIO: ${lightButtonGPIOs.bright}`
      );
      pressButton(lightButtonGPIOs.bright);
    }
    // Decrease brightness by 1 controller step
    if (queryObject.action === "dimOneStep") {
      console.info(`Lower brightness by 1 step, GPIO: ${lightButtonGPIOs.dim}`);
      pressButton(lightButtonGPIOs.dim);
    }
    // Hold brightness button for 5 seconds to simulate full brightness
    if (queryObject.action === "fullBright") {
      console.info(
        `Setting as bright as possible, GPIO: ${lightButtonGPIOs.bright}`
      );
      pressButton(lightButtonGPIOs.bright, 5);
    }
    // Hold dimmer button for 5 seconds to simulate lowest brightness
    if (queryObject.action === "fullDim") {
      console.info(`Setting as dim as possible, GPIO: ${lightButtonGPIOs.dim}`);
      pressButton(lightButtonGPIOs.dim, 5);
    }
    // Set the brightness to a speific precentage out of 100
    if ((queryObject.action = "customBright" && queryObject.percent)) {
      const holdTime =
        queryObject.percent * 0.03 >= 0.5
          ? queryObject.percent * 0.03
          : queryObject.percent * 0.03 + 0.5;

      // Full dim
      console.log(`Setting as dim as possible, GPIO: ${lightButtonGPIOs.dim}`);
      pressButton(lightButtonGPIOs.dim, 5);

      // set the provided brightness after fully dim
      setTimeout(() => {
        pressButton(lightButtonGPIOs.bright, holdTime);
      }, 5200);
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream("index.html").pipe(res);
  })
  .listen(80);
