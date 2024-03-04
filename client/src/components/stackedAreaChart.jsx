import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import CircularIndeterminate from '../helpers/progess';

const AreaChart = ({ data, totalPercentageKey, typeKey, loading }) => {
  const chartRef = useRef();
  let height = 0.6*window.innerHeight;
  let marginBottom = 0;

  useEffect(() => {
    if (data && chartRef.current) {
      // Clear the chart container
      d3.select(chartRef.current).selectAll('*').remove();

      const width = chartRef.current.parentElement.clientWidth; // Set the width to the parent element's width
      height = 0.6 * window.innerHeight || chartRef.current.parentElement.clientHeight; // Set the height to the parent element's height
      const marginTop = 20;
      const marginRight = 20;
      marginBottom = 80; // Increased bottom margin to accommodate x-axis labels
      const marginLeft = 40; // Increased left margin to accommodate y-axis labels

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
        .domain(lineData.map(d => d.typeKey))
        .range([marginLeft, width - marginRight])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain(d3.extent(lineData, d => d.totalPercentageValue)).nice()
        .range([height - marginBottom, marginTop]);

      const area = d3.area()
        .x(d => x(d.typeKey))
        .y0(y(0))
        .y1(d => y(d.totalPercentageValue));

      const svg = d3.select(chartRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height + marginBottom)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

      svg.append("path")
        .attr("fill", "steelblue")
        .attr("d", area(lineData));

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
        .call(d3.axisLeft(y).ticks(height / 40))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Daily close"));
    }
  }, [data]);

  return(
    <>
    {loading ?
              <CircularIndeterminate minimumHeight={height + marginBottom}/> :<div style={{height:height+marginBottom}} ref={chartRef}></div>}
    </> )
};

export default AreaChart;
