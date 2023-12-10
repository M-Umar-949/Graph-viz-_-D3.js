if (typeof fileName_T !== 'undefined')
{


function readAndDrawTree(csvFilePath) {
    d3.csv(csvFilePath).then(function(data) {
        // Extract the node names
        const nodes = data.columns.slice(1);

        const incomingEdges = new Set();
        const outgoingEdges = new Set();

        data.forEach(row => {
            const source = row[""];
            nodes.forEach(target => {
                if (row[target] === "1") {
                    incomingEdges.add(target);
                    outgoingEdges.add(source);
                }
            });
        });

        const rootCandidates = nodes.filter(node => !incomingEdges.has(node) && outgoingEdges.has(node));

        if (rootCandidates.length === 1) {
            const root = rootCandidates[0];

            const svg = d3.select("#tree-layout").append("svg")
                .attr("width", 1000)  
                .attr("height", 1000) 
                .attr("viewBox", "10 80 800 600")
                .style("margin-left", `${600}px`);  

            drawBottomUpRheingoldTilfordTree(svg, data, nodes, root);
        } else {
            console.error("Error: Unable to identify a unique root node.");
        }
    });
}

const nodeCoordinates = {};
const nodeLevels = {}; 

function drawBottomUpRheingoldTilfordTree(svg, data, nodes, root) {
    const nodeRadius = 20;
    const horizontalSpacing = 120;
    const verticalSpacing = 150;

    // Assign coordinates to nodes using DFS
    var childrenCount = 0;
    function assignCoordinatesDFS(node, depth, parentX) {
        const x = parentX + (horizontalSpacing * childrenCount) + horizontalSpacing;
        const y = depth * verticalSpacing + 10;
        nodeCoordinates[node] = { x, y };
        nodeLevels[node] = depth; 

        const children = data.find(row => row[""] === node);
        if (children) {
            const childrenCount = nodes.reduce((count, child) => count + (children[child] === "1" ? 1 : 0), 0);
            let currentX = x - (horizontalSpacing * childrenCount / 2);

            nodes.forEach(child => {
                if (children[child] === "1") {
                    assignCoordinatesDFS(child, depth + 1, currentX);
                    currentX += horizontalSpacing;
                }
            });
        }
    }

    assignCoordinatesDFS(root, 0, 0);

    // Draw links
    data.forEach(row => {
        const source = row[""];
        nodes.forEach(target => {
            if (row[target] === "1") {
                const startX = nodeCoordinates[source].x + nodeRadius;
                const startY = nodeCoordinates[source].y + nodeRadius;
                const endX = nodeCoordinates[target].x - nodeRadius;
                const endY = nodeCoordinates[target].y + nodeRadius;

                svg.append("line")
                    .attr("x1", startX-25)
                    .attr("y1", startY-10)
                    .attr("x2", endX+30)
                    .attr("y2", endY-30)
                    .attr("stroke", "green")
                    .on('mouseover',function()
                    {
                        d3.select(this)
                        .attr('stroke-width',7)
                     })
                    .on('mouseout',function()
                    {
                        d3.select(this)
                        .attr('stroke-width',1)
                    });
            }
        });
    });

    // Draw nodes with levels
    nodes.forEach(node => {
        const x = nodeCoordinates[node].x;
        const y = nodeCoordinates[node].y;

        svg.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", nodeRadius)
            .attr("fill", "#ffcc00")
            
            .on('mouseover',function()
            {
                d3.select(this)
                .attr('r',30)
            })
            .on('mouseout',function()
            {
                d3.select(this)
                .attr('r',20)
            });

        svg.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .text(`${node} `);
            // (Level ${nodeLevels[node]})
    });

    console.log("Node Coordinates:", nodeCoordinates);
    console.log("Node Levels:", nodeLevels); 
}

const csvFilePath = "/static/"+fileName_T;
readAndDrawTree(csvFilePath);

}