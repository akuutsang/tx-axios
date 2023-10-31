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
const [selected, setSelected] = useState<Crypto []>([]);

  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
  }, []);

  useEffect(() => {
console.log("SELECTED",selected)
  }, [selected])

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
{selected? "Your portfolio is worth $" + selected.map((s)=>{
  if (isNaN(s.owned)) {
    return 0
    
  }
return s.current_price * s.owned;
}).reduce((previous, current)=>{
  return previous + current;

}, 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : null}
</>
  );
}

export default App;
