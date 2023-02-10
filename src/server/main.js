const express = require("express");
const ViteExpress = require("vite-express");
const cors= require('cors');
const app = express();
ViteExpress.config({ mode: "development" })

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});
const port = process.env.PORT || 3000

const httpServer = ViteExpress.listen(app, port, () => console.log("Server is listening!"));


const axios = require("axios");
const Redis=require('ioredis')
const api = "040a54370cf313bd1bd50026ec41a5c3";
const redis = new Redis();
let BaseUrl = "http://api.openweathermap.org/data/2.5/group?id=";
let BaseUrl2 = "&units;=metric&appid=040a54370cf313bd1bd50026ec41a5c3";

const cities = [
  { id: 1275339, name: "Mumbai" },
  { id: 1261481, name: "New Delhi" },
  { id: 1264527, name: "Chennai" },
  { id: 1275004, name: "Kolkata" },
  { id: 1819729, name: "Hong Kong" },
  { id: 1835847, name: "Seoul" },
  { id: 2643743, name: "London" },
  { id: 2968815, name: "Paris" },
  { id: 5128581, name: "New York City" },
  { id: 1850147, name: "Tokyo" },
  { id: 292223, name: "Dubai" },
  { id: 1726701, name: "Barcelona" },
  { id: 3169070, name: "Rome" },
  { id: 3117735, name: "Madrid" },
  { id: 1880251, name: "Republic of Singapore" },
  { id: 2759794, name: "Amsterdam" },
  { id: 3067696, name: "Prague" },
  { id: 5368361, name: "Los Angeles" },
  { id: 4887398, name: "Chicago" },
  { id: 5391959, name: "San Francisco" },
  { id: 2950158, name: "Berlin" },
  { id: 4140963, name: "Washington, D.C." },
  { id: 1816670, name: "Beijing" },
  { id: 2072525, name: "Dublin" },
  { id: 745044, name: "Istanbul" },
  { id: 5506956, name: "Las Vegas" },
  { id: 3173435, name: "Milan" },
  { id: 3054643, name: "Budapest" },
  { id: 5174095, name: "Toronto" },
  { id: 6087824, name: "New Toronto" },
];

const urlgeneration = (arr) => {
  let baseUrl = BaseUrl;
  let baseUrl2 = BaseUrl2;
  for (let i = 0; i < arr.length; i++) {
    if (i <= arr.length - 2) baseUrl = baseUrl + arr[i].id.toString() + ",";
    else {
      baseUrl = baseUrl + arr[i].id.toString();
    }
  }
  console.log(baseUrl);
  let result = baseUrl.concat(baseUrl2);
  return result;
};

const pagination = (page, limit, model) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < model.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  console.log(startIndex, " ", endIndex);
  results.results = model.slice(startIndex, endIndex);
  return results;
};

function paginatedResults(model) {
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    console.log(page, " ", limit);
    const results = pagination(page, limit, model);
    //we have got the result
    //    res.send(results);
    console.log("the results contains",results);
    // res.paginatedResults=results

    //now basically we have a results object which containst results.next results.previous and results.results
    // now in the results.results array we have to perform the following operation
    let url = urlgeneration(results.results);
    console.log(url);
    finalresponse={};
    finalresponse.url=url;
    finalresponse.prev=results.previous
    finalresponse.next=results.next
    finalresponse.total=cities.length
    console.log("cities lenght in finalresponse",finalresponse.total);
    res.locals.final=finalresponse;
    res.locals.url = url;
    res.locals.pageno=page;
    /*
    res = {
      "url":
      "page":
    }
    */ 
    next();
  };
}

// let callingapi = (req, res) => {
//   let finalurl = res.locals.url;
//   console.log(finalurl);
//   axios
//     .get(finalurl)
//     .then(function (response) {
//       // handle success
//       res.send(response.data);
//       console.log(response);
//     })
//     .catch(function (error) {
//       // handle error
//       console.log(error);
//     })
//     .then(function () {
//       // always executed
//     });
// };



const getWeather = async (req,res,next) => {
    let finalresponse=res.locals.final.url
    // let finalurl = res.locals.url;
    let page=res.locals.pageno;
    console.log("the final url and the final page no is", finalresponse,"  ",page);
    let cacheEntry = await redis.get(`weather:${page}`);
    if(cacheEntry){
        cacheEntry=JSON.parse(cacheEntry)
        // return {cacheEntry,"source" : "cache" } 
        res.send({cacheEntry,"source" : "cache", "next":res.locals.final.next ,"previous": res.locals.final.previous , "Total":res.locals.final.total});
    }
    else{

        let apiResponse=await axios.get(finalresponse);
        console.log("the api response response", apiResponse);
        redis.set(`weather:${page}`,JSON.stringify(apiResponse.data), 'EX', 600)
                // return {...apiResponse.data , "source" : "API" }    
            res.send({...apiResponse.data , "source" : "API", "next":res.locals.final.next ,"previous": res.locals.final.previous , "Total":res.locals.final.total});
    }
};

// app.get("/", (req, res) => {
//   callingapi(req, res);
// });

app.get("/page1", paginatedResults(cities), getWeather, (req, res) => {
console.log("done")
});
// app.get("/page2", paginatedResults(cities), getWeather, (req, res) => {
//   console.log("done")
//   });

app.get('/all',(req,res)=>{
  res.send(cities);
})