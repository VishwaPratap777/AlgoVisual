import React, { useState, useEffect, useCallback, useRef } from 'react';
import SearchVisualizer from './SearchVisualizer';
import Navbar from './Navbar';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const [currentSection, setCurrentSection] = useState('sorting');
  const [array, setArray] = useState([]);
  const [numBars, setNumBars] = useState(15);
  const [isSorting, setIsSorting] = useState(false);
  const [barStates, setBarStates] = useState({});
  
  // BFS states
  const [bfsGrid, setBfsGrid] = useState([]);
  const [bfsStart, setBfsStart] = useState({ row: 0, col: 0 });
  const [bfsEnd, setBfsEnd] = useState({ row: 4, col: 4 });
  const [bfsPath, setBfsPath] = useState([]);
  const [isBfsRunning, setIsBfsRunning] = useState(false);
  const [bfsVisited, setBfsVisited] = useState([]);
  
  // Recursive states
  const [recursiveArray, setRecursiveArray] = useState([]);
  const [recursiveTarget, setRecursiveTarget] = useState(50);
  const [isRecursiveRunning, setIsRecursiveRunning] = useState(false);
  const [recursiveSteps, setRecursiveSteps] = useState([]);
  const [recursiveResult, setRecursiveResult] = useState(null);
  
  // Tree states
  const [treeData, setTreeData] = useState([]);
  const [treeTraversal, setTreeTraversal] = useState([]);
  const [isTreeRunning, setIsTreeRunning] = useState(false);
  const [treeType, setTreeType] = useState('binary');
  
  // Navbar scroll states
  const [navbarHidden, setNavbarHidden] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  
  const isStopRequested = useRef(false);

  // Navbar scroll animation effect
  useEffect(() => {
    let lastScrollTop = 0;
    let ticking = false;

    const updateNavbar = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down & past threshold
        setNavbarHidden(true);
      } else if (scrollTop < lastScrollTop || scrollTop <= 100) {
        // Scrolling up or at top
        setNavbarHidden(false);
      }
      
      // Add scrolled state for enhanced styling
      setNavbarScrolled(scrollTop > 50);
      
      lastScrollTop = scrollTop;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', requestTick);
    };
  }, []);

  // Generate random array
  const generateArray = useCallback(() => {
    const newArray = [];
    for (let i = 0; i < numBars; i++) {
      newArray.push(Math.floor(Math.random() * 200) + 20);
    }
    setArray(newArray);
    setBarStates({});
  }, [numBars]);

  // Initialize array on component mount
  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Initialize BFS grid
  useEffect(() => {
    initializeBfsGrid();
  }, []);

  // Initialize recursive array
  useEffect(() => {
    generateRecursiveArray();
  }, []);

  // Initialize tree data
  useEffect(() => {
    generateTreeData();
  }, [treeType]);

  // Update bar count
  const updateBarCount = (value) => {
    setNumBars(parseInt(value));
  };

  // Stop sorting
  const stopSorting = () => {
    isStopRequested.current = true;
    setIsSorting(false);
  };

  // Reset visualization
  const resetVisualization = () => {
    isStopRequested.current = true;
    setIsSorting(false);
    setBarStates({});
    setTimeout(() => {
      generateArray();
      isStopRequested.current = false;
    }, 100);
  };

  // Bubble Sort
  const bubbleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    isStopRequested.current = false;

    const newArray = [...array];
    const newBarStates = {};

    for (let i = 0; i < newArray.length - 1 && !isStopRequested.current; i++) {
      for (let j = 0; j < newArray.length - i - 1 && !isStopRequested.current; j++) {
        newBarStates[j] = 'comparing';
        newBarStates[j + 1] = 'comparing';
        setBarStates({ ...newBarStates });
        
        await sleep(100);
        
        if (isStopRequested.current) break;

        if (newArray[j] > newArray[j + 1]) {
          [newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]];
          setArray([...newArray]);
        }

        newBarStates[j] = '';
        newBarStates[j + 1] = '';
        setBarStates({ ...newBarStates });
      }
      if (!isStopRequested.current) {
        newBarStates[newArray.length - 1 - i] = 'sorted';
        setBarStates({ ...newBarStates });
      }
    }

    if (!isStopRequested.current) {
      newBarStates[0] = 'sorted';
      setBarStates({ ...newBarStates });
    }
    
    setIsSorting(false);
  };

  // Insertion Sort
  const insertionSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    isStopRequested.current = false;

    const newArray = [...array];
    const newBarStates = {};

    for (let i = 1; i < newArray.length && !isStopRequested.current; i++) {
      let key = newArray[i];
      let j = i - 1;

      newBarStates[i] = 'current';
      setBarStates({ ...newBarStates });
      await sleep(150);
      
      if (isStopRequested.current) break;

      while (j >= 0 && newArray[j] > key && !isStopRequested.current) {
        newBarStates[j] = 'comparing';
        setBarStates({ ...newBarStates });
        
        newArray[j + 1] = newArray[j];
        setArray([...newArray]);
        await sleep(100);
        
        if (isStopRequested.current) break;
        
        newBarStates[j] = '';
        setBarStates({ ...newBarStates });
        j--;
      }

      if (!isStopRequested.current) {
        newArray[j + 1] = key;
        setArray([...newArray]);
        newBarStates[i] = '';
        setBarStates({ ...newBarStates });
      }
    }

    if (!isStopRequested.current) {
      for (let k = 0; k < newArray.length; k++) {
        newBarStates[k] = 'sorted';
      }
      setBarStates({ ...newBarStates });
    }
    
    setIsSorting(false);
  };

  // Selection Sort
  const selectionSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    isStopRequested.current = false;

    const newArray = [...array];
    const newBarStates = {};

    for (let i = 0; i < newArray.length && !isStopRequested.current; i++) {
      let minIdx = i;
      newBarStates[minIdx] = 'current';
      setBarStates({ ...newBarStates });

      for (let j = i + 1; j < newArray.length && !isStopRequested.current; j++) {
        newBarStates[j] = 'comparing';
        setBarStates({ ...newBarStates });
        await sleep(100);
        
        if (isStopRequested.current) break;

        if (newArray[j] < newArray[minIdx]) {
          newBarStates[minIdx] = '';
          minIdx = j;
          newBarStates[minIdx] = 'current';
          setBarStates({ ...newBarStates });
        } else {
          newBarStates[j] = '';
          setBarStates({ ...newBarStates });
        }
      }

      if (!isStopRequested.current && minIdx !== i) {
        [newArray[i], newArray[minIdx]] = [newArray[minIdx], newArray[i]];
        setArray([...newArray]);
      }

      if (!isStopRequested.current) {
        newBarStates[i] = 'sorted';
        newBarStates[minIdx] = '';
        setBarStates({ ...newBarStates });
      }
    }
    
    setIsSorting(false);
  };

  // Quick Sort
  const quickSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    isStopRequested.current = false;

    const newArray = [...array];
    await quickSortHelper(newArray, 0, newArray.length - 1);
    
    if (!isStopRequested.current) {
      const newBarStates = {};
      for (let i = 0; i < newArray.length; i++) {
        newBarStates[i] = 'sorted';
      }
      setBarStates({ ...newBarStates });
    }
    
    setIsSorting(false);
  };

  const quickSortHelper = async (arr, low, high) => {
    if (isStopRequested.current) return;
    
    if (low < high && !isStopRequested.current) {
      let pi = await partition(arr, low, high);
      await quickSortHelper(arr, low, pi - 1);
      await quickSortHelper(arr, pi + 1, high);
    }
  };

  const partition = async (arr, low, high) => {
    if (isStopRequested.current) return low;
    
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high && !isStopRequested.current; j++) {
      setBarStates(prev => ({ ...prev, [j]: 'comparing', [high]: 'current' }));
      await sleep(150);
      
      if (isStopRequested.current) break;

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
      }

      setBarStates(prev => ({ ...prev, [j]: '' }));
    }

    if (!isStopRequested.current) {
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      setBarStates(prev => ({ ...prev, [high]: '' }));
    }

    return i + 1;
  };

  // Merge Sort
  const mergeSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    isStopRequested.current = false;

    const newArray = [...array];
    await mergeSortHelper(newArray, 0, newArray.length - 1);
    
    if (!isStopRequested.current) {
      const newBarStates = {};
      for (let i = 0; i < newArray.length; i++) {
        newBarStates[i] = 'sorted';
      }
      setBarStates({ ...newBarStates });
    }
    
    setIsSorting(false);
  };

  const mergeSortHelper = async (arr, start, end) => {
    if (isStopRequested.current) return;
    
    if (start < end && !isStopRequested.current) {
      let mid = Math.floor((start + end) / 2);
      await mergeSortHelper(arr, start, mid);
      await mergeSortHelper(arr, mid + 1, end);
      await merge(arr, start, mid, end);
    }
  };

  const merge = async (arr, start, mid, end) => {
    if (isStopRequested.current) return;
    
    let left = arr.slice(start, mid + 1);
    let right = arr.slice(mid + 1, end + 1);

    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length && !isStopRequested.current) {
      setBarStates(prev => ({ ...prev, [k]: 'comparing' }));
      await sleep(150);
      
      if (isStopRequested.current) break;

      if (left[i] <= right[j]) {
        arr[k] = left[i++];
      } else {
        arr[k] = right[j++];
      }

      setArray([...arr]);
      setBarStates(prev => ({ ...prev, [k]: '' }));
      k++;
    }

    while (i < left.length && !isStopRequested.current) {
      arr[k] = left[i++];
      setArray([...arr]);
      k++;
      await sleep(100);
    }

    while (j < right.length && !isStopRequested.current) {
      arr[k] = right[j++];
      setArray([...arr]);
      k++;
      await sleep(100);
    }
  };

  // Heap Sort
  const heapSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    isStopRequested.current = false;

    const newArray = [...array];
    let n = newArray.length;

    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0 && !isStopRequested.current; i--) {
      await heapify(newArray, n, i);
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0 && !isStopRequested.current; i--) {
      [newArray[0], newArray[i]] = [newArray[i], newArray[0]];
      setArray([...newArray]);

      if (!isStopRequested.current) {
        setBarStates(prev => ({ ...prev, [i]: 'sorted' }));
        await heapify(newArray, i, 0);
      }
    }

    if (!isStopRequested.current) {
      setBarStates(prev => ({ ...prev, [0]: 'sorted' }));
    }
    
    setIsSorting(false);
  };

  const heapify = async (arr, n, i) => {
    if (isStopRequested.current) return;
    
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;

    if (largest !== i && !isStopRequested.current) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      
      setBarStates(prev => ({ 
        ...prev, 
        [i]: 'comparing', 
        [largest]: 'comparing' 
      }));

      await sleep(150);
      
      if (!isStopRequested.current) {
        setBarStates(prev => ({ 
          ...prev, 
          [i]: '', 
          [largest]: '' 
        }));
        await heapify(arr, n, largest);
      }
    }
  };

  // Shell Sort
  const shellSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    isStopRequested.current = false;

    const newArray = [...array];
    let n = newArray.length;
    let gap = Math.floor(n / 2);

    while (gap > 0 && !isStopRequested.current) {
      for (let i = gap; i < n && !isStopRequested.current; i++) {
        let temp = newArray[i];
        let j = i;

        setBarStates(prev => ({ ...prev, [i]: 'current' }));
        await sleep(150);

        while (j >= gap && newArray[j - gap] > temp && !isStopRequested.current) {
          setBarStates(prev => ({ ...prev, [j - gap]: 'comparing' }));
          newArray[j] = newArray[j - gap];
          setArray([...newArray]);
          await sleep(100);
          setBarStates(prev => ({ ...prev, [j - gap]: '' }));
          j -= gap;
        }

        if (!isStopRequested.current) {
          newArray[j] = temp;
          setArray([...newArray]);
          setBarStates(prev => ({ ...prev, [i]: '' }));
        }
      }
      gap = Math.floor(gap / 2);
    }

    if (!isStopRequested.current) {
      const newBarStates = {};
      for (let k = 0; k < newArray.length; k++) {
        newBarStates[k] = 'sorted';
      }
      setBarStates({ ...newBarStates });
    }

    setIsSorting(false);
  };

  // BFS Functions
  const initializeBfsGrid = () => {
    const grid = [];
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        row.push({
          row: i,
          col: j,
          isWall: Math.random() < 0.3,
          isStart: i === 0 && j === 0,
          isEnd: i === 4 && j === 4,
          isVisited: false,
          isPath: false
        });
      }
      grid.push(row);
    }
    setBfsGrid(grid);
  };

  const bfs = async () => {
    if (isBfsRunning) return;
    setIsBfsRunning(true);
    isStopRequested.current = false;
    
    const grid = bfsGrid.map(row => row.map(cell => ({ ...cell })));
    const queue = [{ row: bfsStart.row, col: bfsStart.col, path: [] }];
    const visited = new Set();
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    while (queue.length > 0 && !isStopRequested.current) {
      const { row, col, path } = queue.shift();
      const key = `${row},${col}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      // Mark as visited
      grid[row][col].isVisited = true;
      setBfsGrid([...grid]);
      setBfsVisited([...visited]);
      await sleep(100);
      
      if (isStopRequested.current) break;
      
      // Check if we reached the end
      if (row === bfsEnd.row && col === bfsEnd.col) {
        setBfsPath(path);
        break;
      }
      
      // Explore neighbors
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 &&
            !grid[newRow][newCol].isWall && !visited.has(`${newRow},${newCol}`)) {
          queue.push({
            row: newRow,
            col: newCol,
            path: [...path, { row, col }]
          });
        }
      }
    }
    
    setIsBfsRunning(false);
  };

  // Recursive Functions
  const generateRecursiveArray = () => {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(Math.floor(Math.random() * 100) + 1);
    }
    setRecursiveArray(arr.sort((a, b) => a - b));
  };

  const binarySearchRecursive = async (arr, target, left = 0, right = arr.length - 1, steps = []) => {
    if (isStopRequested.current) return -1;
    
    const mid = Math.floor((left + right) / 2);
    const currentStep = {
      left,
      right,
      mid,
      value: arr[mid],
      target
    };
    
    setRecursiveSteps([...steps, currentStep]);
    await sleep(500);
    
    if (isStopRequested.current) return -1;
    
    if (left > right) {
      setRecursiveResult({ found: false, index: -1 });
      return -1;
    }
    
    if (arr[mid] === target) {
      setRecursiveResult({ found: true, index: mid });
      return mid;
    }
    
    if (arr[mid] > target) {
      return await binarySearchRecursive(arr, target, left, mid - 1, [...steps, currentStep]);
    } else {
      return await binarySearchRecursive(arr, target, mid + 1, right, [...steps, currentStep]);
    }
  };

  const startRecursiveSearch = async () => {
    if (isRecursiveRunning) return;
    setIsRecursiveRunning(true);
    isStopRequested.current = false;
    setRecursiveSteps([]);
    setRecursiveResult(null);
    
    await binarySearchRecursive(recursiveArray, recursiveTarget);
    setIsRecursiveRunning(false);
  };

  // Tree Functions
  const generateTreeData = () => {
    if (treeType === 'binary') {
      const tree = [
        { id: 1, value: 50, children: [2, 3] },
        { id: 2, value: 25, children: [4, 5] },
        { id: 3, value: 75, children: [6, 7] },
        { id: 4, value: 12, children: [] },
        { id: 5, value: 37, children: [] },
        { id: 6, value: 62, children: [] },
        { id: 7, value: 87, children: [] }
      ];
      setTreeData(tree);
    } else {
      const tree = [
        { id: 1, value: 'A', children: [2, 3, 4] },
        { id: 2, value: 'B', children: [5, 6] },
        { id: 3, value: 'C', children: [7] },
        { id: 4, value: 'D', children: [] },
        { id: 5, value: 'E', children: [] },
        { id: 6, value: 'F', children: [] },
        { id: 7, value: 'G', children: [] }
      ];
      setTreeData(tree);
    }
  };

  const traverseTree = async (type) => {
    if (isTreeRunning) return;
    setIsTreeRunning(true);
    isStopRequested.current = false;
    setTreeTraversal([]);
    
    const visited = new Set();
    const result = [];
    
    if (type === 'inorder') {
      await inorderTraversal(1, visited, result);
    } else if (type === 'preorder') {
      await preorderTraversal(1, visited, result);
    } else if (type === 'postorder') {
      await postorderTraversal(1, visited, result);
    }
    
    setIsTreeRunning(false);
  };

  const inorderTraversal = async (nodeId, visited, result) => {
    if (isStopRequested.current) return;
    
    const node = treeData.find(n => n.id === nodeId);
    if (!node || visited.has(nodeId)) return;
    
    visited.add(nodeId);
    
    // Traverse left subtree
    if (node.children[0]) {
      await inorderTraversal(node.children[0], visited, result);
    }
    
    // Visit current node
    result.push(node.value);
    setTreeTraversal([...result]);
    await sleep(500);
    
    if (isStopRequested.current) return;
    
    // Traverse right subtree
    if (node.children[1]) {
      await inorderTraversal(node.children[1], visited, result);
    }
  };

  const preorderTraversal = async (nodeId, visited, result) => {
    if (isStopRequested.current) return;
    
    const node = treeData.find(n => n.id === nodeId);
    if (!node || visited.has(nodeId)) return;
    
    visited.add(nodeId);
    
    // Visit current node
    result.push(node.value);
    setTreeTraversal([...result]);
    await sleep(500);
    
    if (isStopRequested.current) return;
    
    // Traverse children
    for (const childId of node.children) {
      await preorderTraversal(childId, visited, result);
    }
  };

  const postorderTraversal = async (nodeId, visited, result) => {
    if (isStopRequested.current) return;
    
    const node = treeData.find(n => n.id === nodeId);
    if (!node || visited.has(nodeId)) return;
    
    visited.add(nodeId);
    
    // Traverse children
    for (const childId of node.children) {
      await postorderTraversal(childId, visited, result);
    }
    
    if (isStopRequested.current) return;
    
    // Visit current node
    result.push(node.value);
    setTreeTraversal([...result]);
    await sleep(500);
  };

  // Start sorting based on algorithm
  const startSorting = async (algorithm) => {
    if (isSorting) {
      alert("Sorting is already in progress!");
      return;
    }
    
    if (!array || array.length === 0) {
      alert("Please generate an array first!");
      return;
    }
    
    switch (algorithm) {
      case "bubble":
        await bubbleSort();
        break;
      case "insertion":
        await insertionSort();
        break;
      case "selection":
        await selectionSort();
        break;
      case "quick":
        await quickSort();
        break;
      case "merge":
        await mergeSort();
        break;
      case "heap":
        await heapSort();
        break;
      case "shell":
        await shellSort();
        break;
      default:
        break;
    }
  };

  const renderSortingSection = () => (
    <section id="sorting" className="section">
      <div className="section-header">
        <h2 className="section-title">Sorting Algorithms</h2>
        <p className="section-subtitle">Visualize different sorting algorithms in action</p>
      </div>

      <div className="controls-section">
        <div className="controls-row">
          <div className="control-group">
            <label className="control-label">Array Size:</label>
            <input 
              type="range" 
              min="5" 
              max="50" 
              value={numBars} 
              onChange={(e) => updateBarCount(e.target.value)}
              disabled={isSorting}
            />
            <span className="control-label">{numBars}</span>
          </div>
        </div>

        <div className="algorithm-buttons">
          <button 
            className="algorithm-btn"
            onClick={() => startSorting('quick')} 
            disabled={isSorting}
          >
            Quick Sort
          </button>
          <button 
            className="algorithm-btn"
            onClick={() => startSorting('bubble')} 
            disabled={isSorting}
          >
            Bubble Sort
          </button>
          <button 
            className="algorithm-btn"
            onClick={() => startSorting('insertion')} 
            disabled={isSorting}
          >
            Insertion Sort
          </button>
          <button 
            className="algorithm-btn"
            onClick={() => startSorting('selection')} 
            disabled={isSorting}
          >
            Selection Sort
          </button>
          <button 
            className="algorithm-btn"
            onClick={() => startSorting('heap')} 
            disabled={isSorting}
          >
            Heap Sort
          </button>
          <button 
            className="algorithm-btn"
            onClick={() => startSorting('merge')} 
            disabled={isSorting}
          >
            Merge Sort
          </button>
          <button 
            className="algorithm-btn"
            onClick={() => startSorting('shell')} 
            disabled={isSorting}
          >
            Shell Sort
          </button>
        </div>

        <div className="controls-row">
          <button className="btn btn-primary" onClick={generateArray} disabled={isSorting}>
            Generate Array
          </button>
          <button className="btn btn-secondary" onClick={stopSorting} disabled={!isSorting}>
            Stop Sorting
          </button>
          <button className="btn btn-success" onClick={resetVisualization}>
            Reset
          </button>
        </div>
      </div>

      <div className="bar-container">
        {array.map((value, index) => (
          <div
            key={index}
            className={`bar ${barStates[index] || ''}`}
            style={{ height: `${value}px` }}
          >
            {value}
          </div>
        ))}
      </div>
    </section>
  );

  const renderBfsSection = () => (
    <section id="bfs" className="section">
      <div className="section-header">
        <h2 className="section-title">Breadth-First Search</h2>
        <p className="section-subtitle">Visualize BFS pathfinding on a grid</p>
      </div>

      <div className="controls-section">
        <div className="controls-row">
          <button 
            className="algorithm-btn"
            onClick={bfs}
            disabled={isBfsRunning}
          >
            Start BFS
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              isStopRequested.current = true;
              setIsBfsRunning(false);
            }}
            disabled={!isBfsRunning}
          >
            Stop BFS
          </button>
          <button 
            className="btn btn-success"
            onClick={() => {
              initializeBfsGrid();
              setBfsPath([]);
              setBfsVisited([]);
            }}
          >
            Reset Grid
          </button>
        </div>
      </div>

      <div className="bfs-grid-container">
        <div className="bfs-grid">
          {bfsGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="bfs-row">
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`bfs-cell ${
                    cell.isWall ? 'wall' :
                    cell.isStart ? 'start' :
                    cell.isEnd ? 'end' :
                    cell.isVisited ? 'visited' :
                    bfsPath.some(p => p.row === rowIndex && p.col === colIndex) ? 'path' : ''
                  }`}
                >
                  {cell.isStart && 'S'}
                  {cell.isEnd && 'E'}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="legend">
        <h3>Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color start-color"></div>
            <span className="legend-text">Start</span>
          </div>
          <div className="legend-item">
            <div className="legend-color end-color"></div>
            <span className="legend-text">End</span>
          </div>
          <div className="legend-item">
            <div className="legend-color wall-color"></div>
            <span className="legend-text">Wall</span>
          </div>
          <div className="legend-item">
            <div className="legend-color visited-color"></div>
            <span className="legend-text">Visited</span>
          </div>
          <div className="legend-item">
            <div className="legend-color path-color"></div>
            <span className="legend-text">Path</span>
          </div>
        </div>
      </div>
    </section>
  );

  const renderRecursiveSection = () => (
    <section id="recursive" className="section">
      <div className="section-header">
        <h2 className="section-title">Recursive Binary Search</h2>
        <p className="section-subtitle">Visualize recursive binary search algorithm</p>
      </div>

      <div className="controls-section">
        <div className="controls-row">
          <div className="control-group">
            <label className="control-label">Target Value:</label>
            <input
              type="number"
              value={recursiveTarget}
              onChange={(e) => setRecursiveTarget(parseInt(e.target.value) || 0)}
              disabled={isRecursiveRunning}
              min="1"
              max="100"
            />
          </div>
        </div>

        <div className="controls-row">
          <button 
            className="algorithm-btn"
            onClick={startRecursiveSearch}
            disabled={isRecursiveRunning}
          >
            Start Search
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              isStopRequested.current = true;
              setIsRecursiveRunning(false);
            }}
            disabled={!isRecursiveRunning}
          >
            Stop Search
          </button>
          <button 
            className="btn btn-success"
            onClick={() => {
              generateRecursiveArray();
              setRecursiveSteps([]);
              setRecursiveResult(null);
            }}
          >
            New Array
          </button>
        </div>
      </div>

      <div className="search-array">
        {recursiveArray.map((value, index) => (
          <div
            key={index}
            className={`search-element ${
              recursiveSteps.length > 0 && 
              recursiveSteps[recursiveSteps.length - 1].mid === index ? 'searching' :
              recursiveSteps.some(step => step.left <= index && index <= step.right) ? 'searched' :
              recursiveResult && recursiveResult.found && recursiveResult.index === index ? 'found' : ''
            }`}
          >
            {value}
          </div>
        ))}
      </div>

      {recursiveSteps.length > 0 && (
        <div className="search-info">
          <h4>Search Steps:</h4>
          <div className="search-steps">
            {recursiveSteps.map((step, index) => (
              <div key={index} className="step-info">
                <span>Step {index + 1}:</span>
                <span>Left: {step.left}, Right: {step.right}, Mid: {step.mid}</span>
                <span>Value at mid: {step.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recursiveResult && (
        <div className={`result-display ${recursiveResult.found ? 'result-success' : 'result-error'}`}>
          {recursiveResult.found 
            ? `Found ${recursiveTarget} at index ${recursiveResult.index}`
            : `${recursiveTarget} not found in the array`
          }
        </div>
      )}
    </section>
  );

  const renderTreeSection = () => (
    <section id="tree" className="section">
      <div className="section-header">
        <h2 className="section-title">Tree Traversal Algorithms</h2>
        <p className="section-subtitle">Visualize different tree traversal methods</p>
      </div>

      <div className="controls-section">
        <div className="controls-row">
          <div className="control-group">
            <label className="control-label">Tree Type:</label>
            <select
              value={treeType}
              onChange={(e) => setTreeType(e.target.value)}
              disabled={isTreeRunning}
              className="tree-select"
            >
              <option value="binary">Binary Tree</option>
              <option value="general">General Tree</option>
            </select>
          </div>
        </div>

        <div className="algorithm-buttons">
          <button 
            className="algorithm-btn"
            onClick={() => traverseTree('inorder')}
            disabled={isTreeRunning}
          >
            Inorder
          </button>
          <button 
            className="algorithm-btn"
            onClick={() => traverseTree('preorder')}
            disabled={isTreeRunning}
          >
            Preorder
          </button>
          <button 
            className="algorithm-btn"
            onClick={() => traverseTree('postorder')}
            disabled={isTreeRunning}
          >
            Postorder
          </button>
        </div>

        <div className="controls-row">
          <button 
            className="btn btn-secondary"
            onClick={() => {
              isStopRequested.current = true;
              setIsTreeRunning(false);
            }}
            disabled={!isTreeRunning}
          >
            Stop Traversal
          </button>
          <button 
            className="btn btn-success"
            onClick={() => {
              setTreeTraversal([]);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="tree-container">
        <div className="tree-visualization">
          {treeData.map((node) => (
            <div key={node.id} className="tree-node">
              <div className={`node-value ${
                treeTraversal.includes(node.value) ? 'traversed' : ''
              }`}>
                {node.value}
              </div>
              {node.children.length > 0 && (
                <div className="node-children">
                  {node.children.map((childId) => {
                    const childNode = treeData.find(n => n.id === childId);
                    return childNode ? (
                      <div key={childId} className="child-node">
                        <div className="connection-line"></div>
                        <div className={`node-value ${
                          treeTraversal.includes(childNode.value) ? 'traversed' : ''
                        }`}>
                          {childNode.value}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {treeTraversal.length > 0 && (
        <div className="traversal-result">
          <h4>Traversal Order:</h4>
          <div className="traversal-sequence">
            {treeTraversal.map((value, index) => (
              <span key={index} className="traversal-item">
                {value}{index < treeTraversal.length - 1 ? ' → ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );

  return (
    <div className="app">
      {/* Navbar with dynamic classes for scroll animation */}
      <nav className={`navbar ${navbarHidden ? 'navbar-hidden' : 'navbar-visible'} ${navbarScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#" className="nav-brand">AL-GOTH</a>
          <ul className="nav-menu">
            <li className="nav-item">
              <a
                href="#sorting" 
                className={`nav-link ${currentSection === 'sorting' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentSection('sorting');
                }}
              >
                Sorting
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#searching" 
                className={`nav-link ${currentSection === 'searching' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentSection('searching');
                }}
              >
                Searching
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#bfs" 
                className={`nav-link ${currentSection === 'bfs' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentSection('bfs');
                }}
              >
                BFS
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#recursive" 
                className={`nav-link ${currentSection === 'recursive' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentSection('recursive');
                }}
              >
                Recursive
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#tree" 
                className={`nav-link ${currentSection === 'tree' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentSection('tree');
                }}
              >
                Tree
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {currentSection === 'sorting' && renderSortingSection()}
        {currentSection === 'searching' && <SearchVisualizer />}
        {currentSection === 'bfs' && renderBfsSection()}
        {currentSection === 'recursive' && renderRecursiveSection()}
        {currentSection === 'tree' && renderTreeSection()}
      </div>
    </div>
  );
}

export default App;