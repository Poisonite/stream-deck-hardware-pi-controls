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
var light = new Gpio(0, "out"); //use GPIO pin 0, and specify that it is output

console.log("Setting GPIO 0 to HIGH");
light.writeSync(1);

setTimeout(() => {
  console.log("Setting GPIO 0 to LOW");
  light.writeSync(0);
}, 100);
