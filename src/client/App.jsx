import { useState } from "react";
import "./App.css";
import Pagination from "./content/Pagination";
// import Map from "./content/map";

function App() {
  return (
    <>
      <div class="navbar bg-primary ">
        <a class="btn btn-ghost normal-case text-white text-xl">WeatherApp</a>
      </div>
      {/* <div className="flex flex-row">
        <div className="flex basis-3/5 box-border"><Pagination/></div>
        <div><Map/></div>
      </div> */}
      <Pagination/>
      <div>Created by Sumedh Gavai</div>
    </>
  );
}

export default App;
