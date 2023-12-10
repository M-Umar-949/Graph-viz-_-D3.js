if (typeof fileName_T !== 'undefined') {
    d3.csv("/static/" + fileName_T).then(function (data) {
        // Extract node names for labeling
        var nodeNames = data.columns.slice(1);

        var matrix = data.map(function (row) {
            return Object.values(row).slice(1).map(Number);
        });

        const incomingEdges = new Set();
        const outgoingEdges = new Set();

        data.forEach(row => {
            const source = row[""];
            nodeNames.forEach(target => {
                if (row[target] === "1") {
                    incomingEdges.add(target);
                    outgoingEdges.add(source);
                }
            });
        });

        const rootCandidates = nodeNames.filter(node => !incomingEdges.has(node) && outgoingEdges.has(node));

        if (rootCandidates.length === 1) {
            const rootName = rootCandidates[0];

            // Create hierarchical data structure
            var hierarchicalData = buildHierarchy(rootName);

            // Function to build the hierarchical data structure
            function buildHierarchy(rootName) {
                var root = {
                    name: rootName,
                    children: []
                };

                var rootIndex = nodeNames.indexOf(rootName);

                for (var i = 0; i < nodeNames.length; i++) {
                    if (matrix[rootIndex][i] === 1) {
                        var node = {
                            name: nodeNames[i],
                            children: []
                        };

                        for (var j = 0; j < nodeNames.length; j++) {
                            if (matrix[i][j] === 1) {
                                node.children.push({ name: nodeNames[j] });
                            }
                        }

                        root.children.push(node);
                    }
                }

                return root;
            }

            var width = 600;
            var height = 300;

            var svg = d3.select("#icicle-layout").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(0,0)");

            var color = d3.scaleOrdinal(d3.schemeCategory10);

            var partition = d3.partition()
                .size([width, height])
                .padding(1)
                .round(true);

            var rootHierarchy = d3.hierarchy(hierarchicalData)
                .sum(function (d) { return d.children ? 0 : 1; });

            partition(rootHierarchy);

            var cell = svg.selectAll(".icicle")
                .data(rootHierarchy.descendants())
                .enter().append("g")
                .attr("class", "icicle")
                .attr("transform", function (d) {
                    return "translate(" + d.x0 + "," + d.y0 + ")";
                });

            cell.append("rect")
                .attr("width", function (d) { return d.x1 - d.x0; })
                .attr("height", function (d) { return d.y1 - d.y0; })
                .attr("fill", function (d) { return color((d.children ? d : d.parent).data.name); });

            cell.append("text")
                .attr("x", 3)
                .attr("y", 13)
                .attr("dy", ".35em")
                .text(function (d) { return d.data.name; });
        } else {
            console.error('There is no unique root node.');
        }
    });
}
