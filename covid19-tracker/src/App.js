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

//To get the day of the week is 
// const x = new Date();
//console.log(x.getDay())
function App() {
  const [countryName,setCountryName] = useState("Global")
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("global");
  const [countryInfo, setcountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const[mapCenter,setMapCenter]=
  useState({ lat: 34.80746, lng: -1.236741});
  
  const [mapZoom, setmapZoom] = useState(2);
  const [mapInfo, setMapInfo] = useState([]);

  
  const [countriesInfo, setCountriesInfo] = useState([]);
  const [casesType, setCasesType] = useState("TotalConfirmed");
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
          setCountriesInfo(Countries);
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
      .then((data)=> {    
        const mapInfoTemp =  data.map((country) => (
          
          {
            countryCode: country.countryInfo.iso2,
            lat: country.countryInfo.lat,
            long: country.countryInfo.long,
            flag:  country.countryInfo.flag,

          }))
          
          setMapInfo(mapInfoTemp);
         
        
      
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
        
       
        
        if(countryCode === 'global'){
          setcountryInfo(Global);
          setmapZoom(2);
          setMapCenter([34.80746,  -40.4796]);

        }else{
          const countryInfoTemp = Countries.filter((country)=>(
          country.CountryCode === countryCode
           
      ))
     
        setCountry(countryCode);
        setcountryInfo(countryInfoTemp[0]);
        //console.log(mapInfo);
        const info = mapInfo.filter((info) =>(
          info.countryCode === countryCode 
        ))
        const {lat,long} = info[0];
        setmapZoom(4);
        setMapCenter([lat,long]);
        const countryN =  countries.filter((countryTemp) =>(
          countryTemp.value === countryCode
        ))
       setCountryName(countryN[0].label) 
        
      }
        
        
     
      })
     
  }

  
  const changeCountryOnClick = async(country) => {
    const url = 'https://api.covid19api.com/summary';
    await fetch(url)
      .then(response => response.json())
      .then(({Countries}) => {
        const countryInfoTemp = Countries.filter((countryTemp)=>(
          countryTemp.CountryCode === country
        ))
        setCountry(country);
        console.log(country)
        setcountryInfo(countryInfoTemp[0]);
        const countryN =  countries.filter((countryTemp) =>(
          countryTemp.value === country
        ))
        const info = mapInfo.filter((info) =>(
          info.countryCode === country 
        ))
        const {lat,long} = info[0];
        //set color circle other red 
        //SetZoom(6)
        setmapZoom(4);
        setMapCenter([lat,long]);
        setCountryName(countryN[0].label) 
  })};
  
  
  
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
              value = {{label: countryName ,value: country}}
              isSearchable
            />
           


        </FormControl>
      </div>

      <div className = "app_stats">
         
          <InfoBox
            isRed
            active = {casesType === "TotalConfirmed"}
            onClick={e=>setCasesType('TotalConfirmed')}
            tittle = "Coronavirus Cases" total = {prettyPrintStatTotal(countryInfo.TotalConfirmed)} cases={prettyPrintStat(countryInfo.NewConfirmed)} 
          />
      
          <InfoBox
            isGreen
            active = {casesType === "TotalRecovered"}
            onClick={e=>setCasesType('TotalRecovered')}
            tittle = "Recovered" total = {prettyPrintStatTotal(countryInfo.TotalRecovered)} cases={prettyPrintStat(countryInfo.NewRecovered)}
          />

          <InfoBox
            isBlack
            active = {casesType === "TotalDeaths"}
            onClick={e=>setCasesType('TotalDeaths')}
            tittle = "Deaths" total = {prettyPrintStatTotal(countryInfo.TotalDeaths)} cases={prettyPrintStat(countryInfo.NewDeaths)}
          />


      </div>
      
      <Map
      setCountry = {changeCountryOnClick}
      casesType ={casesType}
      countries = {countriesInfo}
      center={mapCenter}
      zoom = {mapZoom}
      mapInfo = {mapInfo}
      />
     
 
       
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
