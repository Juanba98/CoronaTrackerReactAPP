import React, {useState,useEffect} from 'react';
import {FormControl,Select,MenuItem,Card,CardContent} from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData, prettyPrintStat} from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
//BEM naming convention
//"https://disease.sh/v3/covid-19/countries/"
//"https://disease.sh/v3/covid-19/all"

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setcountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const[mapCenter,setMapCenter]=
  useState({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setmapZoom] = useState(2);

  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  //Just run at the first load of the component
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json(3))
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
        setMapCountries(data);
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
      console.log(data)
      setCountry(countryCode);
      setcountryInfo(data);

      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setmapZoom(4);
    })
    
  }
  
 

  return (
    <div className="app">
    
     <div className = "app_left">
       <div className = "app_header">
        <h1>COVID-19 TRACKER</h1>
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
         
          <InfoBox
            isRed
            active = {casesType === "cases"}
            onClick={e=>setCasesType('cases')}
            tittle = "Coronavirus Cases" total = {countryInfo.cases} cases={prettyPrintStat(countryInfo.todayCases)} ></InfoBox>
          <InfoBox
            isGreen
            active = {casesType === "recovered"}
            onClick={e=>setCasesType('recovered')}
            tittle = "Recovered" total = {countryInfo.recovered} cases={prettyPrintStat(countryInfo.todayRecovered)}></InfoBox>
          <InfoBox
            isBlack
            active = {casesType === "deaths"}
            onClick={e=>setCasesType('deaths')}
            tittle = "Deaths" total = {countryInfo.deaths} cases={prettyPrintStat(countryInfo.todayDeaths)}></InfoBox>


      </div>
      
      <Map
      casesType ={casesType}
      countries = {mapCountries}
      center={mapCenter}
      zoom = {mapZoom}/>
      
 
       
      </div> 
     <Card className= "app_right">
            <CardContent>
              <h3>Live Cases by Country</h3>
              <Table countries = {tableData}></Table>
              <h3 className = "app__graphTittle">Worldwide new {casesType}</h3>
              <LineGraph className = "app__graph" casesType={casesType}></LineGraph>

            </CardContent>
      </Card> 
    </div>
  );
}

export default App;
