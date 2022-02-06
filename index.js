// Import HTTP server packages
const http = require("http");
const url = require("url");

// Import file system handler package
const fs = require("fs");

// Import Rasp Pi GPIO control package
var Gpio = require("onoff").Gpio;

// Store a dictionary of which button is on which GPIO
const lightButtonGPIOs = {
  power: 17,
  bright: 27,
  dim: 22,
};

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
    // // Set to fully dim and then raise it by half to get 50% brightness
    // if (queryObject.action === "50Bright") {
    //   // Full dim
    //   console.info(`Setting as dim as possible, GPIO: ${lightButtonGPIOs.dim}`);
    //   pressButton(lightButtonGPIOs.dim, 5);

    //   // Half bright after fully dim
    //   setTimeout(() => {
    //     pressButton(lightButtonGPIOs.bright, 1.5);
    //   }, 5200);
    // }
    // // Set to fully dim and then raise it by half to get 25% brightness
    // if (queryObject.action === "25Bright") {
    //   // Full dim
    //   console.info(`Setting as dim as possible, GPIO: ${lightButtonGPIOs.dim}`);
    //   pressButton(lightButtonGPIOs.dim, 5);

    //   // 25% bright after fully dim
    //   setTimeout(() => {
    //     pressButton(lightButtonGPIOs.bright, 0.75);
    //   }, 5200);
    // }
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
    //     res.end(
    //       `
    //       <body>
    //   <h1>Welcome to The TomPod Control Center</h1>
    //   <h2>
    //     Look at the list below for each of the supported requests and their usage
    //   </h2>
    //   <br />

    //   <h2><strong>action</strong></h2>
    //   <h3>
    //     All commands must begin with an
    //     <strong><code>action</code></strong> parameter
    //   </h3>
    //   <h5>
    //     Each of the options below are legal arguments to pass to
    //     <strong><code>action</code></strong>
    //   </h5>

    //   <ul>
    //     <li><code>togglePower</code></li>
    //     <ul>
    //       <li>This argument will flip the power state of the light(s)</li>
    //     </ul>
    //     <li><code>brightOneStep</code></li>
    //     <ul>
    //       <li>
    //         This argument will increase the brightness of the light(s) by 1 step
    //       </li>
    //     </ul>
    //     <li><code>dimOneStep</code></li>
    //     <ul>
    //       <li>
    //         This argument will decrease the brightness of the light(s) by 1 step
    //       </li>
    //     </ul>
    //     <li><code>fullBright</code></li>
    //     <ul>
    //       <li>
    //         This argument will set the light(s) to the highest possible brightness
    //       </li>
    //     </ul>
    //     <li><code>fullDim</code></li>
    //     <ul>
    //       <li>
    //         This argument will set the light(s) to the lowest possible brightness
    //       </li>
    //     </ul>
    //     <li><code>customBright</code></li>
    //     <ul>
    //       <li>
    //         This argument will set the light(s) to a specific brightness percentage.
    //       </li>
    //       <li>
    //         If <code>customBright</code> is used then the
    //         <strong><code>percent</code></strong> parameter must also be passed
    //       </li>
    //     </ul>
    //   </ul>

    //   <br />
    //   <h2><strong>percent</strong></h2>
    //   <h3>
    //     Specific actions may also require the
    //     <strong><code>percent</code></strong> parameter
    //   </h3>
    //   <h5>
    //     Each of the options below are legal arguments to pass to
    //     <strong><code>percent</code></strong>
    //   </h5>

    //   <p>The percent argument accepts a numerical value between 1 and 100</p>
    // </body>
    //       `
    //     );
  })
  .listen(80);
