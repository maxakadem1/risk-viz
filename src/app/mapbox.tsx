"use client";
import mapboxgl, { Marker, Popup } from "mapbox-gl";
import React, { useEffect, useState } from "react";
import "./style/mapbox.css";

const Map = () => {
  // mapbox token access
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWF4LW5hdmVybiIsImEiOiJjbGdyNHZvbnMxZnlsM2ZwMzhtMnJlbGx5In0.AFyKCpWprEwqoTKq4Ezk7Q";

  // fetch data from CSV file
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data/data.csv");
      const data = await response.text();

      // convert CSV data to JSON format
      const rows = data.split("\n").slice(1);

      const json = rows.map((row) => {
        //console.log(row);
        const values = row.split(/,(?![^{]*\})(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        // for value 5
        //console.log(values);
        const factors = values[5].replace(/""/g, '\\"');

        return {
          name: values[0],
          lat: parseFloat(values[1]),
          long: parseFloat(values[2]),
          category: values[3],
          rating: parseFloat(values[4]),
          factors: JSON.parse(factors),
          year: parseInt(values[6]),
        };
      });

      // add markers to the map based on the location coordinates
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-74.5, 40], // starting position [lng, lat]
        zoom: 1, // starting zoom
      });
    };

    fetchData();
  }, []);

  return <div id="map" style={{ width: "100%" }} />;
};

export default Map;
