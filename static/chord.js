if (typeof fileName !== 'undefined') {
    // Load data from CSV file
    d3.csv("/static/"+fileName).then(function (data) {
        // Extract node names
        console.log(fileName);
        var nodes = data.columns.slice(1);

        // Create a new graph
        var width = 600;
        var height = 600;
        var svg = d3.select('#chord-layout').append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        // Compute node positions in a circle
        var radius = 200;
        var angle = 360 / nodes.length;

        var nodePositions = {};
        nodes.forEach(function (name, index) {
            var theta = (angle * index) * (Math.PI / 180);
            nodePositions[name] = {
                x: radius * Math.cos(theta),
                y: radius * Math.sin(theta)
            };
        });

        // Create links with curved paths
        var links = [];

        data.forEach(function (row, rowIndex) {
            nodes.forEach(function (target, targetIndex) {
                if (row[target] === ' 1'||row[target] === '1') {
                    links.push({
                        source: nodes[rowIndex],
                        target: nodes[targetIndex],
                        value: 1 // You can adjust the value based on your data
                    });
                }
            });
        });
        console.log(links)
        // Draw links
        svg.selectAll('.link')
            .data(links)
            .enter().append('path')
            .attr('class', 'link')
            .attr('d', function (d) {
                var sourceX = nodePositions[d.source].x,
                    sourceY = nodePositions[d.source].y,
                    targetX = nodePositions[d.target].x,
                    targetY = nodePositions[d.target].y;

                return 'M' + sourceX + ',' + sourceY +
                    'Q' + 10 + ',' + 20 +
                    ' ' + targetX + ',' + targetY;
            })
            .style('fill', 'none')
            .style('stroke', 'green')
            .attr('stroke-width',1)
            .on('mouseover',function()
            {
                d3.select(this)
                .attr('stroke-width',7)
            })
            .on('mouseout',function()
            {
                d3.select(this)
                .attr('stroke-width',1)
            })
            ;

        // Create nodes
        var nodeElements = svg.selectAll('.node')
            .data(nodes)
            .enter().append('circle')
            .attr('class', 'node')
            .attr('r', 25)
            .attr('cx', function (d) { return nodePositions[d].x; })
            .attr('cy', function (d) { return nodePositions[d].y; })
            .style('fill', 'orange')
            .style('stroke', 'black')
            .on('mouseover',function()
            {
                d3.select(this)
                .attr('r',35)
            })
            .on('mouseout',function()
            {
                d3.select(this)
                .attr('r',25)
            });
           

        // Add labels to nodes
        var labelElements = svg.selectAll('.label')
            .data(nodes)
            .enter().append('text')
            .attr('class', 'label')
            .attr('x', function (d) { return nodePositions[d].x; })
            .attr('y', function (d) { return nodePositions[d].y + 5; })
            .attr('text-anchor', 'middle')
            .text(function (d) { return d; })
            ;

          

                
    });
} else {
    console.error('fileName is not defined. Make sure to include it in the HTML file.');
}
