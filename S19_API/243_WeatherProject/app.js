// 243
const express = require('express');
const app = express();
// 248
const request = require("request");

// 246 requiring body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

// 243
app.get("/", (req, res) => {
    res.send('Server is up and running');
})

/*
Make get request to external server with node:
    Before it was used a package called request, but in 2020 is deprecated
    There are five ways and the first way is the native way: HTTPS module
*/

// 243 get request to external server
const https = require('https');

// notice that it needs to start with https

// regular way: https.get('https://api.openweathermap.org/data/2.5/weather?q=Sevilla&units=metric&appid=97fd247478b9405f96de2ec549754893', (res) => {
// but we are putting tue url with a constant

// 246
app.get("/weather", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})


// 243, 244, 246
// 246 changed from .get to .post
app.post("/weather", (req, res) => {
    // 246 changed const url = 'https://api.openweathermap.org/data/2.5/weather?q=Sevilla&units=metric&appid=97fd247478b9405f96de2ec549754893'; 
    console.log('*****************246 Using body parser to parse POST**********************');
    const query = req.body.cityInput;
    const unit = "metric"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${unit}&appid=97fd247478b9405f96de2ec549754893`;
    https.get(url, (response) => {
        console.log('statusCode:', response.statusCode);
        // console.log('headers:', response.headers);        
        // console.log(response);

        // 244 on method is a specific method, in this case when we receive data
        response.on('data', (data) => {
            // process.stdout.write(data);
            console.log('*****************244 Log Data from response.on**********************');
            console.log(data); // We receive hexadecimal code
            let weatherData = JSON.parse(data); // parsing into a JavaScript Object
            console.log(weatherData);
            console.log('+++++++++++++ The min temp got is: ' + weatherData.main.temp_min);
            // 244 USING STRINGIFY
            console.log('*****************244 TESTING STRINGIFY**********************');
            const me = {
                name: 'Javier Garcia',
                age: 35,
                job: 'none'
            }
            console.log(JSON.stringify(me));
            console.log(JSON.stringify(weatherData));
            console.log('*****************245 Render a website**********************');
            const nowTemp = weatherData.main.temp;
            const city = weatherData.name;
            const weatherDesc = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = `http://openweathermap.org/img/wn/${icon}.png`;
            // res.send(`<h1>The temperature in ${city} is ${nowTemp}º</h1>`);
            res.write(`<h1>The temperature in ${city} is ${nowTemp}&deg</h1>`);
            res.write(`<h2>The weather description is ${weatherDesc}<img src="${imageURL}" alt=""></h2>`)
            res.send();
        });
    }).on('error', (e) => {
        console.error(e);
    });
})



/* 
244: Status responses
200-Ok
300-Redirection (you shouldn't be here)
400-Client error
    401-Unauthorized
    404-Not found
500-Server error
600-
*/

// 248 use of static for files as css or images (All static files must be in the folder)
app.use(express.static("public"));

// 248 NEWSLETTER
app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

// 248
app.post("/signup", (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    console.log(firstName + lastName + email);

})

// Generating mailchimp account.
// API KEY: 606e359d6ccca2db62512f0b70113c65-us7

// 243
app.listen(3000, function () {
    console.log('Server is running on port 3000');
})