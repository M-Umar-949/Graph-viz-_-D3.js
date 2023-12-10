# Graph-viz-_-D3.js
Demonstration of my work in d3.js

This project is build up majorly on d3.js 

All the visualizations are made custom, without using any builtin classes in d3

# Features

This project uses networkX library in python to detect the nature of the graph. The user uploads an adjacency matrix and the 
program detects if the matrix file is connected or not. If it is not connected graph file then the program alerts 
to upload a connected graph file. 

If the graph matrix is connected then it detects for 3 types of graphs.

IF Directed Acyclic Graph 
  THEN displays Directed Sugiyama and Circular Sugiyama layout

IF TREE
  THEN displays icicle and a simple Reingold tillford tree

IF General graph (with cycles)
  THEN displays a chord diagram and grid layout.

### FLASK api is used to connect analysis and visualization implementaion

- All the layouts are implemented in a separate javascript files.
