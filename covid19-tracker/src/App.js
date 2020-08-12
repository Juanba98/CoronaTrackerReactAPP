import React, {useState,useEffect} from 'react';
import {FormControl,Card,CardContent} from '@material-ui/core';
import Select from "react-select";
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData, prettyPrintStat,prettyPrintStatTotal} from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

//BEM naming convention
//"https://disease.sh/v3/covid-19/countries/"
//"https://disease.sh/v3/covid-19/all"



function App() {
  
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("global");
  const [countryInfo, setcountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const[mapCenter,setMapCenter]=
  useState({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setmapZoom] = useState(2);

  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  //Just run at the first load of the component


  useEffect(() => {
    fetch("https://api.covid19api.com/summary")
    .then(response => response.json(3))
    .then(data =>{

      const {Global} = data;
      setcountryInfo(Global);
      
    })
  }, [])

  
  useEffect(() => {
    //USEEFFECT =  Runs a pierce of code
    // based on a given condition
    //The code inside here will run once
    //When the component loads and not again
    //async -> send a request, wait for it, do something with it

    const getCountriesData = async () => {
     const url = 'https://api.covid19api.com/summary'; 
      fetch(url)
        .then (response => response.json())
        .then((data)=>{
          const {Countries} = data;
          //Name and value 
          
          const temp = Countries.map((country) =>(
            {
              label: country.Country,
              value: country.CountryCode, 
            }
          ))
          
          const countries = [
            {label: 'Global', value: 'global'},
            ...temp, 
          ]       

          const sortedData = sortData(Countries);
          
          
          setTableData(sortedData);
          setCountries(countries);

        })
    
    };

    const mapData = async ( ) => {
      
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=> response.json())
      .then((data)=> {setMapCountries(data)          
      });
      
    }
    getCountriesData();
    mapData();
  }, [])

  //When we change global 
  const onCountryChange = async (selected_country) =>{
    
    const countryCode = selected_country.value;
    
    const url = 'https://api.covid19api.com/summary';
    await fetch(url)
      .then(response => response.json())
      .then(({Countries,Global}) => {
        
        setCountry(countryCode);
        
        if(countryCode === 'global'){
          setcountryInfo(Global);

        }else{
          const countryInfoTemp = Countries.filter((country)=>(
          country.CountryCode === countryCode
           
      ))
     
        
        setcountryInfo(countryInfoTemp[0]);
      }
        
        
     
      })
     
  }

  
  const changeCountryOnClick = async(country) => {
    
  };

  
  return (
     
    <div className="app">
    
     <div className = "app_left">
     
       <div className = "app_header">
     
        <h1>COVID-19 TRACKER</h1>
     
         <FormControl className = "app_dropdown">
     
            <Select 
              className = "select"
              defaultValue = {{label:"Global",value:"global"}}
              options = {countries}
              onChange = {onCountryChange} 
              isSearchable
            />
           


        </FormControl>
      </div>

      <div className = "app_stats">
         
          <InfoBox
            isRed
            active = {casesType === "cases"}
            onClick={e=>setCasesType('cases')}
            tittle = "Coronavirus Cases" total = {prettyPrintStatTotal(countryInfo.TotalConfirmed)} cases={prettyPrintStat(countryInfo.NewConfirmed)} 
          />
      
          <InfoBox
            isGreen
            active = {casesType === "recovered"}
            onClick={e=>setCasesType('recovered')}
            tittle = "Recovered" total = {prettyPrintStatTotal(countryInfo.TotalRecovered)} cases={prettyPrintStat(countryInfo.NewRecovered)}
          />

          <InfoBox
            isBlack
            active = {casesType === "deaths"}
            onClick={e=>setCasesType('deaths')}
            tittle = "Deaths" total = {prettyPrintStatTotal(countryInfo.TotalDeaths)} cases={prettyPrintStat(countryInfo.NewDeaths)}
          />


      </div>
      
      <Map
      setCountry = {changeCountryOnClick}
      casesType ={casesType}
      countries = {mapCountries}
      center={mapCenter}
      zoom = {mapZoom}
      countriesInfo = {countriesInfo}/>
      
 
       
      </div> 
     <Card className= "app_right">
            <CardContent>
              <h3>Top 10 Countries by Cases</h3>
              
              <Table countries = {tableData}></Table>
              <h3 className = "app__graphTittle">Worldwide new {casesType}</h3>
              <LineGraph className = "app__graph" casesType={casesType}></LineGraph>
          
            </CardContent>
      </Card> 
    </div>
  );
}

export default App;
