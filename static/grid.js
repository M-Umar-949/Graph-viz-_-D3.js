if (typeof fileName !== 'undefined')
{

    d3.csv('/static/'+fileName).then(function (data) {
        // Extract node names
        var nodes = data.columns.slice(1);

        // Create a new graph
        var svg = d3.select('#grid-layout').append('svg')
            .attr('width', 480)
            .attr('height', 1000);

        // Compute node positions in a grid
        var gridSize = 110;
        var nodePositions = {};
        nodes.forEach(function (name, index) {
            var row = Math.floor(index / 4); // Assuming 4 nodes per row
            var col = index % 4;
            nodePositions[name] = { x: col * gridSize + 70, y: row * gridSize + 70 };
        });

        // Create nodes
        var nodeElements = svg.selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', 25)
            .style('fill', 'orange')
            .attr('cx', function (d) { return nodePositions[d].x; })
            .attr('cy', function (d) { return nodePositions[d].y; })
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
        var labelElements = svg.selectAll('text')
            .data(nodes)
            .enter().append('text')
            .attr('x', function (d) { return nodePositions[d].x; })
            .attr('y', function (d) { return nodePositions[d].y + 5; })
            .attr('text-anchor', 'middle')
            .text(function (d) { return d; });

        // Create links based on the matrix
        var links = [];
        data.forEach(function (row, rowIndex) {
            var source = nodes[rowIndex];
            nodes.forEach(function (target, targetIndex) {
                if (row[target] === ' 1' || row[target] === '1') {
                    links.push({ source: source, target: target });
                }
            });
        });

        console.log("Links:", links);

        // Draw links with curved paths
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
                'C' + sourceX + ',' + (sourceY + targetY) / 2 +
                ' ' + targetX + ',' + (sourceY + targetY) / 2 +
                ' ' + targetX + ',' + targetY;
        })
        .style('fill', 'none')
        .style('stroke', 'green')
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

}
