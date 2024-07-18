// src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul>
        <li><Link to="/entries">All Entries</Link></li>
        <li><Link to="/create">Create New Entry</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;
