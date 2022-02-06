// Import HTTP server packages
const http = require("http");
const url = require("url");

// Import Rasp Pi GPIO control package
var Gpio = require("onoff").Gpio;

http
  .createServer(function (req, res) {
    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Feel free to add query parameters to the end of the url");
  })
  .listen(8080);

// const myGPIO = 17;

// // Reset each button to it's non-pressed value
// const buttonGPIOs = [17, 18, 23];

// buttonGPIOs.forEach((GPIO) => {
//   //use the GPIO that we specified, and specify that it is output
//   var button = new Gpio(GPIO, "out");

//   // Reset button to default value (not pressed)
//   console.log(`Resetting GPIO ${GPIO} to HIGH`);
//   button.writeSync(1);
// });

// // Do a momentary press of the provided button
// const pressButton = (GPIO) => {
//   //use the GPIO that we specified, and specify that it is output
//   var button = new Gpio(GPIO, "out");

//   console.log(`Setting GPIO ${GPIO} to LOW`);
//   button.writeSync(0);

//   // Press the button
//   setTimeout(() => {
//     console.log(`Setting GPIO ${GPIO} to HIGH`);
//     button.writeSync(1);
//   }, 100);
// };

// pressButton(myGPIO);
