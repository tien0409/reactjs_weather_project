import React, { useState } from "react";
import "./App.css";
import Plot from "react-plotly.js";

function App() {
  const [location, setLocation] = useState("");
  const [data, setData] = useState({});
  const [dates, setDates] = useState([]);
  const [temps, setTemps] = useState([]);
  const [selected, setSelected] = useState({
    date: "",
    temp: null,
  });

  const fetchData = (e) => {
    e.preventDefault();

    fetch(
      `http://api.openweathermap.org/data/2.5/forecast?q=${location}&APPID=4db2f54d49b2eef22c540e6899c78248&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        const list = data.list;
        const dates = [];
        const temps = [];

        for (let i = 0; i < list.length; i++) {
          dates.push(list[i].dt_txt);
          temps.push(list[i].main.temp);
        }

        setData(data);
        setDates(dates);
        setTemps(temps);
        setSelected({ date: "", temp: null });
      })
      .catch((err) => console.log(err));
  };

  const onPlotClick = (data) => {
    if (data.points) {
      setSelected({
        date: data.points[0].x,
        temp: data.points[0].y,
      });
    }
  };

  let currentTemp = "";
  if (data.list) currentTemp = data.list[0].main.temp;
  return (
    <div className="App">
      <h1>Weather</h1>
      <form onSubmit={fetchData}>
        <label>
          I want to know the weather for
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={"City, Country"}
          />
        </label>
      </form>

      {data.list ? (
        <div className="wrapper">
          <p className="temp-wrapper">
            <span className="temp">
              {selected.temp ? selected.temp : currentTemp}
            </span>
            <span className="temp-symbol">℃</span>
            <span className="temp-date">
              {selected.temp ? selected.date : ""}
            </span>
          </p>
          <Plot
            onClick={onPlotClick}
            data={[
              {
                x: dates,
                y: temps,
                type: "scatter",
              },
            ]}
          />
        </div>
      ) : null}
    </div>
  );
}

export default App;
