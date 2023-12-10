// Sugiyama_layers.js

if (typeof fileName_D !== 'undefined')
{

function calculateLayers() {
    return new Promise(function (resolve, reject) {
        var layers;

        d3.csv("/static/"+fileName_D).then(function (data) {
            // Extract node names
            var nodeNames = data.columns.slice(1);

            // Convert data to adjacency matrix
            var matrix = data.map(function (row) {
                return Object.values(row).slice(1).map(Number);
            });

            // Function to find the topological order using Depth First Search
            function topologicalSortUtil(node, visited, stack) {
                visited[node] = true;

                for (var i = 0; i < nodeNames.length; i++) {
                    if (matrix[node][i] === 1 && !visited[i]) {
                        topologicalSortUtil(i, visited, stack);
                    }
                }

                stack.push(node);
            }

            // Function to find the topological order of nodes
            function topologicalSort() {
                var stack = [];
                var visited = Array(nodeNames.length).fill(false);

                for (var i = 0; i < nodeNames.length; i++) {
                    if (!visited[i]) {
                        topologicalSortUtil(i, visited, stack);
                    }
                }

                return stack.reverse();
            }

            // Function to find the longest path in a directed acyclic graph
            function findLongestPath(topologicalOrder) {
                var dist = Array(nodeNames.length).fill(-Infinity);
                var startNode = topologicalOrder[0];

                dist[startNode] = 0;

                for (var i = 0; i < nodeNames.length; i++) {
                    var currentNode = topologicalOrder[i];

                    for (var j = 0; j < nodeNames.length; j++) {
                        if (matrix[currentNode][j] === 1) {
                            var newPathLength = dist[currentNode] + 1;

                            if (newPathLength > dist[j]) {
                                dist[j] = newPathLength;
                            }
                        }
                    }
                }

                return dist.reduce(function (maxIndex, currentValue, currentIndex, array) {
                    return currentValue > array[maxIndex] ? currentIndex : maxIndex;
                }, 0);
            }

            // Step 1: Find topological order
            var topologicalOrder = topologicalSort();

            // Step 2: Find the node with the longest path
            var longestPathNode = findLongestPath(topologicalOrder);

            // Step 3: Calculate layers based on topological order and longest path
            layers = Array(nodeNames.length).fill(0);

            for (var i = 0; i < nodeNames.length; i++) {
                var currentNode = topologicalOrder[i];

                for (var j = 0; j < nodeNames.length; j++) {
                    if (matrix[currentNode][j] === 1) {
                        layers[j] = Math.max(layers[j], layers[currentNode] + 1);
                    }
                }
            }

            // Resolve the promise with the calculated layers
            resolve(layers);
        });
    });
}

window.calculateLayers = calculateLayers;
}
