import React, { useState, useEffect, useCallback, useRef } from 'react';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function SearchVisualizer() {
  const [array, setArray] = useState([]);
  const [numBars, setNumBars] = useState(15);
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [barStates, setBarStates] = useState({});
  const [result, setResult] = useState(null);
  
  const isStopRequested = useRef(false);

  // Generate random array
  const generateArray = useCallback(() => {
    const newArray = [];
    for (let i = 0; i < numBars; i++) {
      newArray.push(Math.floor(Math.random() * 100) + 1);
    }
    // Sort array for binary search
    newArray.sort((a, b) => a - b);
    setArray(newArray);
    setBarStates({});
    setResult(null);
  }, [numBars]);

  // Initialize array on component mount
  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Update bar count
  const updateBarCount = (value) => {
    setNumBars(parseInt(value));
  };

  // Stop searching
  const stopSearching = () => {
    isStopRequested.current = true;
    setIsSearching(false);
  };

  // Reset visualization
  const resetVisualization = () => {
    isStopRequested.current = true;
    setIsSearching(false);
    setBarStates({});
    setResult(null);
    setTimeout(() => {
      generateArray();
      isStopRequested.current = false;
    }, 100);
  };

  // Linear Search
  const linearSearch = async () => {
    if (isSearching) return;
    if (!searchValue || searchValue === '') {
      alert("Please enter a value to search!");
      return;
    }

    setIsSearching(true);
    isStopRequested.current = false;
    setResult(null);

    const searchVal = parseInt(searchValue);
    const newBarStates = {};

    for (let i = 0; i < array.length && !isStopRequested.current; i++) {
      newBarStates[i] = 'searching';
      setBarStates({ ...newBarStates });
      
      await sleep(300);
      
      if (isStopRequested.current) break;

      if (array[i] === searchVal) {
        newBarStates[i] = 'found';
        setBarStates({ ...newBarStates });
        setResult(`Found ${searchVal} at index ${i}`);
        setIsSearching(false);
        return;
      } else {
        newBarStates[i] = 'searched';
        setBarStates({ ...newBarStates });
      }
    }

    if (!isStopRequested.current) {
      setResult(`${searchVal} not found in the array`);
    }
    
    setIsSearching(false);
  };

  // Binary Search
  const binarySearch = async () => {
    if (isSearching) return;
    if (!searchValue || searchValue === '') {
      alert("Please enter a value to search!");
      return;
    }

    setIsSearching(true);
    isStopRequested.current = false;
    setResult(null);

    const searchVal = parseInt(searchValue);
    const newBarStates = {};
    let left = 0;
    let right = array.length - 1;

    while (left <= right && !isStopRequested.current) {
      const mid = Math.floor((left + right) / 2);
      
      // Highlight current search area
      for (let i = left; i <= right; i++) {
        newBarStates[i] = 'searching';
      }
      newBarStates[mid] = 'current';
      setBarStates({ ...newBarStates });
      
      await sleep(400);
      
      if (isStopRequested.current) break;

      if (array[mid] === searchVal) {
        newBarStates[mid] = 'found';
        setBarStates({ ...newBarStates });
        setResult(`Found ${searchVal} at index ${mid}`);
        setIsSearching(false);
        return;
      } else if (array[mid] < searchVal) {
        // Mark left half as searched
        for (let i = left; i <= mid; i++) {
          newBarStates[i] = 'searched';
        }
        left = mid + 1;
      } else {
        // Mark right half as searched
        for (let i = mid; i <= right; i++) {
          newBarStates[i] = 'searched';
        }
        right = mid - 1;
      }
      
      setBarStates({ ...newBarStates });
      await sleep(200);
    }

    if (!isStopRequested.current) {
      setResult(`${searchVal} not found in the array`);
    }
    
    setIsSearching(false);
  };

  // Start searching based on algorithm
  const startSearching = async (algorithm) => {
    if (isSearching) {
      alert("Searching is already in progress!");
      return;
    }
    
    if (!array || array.length === 0) {
      alert("Please generate an array first!");
      return;
    }
    
    switch (algorithm) {
      case "linear":
        await linearSearch();
        break;
      case "binary":
        await binarySearch();
        break;
      default:
        break;
    }
  };

  return (
    <section id="searching" className="section">
      <div className="section-header">
        <h2 className="section-title">Searching Algorithms</h2>
        <p className="section-subtitle">Visualize different search algorithms in action</p>
      </div>

      <div className="controls-section">
        <div className="controls-row">
          <div className="control-group">
            <label className="control-label">Array Size:</label>
            <input 
              type="range" 
              id="barCount" 
              min="5" 
              max="30" 
              value={numBars} 
              onChange={(e) => updateBarCount(e.target.value)}
              disabled={isSearching}
            />
            <span className="control-label">{numBars}</span>
          </div>
          <div className="control-group">
            <label className="control-label">Search Value:</label>
            <input 
              type="number" 
              id="searchValue"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Enter value to search"
              disabled={isSearching}
            />
          </div>
        </div>

        <div className="algorithm-buttons">
          <button 
            className="algorithm-btn"
            onClick={() => startSearching('linear')} 
            disabled={isSearching}
          >
            Linear Search
          </button>
          <button 
            className="algorithm-btn"
            onClick={() => startSearching('binary')} 
            disabled={isSearching}
          >
            Binary Search
          </button>
        </div>

        <div className="controls-row">
          <button className="btn btn-primary" onClick={generateArray} disabled={isSearching}>
            Generate Array
          </button>
          <button className="btn btn-secondary" onClick={stopSearching} disabled={!isSearching}>
            Stop Searching
          </button>
          <button className="btn btn-success" onClick={resetVisualization}>
            Reset
          </button>
        </div>
      </div>

        {result && (
          <div className={`result-display ${result.includes('Found') ? 'result-success' : 'result-error'}`}>
            {result}
          </div>
        )}

        <div className="bar-container">
          {array.map((value, index) => (
            <div
              key={index}
              className={`bar ${barStates[index] || ''}`}
              style={{ height: `${value * 2}px` }}
            >
              {value}
            </div>
          ))}
        </div>
      </section>
    );
}

export default SearchVisualizer; 