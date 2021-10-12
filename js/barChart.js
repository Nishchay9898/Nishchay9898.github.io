(function barChart() {
    var barChart = d3.select("#barChart"),
        margin = 200,
        width = barChart.attr("width") - margin,
        height = barChart.attr("height") - margin;

    barChart.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 100)
        .attr("y", 50)
        // .attr("font-size", "24px")
        .text(" Death By Gender")
        .style("font-weight","bold")
        .style('font-size', 18)

    var x = d3.scaleBand().range([0, width]).padding(0.4),
        y = d3.scaleLinear().range([height, 0]);

    var g = barChart.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    d3.csv("data/By_Gender.csv", function (error, data) {
        if (error) {
            throw error;
        }

        x.domain(data.map(function (d) {
            return d.gender;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.deaths;
        })]);

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("y", height - 250)
            .attr("x", width - 150)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .attr("font-size",15)
            .text("Gender");

        g.append("g")
            .call(d3.axisLeft(y).tickFormat(function (d) {
                return "" + d;
            }).ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -5)
            .attr("x", -100)
            .attr("font-size",15)
            .attr("dy", "-3.1em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Number of Deaths");

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .on("mouseover", onMouseOver)
            .on("mouseout", onMouseOut)
            .attr("x", function (d) {
                return x(d.gender);
            })
            .attr("y", function (d) {
                return y(d.deaths);
            })
            .attr("width", x.bandwidth())
            .transition()
            .ease(d3.easeLinear)
            .duration(400)
            .delay(function (d, i) {
                return i * 25;
            })
            .attr("height", function (d) {
                return height - y(d.deaths);
            });
    });


    function onMouseOver(d, i) {
        d3.select(this).attr('class', 'color_changeBar');
        d3.select(this)
            .transition()
            .duration(400)
            .attr('width', x.bandwidth() + 5)
            .attr("y", function (d) {
                return y(d.deaths) - 10;
            })
            .attr("height", function (d) {
                return height - y(d.deaths) + 10;
            });

        g.append("text")
            .attr('class', 'val')
            .attr('x', function () {
                return x(d.gender);
            })
            .attr('y', function () {
                return y(d.deaths) - 15;
            })
            .text(function () {
                return ['' + d.deaths];
            });
    }


    function onMouseOut(d, i) {

        d3.select(this).attr('class', 'bar');
        d3.select(this)
            .transition()
            .duration(400)
            .attr('width', x.bandwidth())
            .attr("y", function (d) {
                return y(d.deaths);
            })
            .attr("height", function (d) {
                return height - y(d.deaths);
            });

        d3.selectAll('.val')
            .remove()
    }
}());