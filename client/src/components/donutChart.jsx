import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Grid } from "@mui/material"
import CircularIndeterminate from '../helpers/progess';

const DonutChart = ({ data, totalPercentageKey, typeKey, loading }) => {
    const chartRef = useRef();
    const legendRef = useRef();
    let height = 0.3 * window.innerHeight;

    useEffect(() => {
        if (data && chartRef.current && legendRef.current) {
            d3.select(chartRef.current).selectAll("*").remove();
            d3.select(legendRef.current).selectAll("*").remove();

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
            const pieData = Array.from(sectorMap.entries()).map(([typeKey, totalPercentageValue]) => ({ typeKey, totalPercentageValue }));

            const width = chartRef.current.parentElement.clientWidth; // Set the width to the parent element's width
            height = 0.3 * window.innerHeight || chartRef.current.parentElement.clientHeight; // Set the height to the parent element's height

            // Reset color scale domain
            const uniqueSectors = [...new Set(pieData.map(d => d.typeKey))]; // Ensure unique sectors
            const color = d3.scaleOrdinal()
                .domain(uniqueSectors)
                .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), uniqueSectors.length).reverse());

            // Choose the minimum dimension to ensure the chart fits within the container
            const diameter = Math.min(width, height);
            const radius = diameter / 2;

            const svg = d3.select(chartRef.current)
                .attr("width", "100%")
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2},${height / 2})`);

            const arc = d3.arc()
                .innerRadius(radius * 0.5)
                .outerRadius(radius);

            const pie = d3.pie()
                .padAngle(1 / radius)
                .sort(null)
                .value(d => d.totalPercentageValue);

            const arcs = pie(pieData);

            svg.append("g")
                .selectAll()
                .data(arcs)
                .join("path")
                .attr("fill", d => color(d.data.typeKey))
                .attr("d", arc)
                .append("title")
                .text(d => `${d.data.typeKey}: ${(totalSum !== 0 ? ((d.data.totalPercentageValue / totalSum) * 100).toFixed(2) : 0)}%`);

            svg.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 8)
                .attr("text-anchor", "middle")
                .selectAll()
                .data(arcs)
                .join("text")
                .attr("transform", d => `translate(${arc.centroid(d)}) rotate(${angle(d)})`)
                .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                    .attr("x", 0)
                    .attr("y", "0.7em")
                    .attr("fill-opacity", 0.7)
                    .text(d => `${((d.data.totalPercentageValue / totalSum) * 100).toFixed(2)}%`));

            // Function to compute the angle for rotation
            function angle(d) {
                const a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
                return a > 90 ? a - 180 : a;
            }

            // Legend
            const legend = d3.select(legendRef.current)
                .append("svg")
                .attr("width", "100%")
                .attr("min-height", height)

            legend.selectAll("rect")
                .data(pieData)
                .enter()
                .append("rect")
                .attr("x", (d, i) => i < (pieData.length / 2) ? '0%' : '50%') // Adjust x-coordinate based on box position
                .attr("y", (d, i) => i < (pieData.length / 2) ? i * 22 : (pieData.length - i) * 22 - 20)
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", d => color(d.typeKey));

            legend.selectAll("text")
                .data(pieData)
                .enter()
                .append("text")
                .attr("font-size", 12)
                .attr("x", (d, i) => i < (pieData.length / 2) ? '5%' : '55%') // Adjust x-coordinate based on label position
                .attr("y", (d, i) => i < (pieData.length / 2) ? i * 22 + 7 : (pieData.length - i) * 22 - 15)
                .attr("alignment-baseline", "middle")
                .text(d => `${d.typeKey}: ${(totalSum !== 0 ? ((d.totalPercentageValue / totalSum) * 100).toFixed(2) : 0)}%`);
        }
    }, [data]);

    return (
        <>
            {loading && data?.length>0 ?
                <CircularIndeterminate minimumHeight={height} /> :
                <Grid container justifyContent="space-around" alignItems="center">
                    <Grid item xs={12} sm={7} md={5}>
                        <svg ref={chartRef}></svg>
                    </Grid>
                    <Grid item xs={12} sm={9} md={7}>
                        <div style={{height:'100%', padding:'10px 0'}}  ref={legendRef}></div>
                    </Grid>
                </Grid>}
        </>)

};

export default DonutChart;
