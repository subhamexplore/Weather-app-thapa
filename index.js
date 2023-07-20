const http = require('http');
const fs = require('fs');
const requests = require('requests');
const PORT = 3000;

const homeFile = fs.readFileSync('home.html', 'utf-8');

const replaceVal = (value, replaceValue) => {
    let weather = value.replace('{%city%}', replaceValue.name);
    weather = weather.replace('{%country%}', replaceValue.sys.country);
    weather = weather.replace('{%temp%}', (Math.round((replaceValue.main.temp-273.15) * 100) / 100).toFixed(2)); 
    weather = weather.replace('{%minTemp%}', (Math.round((replaceValue.main.temp_min-273.15) * 100) / 100).toFixed(2));
    weather = weather.replace('{%maxTemp%}', (Math.round((replaceValue.main.temp_max-273.15 )* 100) / 100).toFixed(2));
    weather = weather.replace('{%tempStatus%}', replaceValue.weather[0].main);
    return weather;
};
 
const server = http.createServer((req, res)=>{
    if(req.url == '/'){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=0e6fc7f464f3877757d33b20840d4c68')
        .on('data', (chunk)=>{
            const objData = JSON.parse(chunk);
            const arrData = [objData]
            const realTimeData = arrData.map((val)=>replaceVal(homeFile, val)).join("")
            res.write(realTimeData);
        })
        .on('end', (err)=>{
            if(err) return console.log("Connections closed due to errors:", err);
            res.end();
        })
    }
})

server.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}...`);
});