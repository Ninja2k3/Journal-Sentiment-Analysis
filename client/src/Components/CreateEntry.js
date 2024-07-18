// src/components/CreateEntry.js
import React, { useState } from 'react';
import axios from 'axios';

function CreateEntry({ fetchEntries }) {
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/entries', { content });
      setContent('');
      setSuccess('Entry added successfully');
      setError('');
      fetchEntries();
    } catch (error) {
      setError('There was an error creating the entry!');
      setSuccess('');
    }
  };

  return (
    <div className="container">
      <h2>Create New Entry</h2>
      {success && <div className="success">{success}</div>}
      {error && <div className="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Content:</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
}

export default CreateEntry;
