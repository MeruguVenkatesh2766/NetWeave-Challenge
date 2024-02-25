import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Button, Typography } from "@mui/material";
import PieChart from './components/pieChart';
import DonutChart from './components/donutChart';
import BarChart from './components/barChart';
import GradientLineChart from './components/gradientLine';
import CustomSelect from './helpers/customSelect';
import StackedAreaChart from './components/stackedAreaChart';
import { getJSONdata } from './apis/getData';
import CustomBox from './helpers/customBox';
import AppBar from './components/appBar';

const optionKeys = ['topic', 'sector'];

function App() {
  const [data, setData] = useState([])
  const [optionsData, setOptionsData] = useState({
    [optionKeys[0]]: [],
    [optionKeys[1]]: []
  });
  const [filters, setFilters] = useState({
    endYear: '',
    topic: '',
    sector: '',
    region: '',
    pest: '',
    source: '',
    swot: '',
    country: '',
    city: ''
  });

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleSearch = async () => {
    const newData = await fetchApiData();
    const filteredData = newData.filter(item => {
      return (
        (!filters.endYear || item.end_year === filters.endYear) &&
        (!filters.topic || item.topic === filters.topic) &&
        (!filters.sector || item.sector === filters.sector) &&
        (!filters.region || item.region === filters.region) &&
        (!filters.pest || item.pest === filters.pest) &&
        (!filters.source || item.source === filters.source) &&
        (!filters.swot || item.swot === filters.swot) &&
        (!filters.country || item.country === filters.country) &&
        (!filters.city || item.city === filters.city)
      );
    });
    setData(filteredData);
  };

  const handleReset = () => {
    setFilters({
      endYear: '',
      topic: '',
      sector: '',
      region: '',
      pest: '',
      source: '',
      swot: '',
      country: '',
      city: ''
    });
    fetchApiData().then((res) => setData(res))
  };

  const fetchApiData = async () => {
    try {
      return await getJSONdata();
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchApiData().then((res) => {
      setData(res);
      const newOptionsData = {};

      // Map over optionKeys and filter res for each key
      optionKeys.forEach(key => {
        newOptionsData[key] = [...new Set(res.map(item => item[key]))];
      });
      setOptionsData(newOptionsData)
    })
  }, []);

  return (
    <>
      <AppBar />
      <Grid container spacing={2} style={{ padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.06)' }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Filters</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <CustomSelect
                    value={filters.topic}
                    onChange={(e, value) => handleFilterChange(optionKeys[0], value)}
                    options={optionsData[optionKeys[0]]}
                    defaultLabel={optionKeys[0]}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <CustomSelect
                    value={filters.sector}
                    onChange={(e, value) => handleFilterChange(optionKeys[1], value)}
                    options={optionsData[optionKeys[1]]}
                    defaultLabel={optionKeys[1]}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} display="flex" justifyContent="end" gap="10px">
                  <Button size='small' variant="contained" onClick={handleReset}>Reset</Button>
                  <Button size='small' variant="contained" onClick={handleSearch}>Search</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <Card>
                <CardContent>
                  <CustomBox xAxisLabel={"Intensity"} yAxisLabel={"Region"} heading="Bar Chart">
                    <MemoizedBarChart data={data} totalPercentageKey={"intensity"} typeKey={"region"} />
                  </CustomBox>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Card>
                <CardContent>
                  <CustomBox xAxisLabel={"Likelihood"} yAxisLabel={"Added"} heading="Gradient Line Chart">
                    <MemoizedGradientLineChart data={data} totalPercentageKey={"likelihood"} typeKey={"added"} />
                  </CustomBox>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Card>
                <CardContent>
                  <CustomBox xAxisLabel={"Intensity"} yAxisLabel={"Pestle"} heading="Pie Chart">
                    <MemoizedPieChart data={data} totalPercentageKey={"intensity"} typeKey={"pestle"} />
                  </CustomBox>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Card>
                <CardContent>
                  <CustomBox xAxisLabel={"Intensity"} yAxisLabel={"Region"} heading="Donut Chart">
                    <MemoizedDonutChart data={data} totalPercentageKey={"intensity"} typeKey={"region"} />
                  </CustomBox>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Card>
                <CardContent>
                  <CustomBox xAxisLabel={"Likelihood"} yAxisLabel={"Added"} heading="Area Chart">
                    <MemoizedStackedAreaChart data={data} totalPercentageKey={"likelihood"} typeKey={"added"} />
                  </CustomBox>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <Card>
                <CardContent>
                  <CustomBox xAxisLabel={"Intensity"} yAxisLabel={"Region"} heading="Donut Chart">
                    <MemoizedDonutChart data={data} totalPercentageKey={"intensity"} typeKey={"region"} />
                  </CustomBox>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Card>
                <CardContent>
                  <CustomBox xAxisLabel={"Intensity"} yAxisLabel={"Pestle"} heading="Pie Chart">
                    <MemoizedPieChart data={data} totalPercentageKey={"intensity"} typeKey={"pestle"} />
                  </CustomBox>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Card>
                <CardContent>
                  <CustomBox xAxisLabel={"Intensity"} yAxisLabel={"Region"} heading="Bar Chart">
                    <MemoizedBarChart data={data} totalPercentageKey={"intensity"} typeKey={"region"} />
                  </CustomBox>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Card>
                <CardContent>
                  <CustomBox xAxisLabel={"Likelihood"} yAxisLabel={"Added"} heading="Area Chart">
                    <MemoizedStackedAreaChart data={data} totalPercentageKey={"likelihood"} typeKey={"added"} />
                  </CustomBox>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

const MemoizedPieChart = React.memo(PieChart);
const MemoizedDonutChart = React.memo(DonutChart);
const MemoizedBarChart = React.memo(BarChart);
const MemoizedGradientLineChart = React.memo(GradientLineChart);
const MemoizedStackedAreaChart = React.memo(StackedAreaChart);

export default App;