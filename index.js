// Import HTTP server packages
const http = require("http");
const url = require("url");

// Import Rasp Pi GPIO control package
var Gpio = require("onoff").Gpio;

// Store a dictionary of which button is on which GPIO
const buttonGPIOs = {
  power: 17,
  bright: 18,
  dim: 27,
};

// Reset each button to it's non-pressed value
Object.values(buttonGPIOs).forEach((GPIO) => {
  //use the GPIO that we specified, and specify that it is output
  var button = new Gpio(GPIO, "out");

  if (GPIO === buttonGPIOs.dim) {
    // Reset button to default value (not pressed)
    console.log(`Resetting GPIO ${GPIO} to LOW`);
    button.writeSync(0);
  } else {
    // Reset button to default value (not pressed)
    console.log(`Resetting GPIO ${GPIO} to HIGH`);
    button.writeSync(1);
  }
});

// Do a momentary press of the provided button
const pressButton = (GPIO) => {
  //use the GPIO that we specified, and specify that it is output
  var button = new Gpio(GPIO, "out");

  if (GPIO === buttonGPIOs.dim) {
    console.log(`Setting GPIO ${GPIO} to HIGH`);
    button.writeSync(1);

    // Press the button
    setTimeout(() => {
      console.log(`Setting GPIO ${GPIO} to LOW`);
      button.writeSync(0);
    }, 5000);
  } else {
    console.log(`Setting GPIO ${GPIO} to LOW`);
    button.writeSync(0);

    // Press the button
    setTimeout(() => {
      console.log(`Setting GPIO ${GPIO} to HIGH`);
      button.writeSync(1);
    }, 200);
  }
};

http
  .createServer(function (req, res) {
    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject);
    // Turn the power on
    if (queryObject.action === "togglePower") {
      console.log(`Toggling power, GPIO: ${buttonGPIOs.power}`);
      pressButton(buttonGPIOs.power);
    }
    // Increase brightness by 1 controller step
    if (queryObject.action === "brightOneStep") {
      console.log(`Raise brightness by 1 step, GPIO: ${buttonGPIOs.bright}`);
      pressButton(buttonGPIOs.bright);
    }
    // Decrease brightness by 1 controller step
    if (queryObject.action === "dimOneStep") {
      console.log(`Lower brightness by 1 step, GPIO: ${buttonGPIOs.dim}`);
      pressButton(buttonGPIOs.dim);
    }
    // Hit brightness button 20 times to simulate full brightness
    if (queryObject.action === "fullBright") {
      console.log(`Setting as bright as possible, GPIO: ${buttonGPIOs.bright}`);
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          pressButton(buttonGPIOs.bright);
        }, 500);
      }
    }
    // Hit dimmer button 20 times to simulate lowest brightness
    if (queryObject.action === "fullDim") {
      console.log(`Setting as dim as possible, GPIO: ${buttonGPIOs.dim}`);
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          pressButton(buttonGPIOs.dim);
        }, 500);
      }
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      "Add the query string 'action' with a value of 'togglePower', 'brightOneStep', 'dimOneStep', 'fullBright', or 'fullDim'"
    );
  })
  .listen(80);
