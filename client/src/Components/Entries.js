// src/components/Entries.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Entries() {
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/entries');
      setEntries(response.data);
    } catch (error) {
      console.error('There was an error fetching the entries!', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="container">
      <h2>All Entries</h2>
      <ul>
        {entries.map((entry, index) => (
          <li key={index} className="entry">
            <p>{entry.content}</p>
            <p className="sentiment">Sentiment: {entry.sentiment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Entries;
