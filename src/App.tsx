import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import CryptoSummary from "./components/CryptoSummary";
import { Crypto } from "./types/Crypto";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [cryptos, setCryptos] = useState<Crypto[] | null>();
  const [selected, setSelected] = useState<Crypto | null>();
const [data, setData] = useState<ChartData<'line'>>();
const [options, setOptions] = useState<ChartOptions<'line'>>({
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
})



  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";
    axios.get(url).then((response) => {
      //  return response.data
      setCryptos(response.data);
      console.log(response.data);
    });
  }, []);
  return(
    <>
  <div className="App">
    <select 
      onChange={(e)=>{
        const c = cryptos?.find((x)=> x.id === e.target.value);
        setSelected(c)
        // when we select an option, we will;
        // request
        // update data.state
      }}
      defaultValue="default"
    >
      {cryptos
        ? cryptos.map((crypto) => {
            return <option key={crypto.id} value={crypto.id}>{crypto.name}</option>;
          })
        : null}
              <option value="default">Choose an option</option>

    </select>
  </div>
  { selected ? <CryptoSummary crypto={selected} /> : null }
  {data ? <Line options={options} data={data} /> : null}
  </>
  );
}

export default App;
