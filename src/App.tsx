import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { CryptoType }  from "./types/CryptoType"
import CryptoSummary from "./components/CryptoSummary";



function App() {
  const [cryptos, setCryptos] = useState<Crypto[] | null>();
  useEffect(() => {
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";
    axios.get(url).then((response)=>{
    //  return response.data
    setCryptos(response.data)
    console.log((response.data))
    }) 
  }, []);
  return <div className="App">{cryptos ? cryptos.map((crypto)=>{
    return <CryptoSummary crypto={crypto}/>
  }) : null}</div>;
}

export default App;
