// src/components/Entries.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
function Entries() {
  const [entries, setEntries] = useState([]);

  const fetchEntries = async()=>{
    const url = 'http://127.0.0.1:5000/home'
    let result = await fetch(url)
    result = await result.json()
    setEntries(result.entries)
    console.log(result)
}
  useEffect(() => {
    fetchEntries();
  }, []);

  function col(score){
    if(score<0)
        return 'red'
    if(score>=0.6)
        return 'green'
    else
        return 'black'

}

  return (
    <div className="container">
      <h2>All Entries</h2>
      <ul>
      {entries.map((i)=>
        <div style={{borderStyle:"solid",padding:"2rem",marginBottom:"2rem",borderRadius:"10px"}}>
          <h2 style={{color:col(i[3])}}>{i[0]}</h2>
          <h3 style={{textAlign:"center"}}>
          {i[2].slice(0,-12)}
          </h3>
          <Link to={`/../analysis/${i[1]}`}>
          <button>
          View analysis
          </button>
          </Link>
          <br></br>
        </div>
        )}
      </ul>
    </div>
  );
}

export default Entries;
