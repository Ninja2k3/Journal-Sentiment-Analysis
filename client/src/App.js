import { BrowserRouter , Route, Routes } from "react-router-dom";
import React from "react";
import Analysis from "./Components/Analysis";
import Form from "./Components/Form";
import axios from 'axios';
import './App.css';
import CreateEntry from "./Components/CreateEntry";
import Entries from "./Components/Entries";
import Navigation from "./Components/Navigation";
import Plot from "./Components/Plot";

function App() {

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/analysis/:id" element={<Analysis/>}/>
      <Route path="/entries" element={<MainLayout><Entries /></MainLayout>} />
      <Route path="/create" element={<Form/>}/>
      <Route path="/plot" element={<Plot/>}/>
    </Routes>
  </BrowserRouter>  
  
  );
}
function MainLayout({ children }) {
  return (
    <div>
      <Navigation />
      <div className="container">
        {children}
      </div>
    </div>
  );
}

function CreateEntryWrapper() {
  const [entries, setEntries] = React.useState([]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/entries');
      setEntries(response.data);
    } catch (error) {
      console.error('There was an error fetching the entries!', error);
    }
  };

  React.useEffect(() => {
    fetchEntries();
  }, []);

  return <CreateEntry fetchEntries={fetchEntries} />;
}


export default App;
