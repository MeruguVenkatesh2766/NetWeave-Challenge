import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import CircularIndeterminate from '../helpers/progess';

const BarChart = ({ data, totalPercentageKey, typeKey, loading }) => {
  const chartRef = useRef();
  let height = 0.6*window.innerHeight;
  let marginBottom = 0;

  useEffect(() => {
    if (!data || data.length === 0) return;

    const width = chartRef.current.parentElement.clientWidth; // Set the width to the parent element's width
    height = 0.6*window.innerHeight || chartRef.current.parentElement.clientHeight; // Set the height to the parent element's height
    const marginTop = 20;
    const marginRight = 40;
    marginBottom = 80; // Increased bottom margin to accommodate x-axis labels
    const marginLeft = 40; // Increased left margin to accommodate y-axis labels

    // Clear the chart container
    d3.select(chartRef.current).selectAll('*').remove();

    // Filter and sum totalPercentageKey for each unique sector
    const sectorMap = new Map();
    let totalSum = 0;
    data.forEach(item => {
        const valueToSum = parseInt(item[totalPercentageKey]); // Correct way to access object property dynamically
        if (!isNaN(valueToSum)) { // Check if it's a valid number
            totalSum += valueToSum;
            if (sectorMap.has(item[typeKey])) {
                sectorMap.set(item[typeKey], sectorMap.get(item[typeKey]) + valueToSum);
            } else {
                sectorMap.set(item[typeKey], valueToSum);
            }
        }
    });

    // Prepare data for pie chart
    const barData = Array.from(sectorMap.entries()).map(([typeKey, totalPercentageValue]) => ({ typeKey, totalPercentageValue }));

    const x = d3.scaleBand()
      .domain(data.map(d => d[typeKey]))
      .range([marginLeft, width - marginRight])

    const xAxis = d3.axisBottom(x).tickSizeOuter(0);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[totalPercentageKey])])
      .nice()
      .range([height - marginBottom, marginTop]);

      const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height + marginBottom)

    const bars = svg.selectAll("rect")
      .data(data)
      .join("rect")
        .style("mix-blend-mode", "multiply")
        .attr("x", d => x(d[typeKey]))
        .attr("y", d => y(d[totalPercentageKey]))
        .attr("height", d => y(0) - y(d[totalPercentageKey] ? d[totalPercentageKey] : 0))
        .attr("width", x.bandwidth())
        .attr("fill", "steelblue");

    svg.append("g")
      .attr("transform", `translate(0, ${height - marginBottom})`)
      .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-60)")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em");

    svg.append("g")
      .attr("transform", `translate(${marginLeft}, 0)`) // Adjusted for left margin
      .call(d3.axisLeft(y));

  }, [data]);

  return(
  <>
  {loading ?
            <CircularIndeterminate minimumHeight={height + marginBottom}/> :<div style={{height:height+marginBottom}} ref={chartRef}></div>}
  </> )
};

export default BarChart;
