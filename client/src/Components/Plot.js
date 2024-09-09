import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Plot() {
  const [base, setBase] = useState();
  const [windowSize1, setWindowSize1] = useState(3); // Default window size 1
  const [windowSize2, setWindowSize2] = useState(5); // Default window size 2
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate hook

  const fetchImg = async (size1, size2) => {
    setLoading(true);
    const url = `http://127.0.0.1:5000/plot?window_size1=${size1}&window_size2=${size2}`;
    try {
      let result = await fetch(url);
      result = await result.json();
      setBase(result.img);
    } catch (error) {
      console.error("Error fetching plot:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the plot when the component mounts with default window sizes
  useEffect(() => {
    fetchImg(windowSize1, windowSize2);
  }, [windowSize1, windowSize2]);

  // Handle input changes
  const handleInputChange1 = (event) => {
    setWindowSize1(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setWindowSize2(event.target.value);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchImg(windowSize1, windowSize2);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
      <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
        <label htmlFor="window_size1">Enter Moving Average Window Size 1:</label>
        <input
          type="number"
          id="window_size1"
          name="window_size1"
          min="1"
          value={windowSize1}
          onChange={handleInputChange1}
          required
        />
        <br />
        <label htmlFor="window_size2">Enter Moving Average Window Size 2:</label>
        <input
          type="number"
          id="window_size2"
          name="window_size2"
          min="1"
          value={windowSize2}
          onChange={handleInputChange2}
          required
        />
        <br />
        <button type="submit">Update Plot</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        base && <img src={`data:image/png;base64,${base}`} alt="plot" style={{ marginTop: "20px" }} />
      )}

      <button
        onClick={() => navigate(-1)}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Go Back
      </button>
    </div>
  );
}

export default Plot;
