// const http = require("http");
// const url = require("url");

// http
//   .createServer(function (req, res) {
//     const queryObject = url.parse(req.url, true).query;
//     console.log(queryObject);

//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.end("Feel free to add query parameters to the end of the url");
//   })
//   .listen(8080);

var Gpio = require("onoff").Gpio; //include onoff to interact with the GPIO

const myGPIO = 18;

var light = new Gpio(myGPIO, "out"); //use the GPIO pin we specified, and specify that it is output

// for (let i = 0; i < 2; i++) {
//   console.log(`Loop ${i}`);

//   // Wait before starting next loop
//   setTimeout(() => {
//     console.log(`Waiting 300ms before starting next loop`);
//   }, 300);
// }

// Reset button to default value (not pressed)
console.log(`Resetting GPIO ${myGPIO} to HIGH`);
light.writeSync(1);
console.log(`Setting GPIO ${myGPIO} to LOW`);
light.writeSync(0);

// Press the button
setTimeout(() => {
  console.log(`Setting GPIO ${myGPIO} to HIGH`);
  light.writeSync(1);
}, 100);
