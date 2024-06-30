# Graph-viz with D3.js

A demonstration of custom visualizations built with D3.js.

This project primarily uses D3.js to create custom visualizations without relying on any built-in D3 classes.

## Features

This project leverages the `networkX` library in Python to analyze the nature of the graph. Users upload an adjacency matrix, and the program determines whether the matrix represents a connected graph. If the graph is not connected, the program alerts the user to upload a connected graph file.

If the graph matrix is connected, the program detects and visualizes three types of graphs:

1. **Directed Acyclic Graph (DAG)**
   - Displays a Directed Sugiyama layout.
   - Displays a Circular Sugiyama layout.

2. **Tree**
   - Displays an Icicle layout.
   - Displays a simple Reingold-Tilford tree layout.

3. **General Graph (with cycles)**
   - Displays a Chord diagram.
   - Displays a Grid layout.

### Implementation Details

- The analysis and visualization implementation are connected via a Flask API.
- All layouts are implemented in separate JavaScript files.

## How to Run

1. Ensure you have Python and Flask installed.
2. Install the necessary Python libraries:
    ```bash
    pip install networkx flask
    ```
3. Run the Flask server:
    ```bash
    python app.py
    ```
4. Open your web browser and navigate to the provided local server address to interact with the application.

## File Structure

- `app.py`: Main Flask application file.
- `static/js/`: Directory containing all the JavaScript files for different graph layouts.
- `templates/`: HTML templates for the web interface.

## Usage

1. Upload an adjacency matrix file via the web interface.
2. The program will analyze the matrix and determine the type of graph.
3. Depending on the type of graph, the appropriate visualization(s) will be displayed.

## Dependencies

- D3.js
- networkX
- Flask

## Future Improvements

- Enhance the user interface for a better user experience.
- Add support for additional graph types and visualizations.
- Implement performance optimizations for handling larger graphs.

Feel free to contribute to this project by opening issues or submitting pull requests.

---

This project showcases the power of custom visualizations using D3.js and the ability to analyze and visualize different types of graphs dynamically.
