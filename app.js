const express = require("express");
// native http node module.Don't have to install it using node
const https = require("https");
// body-parser: allow us to look through the body of the post request and fetch the data based on the name of my input
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  // 1. get live data using API
  const query = req.body.cityName;  // request.body is the parsed version of the HTTP request.
  const apiKey = "2a704d65dd2d902f60057631b524b9d4#";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;

  // 2. make a HTTP get request to get the data as a JSON format
  https.get(url, function(response){
    console.log(response.statusCode);

    // response.on: correspond to the actual message body that we got back
    response.on("data", function(data){
      // 3. parse the data and fetching the specific items that we want
      const weatherData = JSON.parse(data);  // convert the data into a javascript object
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      // 4. send back to the browser.
      res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celcius.</h1>");
      res.write("<p>The weather is currently " + weatherDescription + "<p>");
      res.write("<img src=" + imageURL +">");
      res.send(); // one app can only have one send(), but it can have multiple write()
    });
  });
});

app.listen(3000, function(){
  console.log("Server is running on port 3000.");
});
