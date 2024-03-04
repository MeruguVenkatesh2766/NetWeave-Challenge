import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const GradientLineChart = ({ data, totalPercentageKey, typeKey }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (data && chartRef.current) {
      d3.select(chartRef.current).selectAll("*").remove();
      const width = chartRef.current.parentElement.clientWidth; // Set the width to the parent element's width
      const height = 0.6 * window.innerHeight || chartRef.current.parentElement.clientHeight; // Set the height to the parent element's height
      const marginTop = 10;
      const marginRight = 10;
      const marginBottom = 40;
      const marginLeft = 40;

      // Filter and sum totalPercentageKey for each unique sector
      const sectorMap = new Map();

      // Iterate over the data
      data.forEach(item => {
        const valueToSum = parseInt(item[totalPercentageKey]);
        const dateKey = item[typeKey].split(' ')[0]; // Extract only the date portion

        // Check if the value is valid
        if (!isNaN(valueToSum)) {
          // If the dateKey is already in the map, add the value to the existing sum
          if (sectorMap.has(dateKey)) {
            if (sectorMap.get(dateKey) > 380) sectorMap.set(dateKey, sectorMap.get(dateKey) + valueToSum - 380);
            else sectorMap.set(dateKey, sectorMap.get(dateKey) + valueToSum);
          } else {
            // If the dateKey is not in the map, initialize it with the value
            sectorMap.set(dateKey, valueToSum);
          }
        }
      });


      // Prepare data for pie chart
      // Months list for sorting
      const monthsList = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
      ];
      
      // Create a Map with default values of 0 for all months
      const sortedSectorMap = new Map(monthsList.map(month => [month, 0]));
      
      // Iterate over the original sectorMap and update values in sortedSectorMap
      sectorMap.forEach((value, key) => {
        const date = new Date(key);
        const month = monthsList[date.getMonth()];
        sortedSectorMap.set(month, sortedSectorMap.get(month) + value);
      });
      
      // Convert the Map to an array of objects
      const lineData = Array.from(sortedSectorMap.entries()).map(([typeKey, totalPercentageValue]) => ({ typeKey, totalPercentageValue }));
  

      const x = d3.scaleBand()
        .domain(lineData.map(d => d.typeKey)) // Use the names of the months as the domain
        .range([marginLeft, width - marginRight])
        .padding(0.1); // Adjust the padding between bars if needed

      const y = d3.scaleLinear()
        .domain(d3.extent(lineData, d => d.totalPercentageValue)).nice()
        .range([height - marginBottom, marginTop]);

      const color = d3.scaleSequential(y.domain(), d3.interpolateTurbo);

      const line = d3.line()
        .curve(d3.curveStep)
        .defined(d => !isNaN(d.totalPercentageValue))
        .x(d => x(d.typeKey) + x.bandwidth() / 2) // Adjust x position to the center of each band
        .y(d => y(d.totalPercentageValue));

      const svg = d3.select(chartRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height",  height + marginBottom)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

      // Append the path before the axes
      svg.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "url(#gradient)") // Use the gradient defined earlier
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

      svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-60)")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .call(g => g.select(".domain").remove());

      svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").append("tspan").text("°F"));

        const gradient = svg.append("linearGradient")
        .attr("id", "gradient") // Add an ID to the gradient
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", height - marginBottom)
        .attr("x2", 0)
        .attr("y2", marginTop)
        .selectAll("stop")
        .data(d3.ticks(0, 1, 10))
        .join("stop")
        .attr("offset", d => d)
        .attr("stop-color", color.interpolator());
    }
  }, [data]);

  return <div ref={chartRef}></div>;
};

export default GradientLineChart;
