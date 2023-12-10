if (typeof fileName_D !== 'undefined')
{

calculateLayers().then(function(layers) {

    var width = 1200;
    var height = 800;

    // Create a new SVG container
    var svg = d3.select("#radial-layout").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Read the CSV file
    d3.csv("/static/"+fileName_D).then(function(data) {
        // Extract node names
        var nodeNames = data.columns.slice(1);

        // Convert data to adjacency matrix
        var matrix = data.map(function(row) {
            return nodeNames.map(function(node) {
                return +row[node]; 
            });
        });
        console.log(matrix);
        // Compute the layout
        var layout = customRadialSugiyama(matrix, layers);

        // Draw the nodes
        svg.selectAll(".node")
            .data(layout.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 20) // Node radius
            .attr("cx", function(d) {
                return width/2 + d.x; 
            })
            .attr("cy", function(d) {
                return height/2 + d.y; 
            })
            .attr("fill", "orange")
            .attr("stroke","black")

            .on('mouseover',function()
            {
                d3.select(this)
                .attr('r',30)
            })
            .on('mouseout',function()
            {
                d3.select(this)
                .attr('r',20)
            })
            ;

        // Add node labels
        svg.selectAll(".node-label")
            .data(layout.nodes)
            .enter().append("text")
            .attr("class", "node-label")
            .attr("x", function(d) {
                return width/2 + d.x; 
            })
            .attr("y", function(d) {
                return height/2 + d.y; 
            })
            .attr("dy", 5) 
            .attr("text-anchor", "middle")
            .text(function(d, i) {
                return nodeNames[i]; 
            });

        // Draw the links
        svg.selectAll(".link")
            .data(layout.links)
            .enter().append("line") 
            .attr("class", "link")
            .attr("x1", function(d) {
                return width/2 + d.source.x; 
            })
            .attr("y1", function(d) {
                return height/2 + d.source.y; 
            })
            .attr("x2", function(d) {
                return width/2 + d.target.x-10; 
            })
            .attr("y2", function(d) {
                return height/2 + d.target.y ; 
            })
            .attr("stroke","green")
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

            svg.append("defs").append("marker")
            .attr("id", "arrowhead")
            .attr("refX", 10) 
            .attr("refY", 3)
            .attr("markerWidth", 15)
            .attr("markerHeight", 10)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,0 L0,6 L9,3 z")
            .style("fill", "red");


    });

    // Custom radial Sugiyama layout function
    function customRadialSugiyama(matrix, layers) {
        var nodes = [];
        var links = [];

        // Calculate the angle step
        var angleStep = 3 * Math.PI / matrix.length;

        // Create nodes
        for (var i = 0; i < matrix.length; i++) {
            var angle = i * angleStep;
            var radius = layers[i] *30 ; // Adjust the radius according to your needs
            var x = radius * Math.cos(angle);
            var y = radius * Math.sin(angle);

            nodes.push
            ({
                x: x,
                y: y
            });
        }

        // Create links
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === 1) {
                    links.push({
                        source: nodes[i],
                        target: nodes[j]
                    });
                }
            }
        }

        return {
            nodes: nodes,
            links: links
        };
    }

}).catch(function(error) {
    console.error("Error in calculateLayers:", error);
});

}
