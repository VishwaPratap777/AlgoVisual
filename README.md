# Algorithm Visualiser - React Version

A beautiful and interactive sorting algorithm visualiser built with React. Watch 7 different sorting algorithms in action with real-time animations and color-coded bars.

## Features

- **7 Sorting Algorithms**: Quick Sort, Bubble Sort, Insertion Sort, Selection Sort, Heap Sort, Merge Sort, Shell Sort
- **Real-time Visualization**: Watch bars move and change colors as algorithms sort
- **Interactive Controls**: Adjust number of bars, generate new arrays, stop/reset sorting
- **Beautiful UI**: Modern gradient design with smooth animations
- **Responsive**: Works on desktop and mobile devices

## Color Coding

- **Blue**: Default state
- **Red**: Currently being compared
- **Orange**: Current element being processed
- **Green**: Sorted elements

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Generate Array**: Click "Generate Array" to create a new random array
2. **Adjust Bars**: Use the slider to change the number of bars (5-50)
3. **Choose Algorithm**: Click any sorting algorithm button to start visualization
4. **Control**: Use "Stop Sorting" to pause or "Reset" to start over

## Available Algorithms

### Quick Sort
- **Time Complexity**: O(n log n) average, O(n²) worst case
- **Space Complexity**: O(log n)
- **Best for**: Large datasets, in-place sorting

### Bubble Sort
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)
- **Best for**: Educational purposes, small datasets

### Insertion Sort
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)
- **Best for**: Small datasets, nearly sorted data

### Selection Sort
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)
- **Best for**: Small datasets, minimal memory usage

### Heap Sort
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(1)
- **Best for**: In-place sorting with guaranteed performance

### Merge Sort
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(n)
- **Best for**: Stable sorting, large datasets

### Shell Sort
- **Time Complexity**: O(n log n) to O(n²) depending on gap sequence
- **Space Complexity**: O(1)
- **Best for**: Medium-sized datasets, improvement over insertion sort

## Technologies Used

- **React 18**: Modern React with hooks
- **CSS3**: Custom styling with gradients and animations
- **JavaScript ES6+**: Modern JavaScript features

## Project Structure

```
src/
├── App.js          # Main React component
├── index.js        # React entry point
└── index.css       # Global styles

public/
└── index.html      # HTML template
```

## Contributing

Feel free to contribute by:
- Adding new sorting algorithms
- Improving the UI/UX
- Adding performance metrics
- Fixing bugs

## License

This project is open source and available under the MIT License. 