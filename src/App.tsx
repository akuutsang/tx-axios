import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import CryptoSummary from "./components/CryptoSummary";
import { Crypto } from "./types/Crypto";
import { Pie } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';

import {
  Chart as ChartJS,
  Tooltip,
  ArcElement,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function App() {
const [cryptos, setCryptos] = useState<Crypto[] | null>();
const [selected, setSelected] = useState<Crypto []>([]);
const [data, setData] = useState<ChartData<'pie'>>();

  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
  }, []);

  useEffect(() => {
console.log("SELECTED",selected)
if (selected.length === 0) return
  setData({
    labels: selected.map((d)=>d.name),

    datasets: [
      {
        label: '# of Votes',
        data:selected.map((d)=> d.owned),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ]}) }, [selected])

  function updateOwned(crypto:Crypto, amount:number){
    console.log("updateowned", crypto, amount);
    let temp = [...selected];
    let tempObj = temp.find((c)=> c.id === crypto.id)
    if (tempObj) {
      tempObj.owned = amount;
      setSelected(temp)
     }
  }

  return(
  <>
  <div className="App">
    <select title="Select a crypto coin" name="category"
      onChange={(e)=>{
        const c = cryptos?.find((x)=> x.id === e.target.value) as Crypto;
        setSelected([...selected, c])
        
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
  
   {selected.map((s)=>{
   return <CryptoSummary crypto={s} updateOwned={updateOwned}/>
 })}
 {data ? <div style={{width: 600}}><Pie  data={data} /></div> : null};
{selected? "Your portfolio is worth $" + selected.map((s)=>{
  if (isNaN(s.owned)) {
    return 0
    
  }
return s.current_price * s.owned;
}).reduce((previous, current)=>{
  return previous + current;

}, 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : null};
</>
  );
}

export default App;
