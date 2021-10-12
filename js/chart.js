(function chart() {
  const SIZE = 500;
  let padding = 30;

  let map = d3.select("svg#map");
  let mapWidth = SIZE;
  let mapHeight = SIZE;
  let mapXScale = d3.scaleLinear();
  let mapYScale = d3.scaleLinear();

  let buttonHeight = 30;
  let buttonPadding = 10;

  let graph = d3.select("svg#graph");
  let graphWidth = SIZE;
  let graphHeight = SIZE - (buttonHeight + buttonPadding * 2);
  let graphXScale = d3.scaleLinear();
  let graphYScale = d3.scaleLinear();

  let buttonWidth = (graphWidth - 4 * buttonPadding) / 3;
  let keyButtonWidth = buttonWidth / 2;

  let maleOpacity = 1;
  let famaleOpacity = 1;

  let ageRanges = [
    {
      label: "0-10",
      color: "#C0392B ",
    },
    {
      label: "11-20",
      color: "#8E44AD   ",
    },
    {
      label: "21-40",
      color: "#2980B9 ",
    },
    {
      label: "41-60",
      color: "#16A085 ",
    },
    {
      label: "61-80",
      color: "#D4AC0D ",
    },
    {
      label: "> 80",
      color: "#717D7E  ",
    },
  ];

  let streets = [];
  let pumps = [];

  let deathDays = [];
  let deaths = [];
  let maxDeaths = 0;

  function resetPageElementsAll() {
    map.selectAll(".death").attr("fill", "none").attr("fill-opacity", 1);

    graph
      .selectAll(".graphline")
      .attr("stroke", "none")
      .attr("stroke-opacity", 1);

    graph
      .selectAll(".graphkeybutton")
      .attr("visibility", "hidden")
      .attr("fill-opacity", 1);

    maleOpacity = 1;
    femaleOpacity = 1;

    for (let i = 0; i < ageRanges.length; i++) {
      ageRanges[i].opacity = 1;
    }
  }

  function displayAllTotalRecords() {
    resetPageElementsAll();

    map.selectAll(".death").attr("fill", "grey");

    graph
      .select("#graphlinetotal")
      .attr("stroke", "black")
      .attr("opacity", "1");
  }

  function displatGenderWise() {
    resetPageElementsAll();

    map.selectAll(".male").attr("fill", "blue");
    map.selectAll(".female").attr("fill", "red");

    graph
      .select("#graphlinetotal")
      .attr("stroke", "black")
      .attr("opacity", "1");

    graph.select("#buttongendermale").attr("visibility", "visible");
    graph.select("#buttongendermalelabel").attr("visibility", "visible");
    graph.select("#buttongenderfemale").attr("visibility", "visible");
    graph.select("#buttongenderfemalelabel").attr("visibility", "visible");
  }

  function displayAgeWise() {
    resetPageElementsAll();

    for (let i = 0; i < ageRanges.length; i++) {
      map.selectAll(".age" + i).attr("fill", ageRanges[i].color);
      graph.select("#buttonage" + i).attr("visibility", "visible");
      graph.select("#buttonagelabel" + i).attr("visibility", "visible");
    }
    graph
      .select("#graphlinetotal")
      .attr("stroke", "black")
      .attr("opacity", "1");
  }

  // Location of dead people
  function ShowDeathMapDetails() {
    map
      .selectAll(".death")
      .data(deaths)
      .enter()
      .append("circle")
      .attr("id", function (d, i) {
        return "death" + i;
      })
      .attr("class", function (d) {
        return (
          "death " +
          d.gender +
          " " +
          "age" +
          d.age +
          " " +
          "deathday" +
          d.deathday
        );
      })
      .attr("cx", function (d) {
        return mapXScale(d.x);
      })
      .attr("cy", function (d) {
        return mapYScale(d.y);
      })
      .attr("fill", "none")
      .append("title")
      .text(function (d) {
        return (
          d.gender +
          "\r\n" +
          "age " +
          ageRanges[d.age].label +
          "\r\n" +
          "died " +
          d.deathdate
        );
      });
  }

  function displayGraphLinesDeathData() {
    let graphTotalPathGenerator = d3
      .line()
      .x(function (d) {
        return graphXScale(d.day);
      })
      .y(function (d) {
        return graphYScale(d.total);
      });

    graph
      .append("path")
      .attr("id", "graphlinetotal")
      .attr("class", "graphline")
      .attr("d", graphTotalPathGenerator(deathDays));

    let graphMalePathGenerator = d3
      .line()
      .x(function (d) {
        return graphXScale(d.day);
      })
      .y(function (d) {
        return graphYScale(d.male);
      });

    graph
      .append("path")
      .attr("id", "graphlinegendermale")
      .attr("class", "graphline male")
      .attr("d", graphMalePathGenerator(deathDays));

    let graphFemalePathGenerator = d3
      .line()
      .x(function (d) {
        return graphXScale(d.day);
      })
      .y(function (d) {
        return graphYScale(d.female);
      });

    graph
      .append("path")
      .attr("id", "graphlinegenderfemale")
      .attr("class", "graphline female")
      .attr("d", graphFemalePathGenerator(deathDays));

    for (let i = 0; i < ageRanges.length; i++) {
      let graphPathGenerator = d3
        .line()
        .x(function (d) {
          return graphXScale(d.day);
        })
        .y(function (d) {
          return graphYScale(d.age[i]);
        });

      graph
        .append("path")
        .attr("id", "graphlineage" + i)
        .attr("class", "graphline age" + i)
        .attr("d", graphPathGenerator(deathDays));
    }
  }

  function displayDeathGraphicalFormat() {
    let hoverbarWidth = graphWidth / (deathDays.length - 1);

    graph
      .selectAll("rect.deathhoverbar")
      .data(deathDays)
      .enter()
      .append("rect")
      .attr("x", function (d, i) {
        return graphXScale(i) - hoverbarWidth / 2;
      })
      .attr("y", padding)
      .attr("width", hoverbarWidth)
      .attr("height", graphHeight - padding * 2)
      .attr("fill", "blue")
      .attr("fill-opacity", "0")
      .attr("stroke", "none")
      .attr("stroke-width", "0")
      .attr("id", function (d) {
        return d.deathdate;
      })
      .attr("class", "deathhoverbar")
      .on("mouseover", function (d) {
        d3.selectAll(".death")
          .filter(function (d2) {
            return d2.deathday > d.day;
          })
          .attr("visibility", "hidden");
      })
      .on("mouseout", function (d) {
        map.selectAll(".death").attr("visibility", "visible");
      })
      .append("title")
      .text(function (d) {
        return (
          d.deathdate + ": " + d.total + (d.total == 1 ? " death" : " deaths")
        );
      });

    let xAxis = d3.axisBottom(graphXScale).tickFormat(function (d) {
      return deathDays[d].deathdate;
    });

    let yAxis = d3.axisLeft(graphYScale);

    graph
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (graphHeight - padding) + ")")
      .call(xAxis);

    graph
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

    let buttonLabelYAdjust = 5;

    // Total Deaths
    graph
      .append("rect")
      .attr("id", "buttontotal")
      .attr("class", "graphbutton")
      .attr("x", 360)
      .attr("y", 250)
      .attr("width", 120)
      .attr("height", 30)
      .attr("fill", "green")
      .on("click", function (d) {
        displayAllTotalRecords();
      });
    graph
      .append("text")
      .attr("id", "buttontotallabel")
      .attr("class", "graphbuttonlabel")
      .text("By Gender and Age")
      .attr("x", 420)
      .attr("y", 270)
      .style("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("pointer-events", "none");

    // By Gender
    graph
      .append("rect")
      .attr("id", "buttongender")
      .attr("class", "graphbutton")
      .attr("x", 360)
      .attr("y", 300)
      .attr("width", 120)
      .attr("height", 30)
      .attr("fill", "green")
      .on("click", function (d) {
        displatGenderWise();
      });
    graph
      .append("text")
      .attr("id", "buttongenderlabel")
      .attr("class", "graphbuttonlabel")
      .text("By Gender")
      .attr("x", 420)
      .attr("y", 320)
      .style("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("pointer-events", "none");

    // By Age
    graph
      .append("rect")
      .attr("id", "buttonage")
      .attr("class", "graphbutton")
      .attr("x", 360)
      .attr("y", 350)
      .attr("width", 120)
      .attr("height", 30)
      .attr("fill", "green")
      .on("click", function (d) {
        displayAgeWise();
      });
    graph
      .append("text")
      .attr("id", "buttonagelabel")
      .attr("class", "graphbuttonlabel")
      .text("By Age")
      .attr("x", 420)
      .attr("y", 370)
      .style("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("pointer-events", "none");

    // By Male
    graph
      .append("rect")
      .attr("id", "buttongendermale")
      .attr("class", "graphbutton graphkeybutton male")
      .attr("x", 300)
      .attr("y", 10)
      .attr("width", 78)
      .attr("height", 30)
      .attr("fill", "blue")
      .on("click", function (d) {
        maleOpacity = maleOpacity == 1 ? 0.2 : 1;
        d3.selectAll(".male").attr("fill-opacity", maleOpacity);
        d3.selectAll(".male").attr("stroke-opacity", maleOpacity);
      });
    graph
      .append("text")
      .attr("id", "buttongendermalelabel")
      .attr("class", "graphbuttonlabel graphkeybutton")
      .text("Male")
      .attr("x", 340)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("pointer-events", "none");

    // By Female
    graph
      .append("rect")
      .attr("id", "buttongenderfemale")
      .attr("class", "graphbutton graphkeybutton female")
      .attr("x", 400)
      .attr("y", 10)
      .attr("width", keyButtonWidth)
      .attr("height", buttonHeight)
      .attr("fill", "red")
      .on("click", function (d) {
        femaleOpacity = femaleOpacity == 1 ? 0.2 : 1;
        d3.selectAll(".female").attr("fill-opacity", femaleOpacity);
        d3.selectAll(".female").attr("stroke-opacity", femaleOpacity);
      });
    graph
      .append("text")
      .attr("id", "buttongenderfemalelabel")
      .attr("class", "graphbuttonlabel graphkeybutton")
      .text("Female")
      .attr("x", 440)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("pointer-events", "none");

    graph
      .append("rect")
      .attr("id", "buttonage0")
      .attr("class", "graphbutton graphkeybutton age0")
      .attr("x", 300)
      .attr("y", 10)
      .attr("width", 78)
      .attr("height", 30)
      .attr("fill", ageRanges[0].color)
      .on("click", function (d) {
        ageRanges[0].opacity = ageRanges[0].opacity == 1 ? 0.1 : 1;
        d3.selectAll(".age0").attr("fill-opacity", ageRanges[0].opacity);
        d3.selectAll(".age0").attr("stroke-opacity", ageRanges[0].opacity);
      });
    graph
      .append("text")
      .attr("id", "buttonagelabel0")
      .attr("class", "graphbuttonlabel graphkeybutton")
      .text(ageRanges[0].label)
      .attr("x", 340)
      .attr("y", 30)
      .style("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("pointer-events", "none");

    graph
      .append("rect")
      .attr("id", "buttonage1")
      .attr("class", "graphbutton graphkeybutton age1")
      .attr("x", 400)
      .attr("y", 10)
      .attr("width", 78)
      .attr("height", 30)
      .attr("fill", ageRanges[1].color)
      .on("click", function (d) {
        ageRanges[1].opacity = ageRanges[1].opacity == 1 ? 0.1 : 1;
        d3.selectAll(".age1").attr("fill-opacity", ageRanges[1].opacity);
        d3.selectAll(".age1").attr("stroke-opacity", ageRanges[1].opacity);
      });
    graph
      .append("text")
      .attr("id", "buttonagelabel1")
      .attr("class", "graphbuttonlabel graphkeybutton")
      .text(ageRanges[1].label)
      .attr("x", 440)
      .attr("y", 30)
      .style("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("pointer-events", "none");
    graph
      .append("rect")
      .attr("id", "buttonage2")
      .attr("class", "graphbutton graphkeybutton age2")
      .attr("x", 300)
      .attr("y", 50)
      .attr("width", 78)
      .attr("height", 30)
      .attr("fill", ageRanges[2].color)
      .on("click", function (d) {
        ageRanges[2].opacity = ageRanges[2].opacity == 1 ? 0.1 : 1;
        d3.selectAll(".age2").attr("fill-opacity", ageRanges[2].opacity);
        d3.selectAll(".age1").attr("stroke-opacity", ageRanges[2].opacity);
      });
    graph
      .append("text")
      .attr("id", "buttonagelabel2")
      .attr("class", "graphbuttonlabel graphkeybutton")
      .text(ageRanges[2].label)
      .attr("x", 340)
      .attr("y", 70)
      .style("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("pointer-events", "none");
    graph
      .append("rect")
      .attr("id", "buttonage3")
      .attr("class", "graphbutton graphkeybutton age3")
      .attr("x", 400)
      .attr("y", 50)
      .attr("width", 78)
      .attr("height", 30)
      .attr("fill", ageRanges[3].color)
      .on("click", function (d) {
        ageRanges[3].opacity = ageRanges[3].opacity == 1 ? 0.1 : 1;
        d3.selectAll(".age3").attr("fill-opacity", ageRanges[3].opacity);
        d3.selectAll(".age3").attr("stroke-opacity", ageRanges[3].opacity);
      });
    graph
      .append("text")
      .attr("id", "buttonagelabel3")
      .attr("class", "graphbuttonlabel graphkeybutton")
      .text(ageRanges[3].label)
      .attr("x", 440)
      .attr("y", 70)
      .style("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("pointer-events", "none");
    graph
      .append("rect")
      .attr("id", "buttonage4")
      .attr("class", "graphbutton graphkeybutton age4")
      .attr("x", 300)
      .attr("y", 90)
      .attr("width", 78)
      .attr("height", 30)
      .attr("fill", ageRanges[4].color)
      .on("click", function (d) {
        ageRanges[4].opacity = ageRanges[4].opacity == 1 ? 0.1 : 1;
        d3.selectAll(".age4").attr("fill-opacity", ageRanges[4].opacity);
        d3.selectAll(".age4").attr("stroke-opacity", ageRanges[4].opacity);
      });
    graph
      .append("text")
      .attr("id", "buttonagelabel4")
      .attr("class", "graphbuttonlabel graphkeybutton")
      .text(ageRanges[4].label)
      .attr("x", 340)
      .attr("y", 110)
      .style("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("pointer-events", "none");
    graph
      .append("rect")
      .attr("id", "buttonage5")
      .attr("class", "graphbutton graphkeybutton age5")
      .attr("x", 400)
      .attr("y", 90)
      .attr("width", 78)
      .attr("height", 30)
      .attr("fill", ageRanges[5].color)
      .on("click", function (d) {
        ageRanges[5].opacity = ageRanges[5].opacity == 1 ? 0.1 : 1;
        d3.selectAll(".age5").attr("fill-opacity", ageRanges[5].opacity);
        d3.selectAll(".age1").attr("stroke-opacity", ageRanges[5].opacity);
      });
    graph
      .append("text")
      .attr("id", "buttonagelabel5")
      .attr("class", "graphbuttonlabel graphkeybutton")
      .text(ageRanges[5].label)
      .attr("x", 440)
      .attr("y", 110)
      .style("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("pointer-events", "none");
  }

  function loadDeaths() {
    d3.csv("data/deaths_age_sex.csv", function (data) {
      for (let i = 0; i < data.length; i++) {
        deaths.push({
          x: data[i].x,
          y: data[i].y,
          age: +data[i].age,
          gender: +data[i].gender == 1 ? "female" : "male",
        });
      }

      d3.csv("data/deathdays.csv", function (data) {
        let deathId = 0;
        for (let day = 0; day < data.length; day++) {
          let totalCount = +data[day].deaths;
          let maleCount = 0;
          let femaleCount = 0;
          let ageCount = [0, 0, 0, 0, 0, 0];

          if (maxDeaths < totalCount) {
            maxDeaths = totalCount;
          }

          for (let i = 0; i < totalCount; i++) {
            deaths[deathId].deathday = day;
            deaths[deathId].deathdate = data[day].date;

            if (deaths[deathId].gender == "male") {
              maleCount++;
            } else {
              femaleCount++;
            }
            ageCount[deaths[deathId].age]++;

            deathId++;
          }

          deathDays.push({
            day: day,
            deathdate: data[day].date,
            total: totalCount,
            male: maleCount,
            female: femaleCount,
            age: ageCount,
          });
        }

        graphXScale
          .domain([0, deathDays.length - 1])
          .range([padding, graphWidth - padding]);
        graphYScale
          .domain([0, maxDeaths])
          .range([graphHeight - padding, padding]);

        ShowDeathMapDetails();
        displayGraphLinesDeathData();
        displayDeathGraphicalFormat();

        displayAllTotalRecords();
      });
    });
  }
  function drawPumps() {
    d3.csv("data/pumps.csv", function (data) {
      for (let i = 0; i < data.length; i++) {
        pumps.push({ x: data[i].x, y: data[i].y });
      }
      map
        .selectAll(".pump")
        .data(pumps)
        .enter()
        .append("rect")
        .attr("class", "pump")
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", function (d) {
          return mapXScale(d.x) - 12 / 2;
        })
        .attr("y", function (d) {
          return mapYScale(d.y) - 12 / 2;
        })
        .attr("transform", function (d) {
          return "rotate(45 " + mapXScale(d.x) + " " + mapYScale(d.y) + ")";
        });
    });
  }

  let lineFunction = d3
    .line()
    .x(function (d) {
      return mapXScale(d.x);
    })
    .y(function (d) {
      return mapYScale(d.y);
    })
    .curve(d3.curveLinear);

  d3.json("data/streets.json", function (data) {
    streets = data;

    mapXScale.domain([3, 20]).range([0, mapWidth]);
    mapYScale.domain([3, 20]).range([mapHeight, 0]);

    for (let i = 0; i < streets.length; i++) {
      map
        .append("path")
        .attr("d", lineFunction(streets[i]))
        .attr("class", "street");
    }

    map
      .append("text")
      .attr("x", 360)
      .attr("y", 237)
      .style("font-size", 12)
      .attr("font-weight", "bold")
      .attr("fill", "black")
      .style("text-anchor", "start")
      .attr("transform", "rotate(75 190 30)")
      .text("CEORGE STREET");

    map
      .append("text")
      .attr("x", 210)
      .attr("y", 200)
      .style("font-size", 15)
      .style("text-anchor", "start")
      .attr("transform", "rotate(1 1 1)")
      .attr("fill", "#50e52b")
      .attr("stroke-width", "none")
      .attr("font-weight", "bold")
      .text("WORKHOUSE");

    map
      .append("text")
      .attr("x", 420)
      .attr("y", -45)
      .style("font-size", 15)
      .attr("font-weight", "bold")
      .style("text-anchor", "start")
      .attr("transform", "rotate(75 190 20)")
      .attr("fill", "#50e52b")
      .attr("stroke-width", "none")
      .text("BREWERY");

    map
      .append("text")
      .attr("x", 150)
      .attr("y", 130)
      .style("font-size", 12)
      .attr("fill", "black")
      .attr("font-weight", "bold")
      .style("text-anchor", "start")
      .attr("transform", "rotate(-25 120 -10)")
      .text("OXFORD STREET");

    map
      .append("text")
      .attr("x", 20)
      .attr("y", 400)
      .style("font-size", 12)
      .attr("font-weight", "bold")
      .style("text-anchor", "start")
      .attr("fill", "black")
      .attr("transform", "rotate(-35 120 -20)")
      .text("BREWER STREET");

    map
      .append("text")
      .attr("x", 230)
      .attr("y", 430)
      .attr("font-size", 13)
      .attr("fill", "#800080")
      .style("text-anchor", "start")
      .attr("transform", "rotate(1 1 1)")
      .attr("font-weight", "bold")
      .text("REGENTS QUADRANT");

    map
      .append("text")
      .attr("x", 300)
      .attr("y", -200)
      .style("font-size", 13)
      .style("text-anchor", "start")
      .attr("transform", "rotate(75 190 20)")
      .attr("fill", "red")
      .attr("stroke-width", "none")
      .attr("font-weight", "bold")
      .attr("fill", "#800080")
      .text("SOHO SQUARE");
    map
      .append("text")
      .attr("x", 400)
      .attr("y", -170)
      .style("font-size", 12)
      .style("text-anchor", "start")
      .attr("transform", "rotate(75 190 20)")
      .attr("stroke-width", "none")
      .attr("font-weight", "bold")
      .attr("fill", "black")
      .text("DEAN STREET");
    map
      .append("text")
      .attr("x", 540)
      .attr("y", -120)
      .style("font-size", 12)
      .style("text-anchor", "start")
      .attr("transform", "rotate(75 190 20)")
      .attr("fill", "black")
      .attr("stroke-width", "none")
      .attr("font-weight", "bold")
      .text("RUPERT STREET");
    map
      .append("text")
      .attr("x", 50)
      .attr("y", 230)
      .style("font-size", 12)
      .style("text-anchor", "start")
      .attr("transform", "rotate(-20 -20 1)")
      .attr("stroke-width", "none")
      .attr("font-weight", "bold")
      .attr("fill", "black")
      .text("GREAT MARLBOROUGH STREET");
    map
      .append("text")
      .attr("x", 500)
      .attr("y", 190)
      .style("font-size", 10)
      .style("text-anchor", "start")
      .attr("transform", "rotate(60 160 20)")
      .attr("stroke-width", "none")
      .attr("font-weight", "bold")
      .attr("fill", "black")
      .text("SACKVILLE STREET");

    drawPumps();
    loadDeaths();
  });
})();
