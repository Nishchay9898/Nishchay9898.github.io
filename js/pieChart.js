(function pieChart() {

    var pieChart = d3.select("#pieChart"),
        width = pieChart.attr("width"),
        height = pieChart.attr("height"),
        radius = Math.min(width, height) / 2;

    var g = pieChart.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c', 'rgb(223,151,172)']);


    var pie = d3.pie().value(function (d) {
        return d.deaths;
    });

    var path = d3.arc()
        .outerRadius(radius - 15)
        .innerRadius(0);

    var label = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius - 110);

    d3.csv("data/By_Age.csv", function (error, data) {
        if (error) {
            throw error;
        }
        var arc = g.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function (d) {
                return color(d.data.age);
            });

        console.log(arc)

        arc.append("text")
            .attr("transform", function (d) {
                return "translate(" + label.centroid(d) + ")";
            })
            .text(function (d) {
                return "[" + d.data.age + "]" + " " + d.data.deaths;
            })

    });

    pieChart.append("g")
        .attr("transform", "translate(" + (width / 2 - 180) + "," + 12 + ")")
        .append("text")
        .attr("y", 2)
        .attr("x", -20)
        .text("Death By Age")
        .attr("class", "title")
        .style("font-weight","bold")
        .style('font-size', 18)
        
}());