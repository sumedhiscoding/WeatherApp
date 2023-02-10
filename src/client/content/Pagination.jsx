import React from "react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Map from "./Map";
const Limit = 10;

const totalPagesCalculator = (total, limit) => {
  const pages = [];
  for (let x = 1; x <= parseInt(total) / limit; x++) {
    pages.push(x);
  }

  return pages;
};

const Pagination = () => {
  const [weather, setWeather] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [noofpages, setNoofPages] = useState(0);

  useEffect(() => {
    axios
      .get(
        `https://weatherapp-production-e324.up.railway.app/page1?page=${activePage}&limit=${Limit}`
        //  {
        //   params: {
        //     page: activePage,
        //     size: LIMIT
        //   }
        // }
      )
      .then(({ data }) => {
        // setWeather(data.list[0])
        //   setTotalUsers(data.total);
        // console.log('data', data);
        if (data.source == "API") {
          setWeather(data.list);
        } else {
          setWeather(data.cacheEntry.list);
        }
        // console.log("data[cacheEntry]", data["cacheEntry"])
        setNoofPages(data.Total);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, [activePage]);

  return (
    <>
      <div className="flex flex-row">
        <div className="flex basis-3/5 box-border">
          <div className="w-full border-box ">
            {/* {console.log('Weather', weather)} */}
            <div className="overflow-x-auto w-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th>City</th>
                    <th>Temperature</th>
                    <th>Pressure</th>
                    <th>Humidity</th>
                    <th>Description</th>
                    <th>Wind Speed</th>
                  </tr>
                </thead>
                <tbody>
                  {weather.map((data, idx) => {
                    return (
                      <tr>
                        <th>{idx + 1}</th>
                        <td>{data.name}</td>
                        <td>{data.main.temp}</td>
                        <td>{data.main.pressure}</td>
                        <td>{data.main.humidity}</td>
                        <td>{data.weather[0].main}</td>
                        <td>{data.wind.speed}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center py-3">
              <div className="btn-group">
                {/* {
          noofpages=data.total/Limit
          } */}

                {/* {console.log("ttt", totalPagesCalculator(noofpages, Limit))} */}
                {/* {console.log("aljk", noofpages)} */}

                {totalPagesCalculator(noofpages, Limit).map((page) => {
                  return (
                    <button
                      className={`btn ${
                        activePage == page ? "btn-active" : ""
                      }`}
                      key={page}
                      onClick={() => setActivePage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                {/* <button className="btn">1</button>
          <button className="btn btn-active">2</button>
          <button className="btn">3</button>
          <button className="btn">4</button> */}
              </div>
            </div>
          </div>
        </div>
        {console.log('weather in pagination is',weather)}
        <div><Map weather={weather} /></div>
      </div>
    </>
  );
};

export default Pagination;
