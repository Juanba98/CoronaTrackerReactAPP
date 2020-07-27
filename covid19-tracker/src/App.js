import React, {useState,useEffect} from 'react';
import {FormControl,Select,MenuItem,Card,CardContent} from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData} from './util';
import LineGraph from './LineGraph'
//BEM naming convention
//"https://disease.sh/v3/covid-19/countries/"
//"https://disease.sh/v3/covid-19/all"

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setcountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  //Just run at the first load of the component
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data =>{
      setcountryInfo(data);
    })
  }, [])

  
  useEffect(() => {
    //USEEFFECT =  Runs a pierce of code
    // based on a given condition
    //The code inside here will run once
    //When the component loads and not again
    //async -> send a request, wait for it, do something with it

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=> response.json())
      .then((data)=> {
        const countries = data.map((country) => (
          {
            name: country.country,//United States
            value :  country.countryInfo.iso2,// UK, USA, FR
          }
        ));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
      }); 
    
    };

    getCountriesData();
  }, [])


  const onCountryChange = async (event) =>{
    const countryCode = event.target.value;
    const url = 
      countryCode === 'worldwide' 
        ?  "https://disease.sh/v3/covid-19/all" 
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response => response.json())
    .then(data=> {
      setCountry(countryCode);
      setcountryInfo(data);
    })
    
  }
  
 

  return (
    <div className="app">
    
     <div className = "app_left">
       <div className = "app_header">
        <h1>Covid-19 Tracker</h1>
        <FormControl className = "app_dropdown">
          <Select variant = "outlined"  onChange = {onCountryChange} value={country}>
            <MenuItem  value="worldwide">Worldwide</MenuItem>

            {/* Loop throgh all the countries
            and show a drop downa
            list of the options*/}

            {
              countries.map((country)=>(
                  
              <MenuItem value={country.value}> {country.name}</MenuItem>
                  
                ))
            }
                
          </Select>


        </FormControl>
      </div>
      <div className = "app_stats">
         
          <InfoBox tittle = "Coronavirus Cases" total = {countryInfo.cases} cases={countryInfo.todayCases} ></InfoBox>
          <InfoBox tittle = "Recovered" total = {countryInfo.recovered} cases={countryInfo.todayRecovered}></InfoBox>
          <InfoBox tittle = "Deaths" total = {countryInfo.deaths} cases={countryInfo.todayDeaths}></InfoBox>


      </div>
      
      <Map></Map>
      
 
       
      </div> 
     <Card className= "app_right">
            <CardContent>
              <h3>Live Cases by Country</h3>
              <Table countries = {tableData}></Table>
              <h3>Worldwide new Cases</h3>
              <LineGraph></LineGraph>

            </CardContent>
      </Card> 
    </div>
  );
}

export default App;
