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

  return (
    <div className="container">
      <h2>All Entries</h2>
      <ul>
      {entries.map((i)=>
        <div>
          <p>
          {i[0]}
          {i[2].slice(0,-12)}
          </p>
          <Link to={`/../analysis/${i[1]}`}>
          View analysis
          </Link>
          <br></br>
        </div>
        )}
      </ul>
    </div>
  );
}

export default Entries;
