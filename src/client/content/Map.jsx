import React from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import { Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
const Map = (props) => {
  const [points, setPoints] = useState();
  return (
    <div>
      {/* {console.log(props.weather)} */}
      {console.log("the setPoints are", props.weather)}
      <MapContainer
        center={[13.08268, 80.270721]}
        zoom={2}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {props.weather.map((p, idx) => (
          <Marker
            position={[
              props.weather[idx].coord.lat,
              props.weather[idx].coord.lon,
            ]}
          >
            <Popup>
              {props.weather[idx].name} <br />
              Temp:{props.weather[idx].main.temp} <br />
              Weather:{props.weather[idx].weather[0].main} <br />
               Wind Speed: {props.weather[idx].wind.speed} <br />
            </Popup>
          </Marker>
        ))}

        {/* <Marker position={[19.231, 72.829]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
      </MapContainer>
    </div>
  );
};

export default Map;
