// Import HTTP server packages
const http = require("http");
const url = require("url");

// Import Rasp Pi GPIO control package
var Gpio = require("onoff").Gpio;

// Store a dictionary of which button is on which GPIO
const buttonGPIOs = {
  power: 17,
  bright: 27,
  dim: 22,
};

// Reset each button to it's non-pressed value
Object.values(buttonGPIOs).forEach((GPIO) => {
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
      console.info(`Toggling power, GPIO: ${buttonGPIOs.power}`);
      pressButton(buttonGPIOs.power);
    }
    // Increase brightness by 1 controller step
    if (queryObject.action === "brightOneStep") {
      console.info(`Raise brightness by 1 step, GPIO: ${buttonGPIOs.bright}`);
      pressButton(buttonGPIOs.bright);
    }
    // Decrease brightness by 1 controller step
    if (queryObject.action === "dimOneStep") {
      console.info(`Lower brightness by 1 step, GPIO: ${buttonGPIOs.dim}`);
      pressButton(buttonGPIOs.dim);
    }
    // Hold brightness button for 5 seconds to simulate full brightness
    if (queryObject.action === "fullBright") {
      console.info(
        `Setting as bright as possible, GPIO: ${buttonGPIOs.bright}`
      );
      pressButton(buttonGPIOs.bright, 5);
    }
    // Hold dimmer button for 5 seconds to simulate lowest brightness
    if (queryObject.action === "fullDim") {
      console.info(`Setting as dim as possible, GPIO: ${buttonGPIOs.dim}`);
      pressButton(buttonGPIOs.dim, 5);
    }
    // // Set to fully dim and then raise it by half to get 50% brightness
    // if (queryObject.action === "50Bright") {
    //   // Full dim
    //   console.info(`Setting as dim as possible, GPIO: ${buttonGPIOs.dim}`);
    //   pressButton(buttonGPIOs.dim, 5);

    //   // Half bright after fully dim
    //   setTimeout(() => {
    //     pressButton(buttonGPIOs.bright, 1.5);
    //   }, 5200);
    // }
    // // Set to fully dim and then raise it by half to get 25% brightness
    // if (queryObject.action === "25Bright") {
    //   // Full dim
    //   console.info(`Setting as dim as possible, GPIO: ${buttonGPIOs.dim}`);
    //   pressButton(buttonGPIOs.dim, 5);

    //   // 25% bright after fully dim
    //   setTimeout(() => {
    //     pressButton(buttonGPIOs.bright, 0.75);
    //   }, 5200);
    // }
    if ((queryObject.action = "customBright" && queryObject.percent)) {
      const holdTime =
        queryObject.percent * 0.03 >= 0.5
          ? queryObject.percent * 0.03
          : queryObject.percent * 0.03 + 0.5;

      // Full dim
      console.log(`Setting as dim as possible, GPIO: ${buttonGPIOs.dim}`);
      pressButton(buttonGPIOs.dim, 5);

      // set the provided brightness after fully dim
      setTimeout(() => {
        pressButton(buttonGPIOs.bright, holdTime);
      }, 5200);
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      " <h1>test</h1> Add the query string 'action' with a value of 'togglePower', 'brightOneStep', 'dimOneStep', '50Bright', 'fullBright', or 'fullDim'"
    );
  })
  .listen(80);
