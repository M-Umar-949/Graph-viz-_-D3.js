if (typeof fileName_D !== 'undefined')
{

calculateLayers().then(function(layers) {
    // Now you can use the layers variable
    console.log(layers);

    // Load CSV file
    d3.csv("/static/"+fileName_D).then(function(data) {
        var nodeNames = data.columns.slice(1);

        // Convert data to adjacency matrix
        var matrix = data.map(function(row) {
            return Object.values(row).slice(1).map(Number);
        });

        var svg = d3.select("#directed-layout").append("svg")
            .attr("width", 900)
            .attr("height", 1500);

        var nodeWidth = 60;
        var nodeHeight = 30;
        var layerSpacing = 60;

        // Create nodes
        var nodes = svg.selectAll(".node")
            .data(nodeNames)
            .enter().append("g")
            .attr("transform", function(d, i) {
                return "translate(" + layers[i] * layerSpacing + "," + i * nodeHeight + ")";
            });

        // Draw rectangles as nodes
        nodes.append("rect")
            .attr("width", nodeWidth)
            .attr("height", nodeHeight)
            .style("fill", "yellow")
            .style("stroke", "black")
            .on('mouseover',function()
            {
                d3.select(this)
                .attr('width',80)
                .attr('height',40);


            })
            .on('mouseout',function()
            {
                d3.select(this)
                .attr('width',nodeWidth)
                .attr('height',nodeHeight)

            });

        // Add text labels to nodes
        nodes.append("text")
            .attr("x", nodeWidth / 2)
            .attr("y", nodeHeight / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text(function(d) {
                return d;
            });

// Create links
var links = [];

for (var i = 0; i < nodeNames.length; i++) {
    for (var j = 0; j < nodeNames.length; j++) {
        if (matrix[i][j] === 1) {
            links.push({
                source: { x: layers[i], y: i },
                target: { x: layers[j], y: j }
            });
        }
    }
}

// Append arrowhead marker
svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 6) // Adjust as needed
    .attr("refY", 3)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,0 L0,6 L9,3 z")
    .style("fill", "red");

// Draw links with arrowhead
svg.selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .attr("x1", function(d) {
        return d.source.x * layerSpacing + nodeWidth / 2;
    })
    .attr("y1", function(d) {
        return d.source.y * nodeHeight + nodeHeight / 2;
    })
    .attr("x2", function(d) {
        return d.target.x * layerSpacing + nodeWidth / 2;
    })
    .attr("y2", function(d) {
        return d.target.y * nodeHeight + nodeHeight / 2-10;
    })
    .style("fill", "none")
    .style("stroke", "green")
    .attr("marker-end", "url(#arrowhead)")
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



    });
});

}
