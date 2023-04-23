"use client";
import mapboxgl from "mapbox-gl";
import React, { useEffect, useState } from "react";
import "./style/mapbox.css";

interface LocationData {
  name: string;
  lat: number;
  long: number;
  category: string;
  rating: number;
  factors: Record<string, any>;
  year: number;
}

const Map: React.FC = () => {
  // mapbox token access
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWF4LW5hdmVybiIsImEiOiJjbGdyNHZvbnMxZnlsM2ZwMzhtMnJlbGx5In0.AFyKCpWprEwqoTKq4Ezk7Q";

  // default selection
  const [selectedYear, setSelectedYear] = useState<number>(2030);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const buildMap = (filteredData: LocationData[]) => {
    if (map) {
      // Remove any existing markers
      map.remove();

      // Create a new map instance
      const newMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-74.5, 40],
        zoom: 1,
      });

      // Set the new map instance in state
      setMap(newMap);

      // Add markers to the new map
      filteredData.forEach((location) => {
        const markerColor =
          location.rating > -100
            ? "green"
            : location.rating > -50
            ? "yellow"
            : "red";
        new mapboxgl.Marker({ color: markerColor })
          .setLngLat([location.long, location.lat])
          .addTo(newMap);
      });
    }
  };

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

      const filteredData = json.filter((item) => item.year === selectedYear);
      console.log(filteredData);

      if (!map) {
        // Initialize the map for the first time
        const initialMap = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/dark-v11",
          center: [-74.5, 40],
          zoom: 1,
        });

        setMap(initialMap);
      } else {
        // Filter data and update the map
        const filteredData = json.filter((item) => item.year === selectedYear);
        buildMap(filteredData);
      }
    };

    fetchData();
  }, [selectedYear]);

  return (
    <div style={{ width: "100%" }}>
      <div>
        <label htmlFor="year">Select Year: </label>
        <select id="year" value={selectedYear} onChange={handleYearChange}>
          <option value="2030">2030</option>
          <option value="2040">2040</option>
          <option value="2050">2050</option>
          <option value="2060">2060</option>
          <option value="2070">2070</option>
        </select>
      </div>
      <div id="map" style={{ width: "100%" }} />
    </div>
  );
};

export default Map;
