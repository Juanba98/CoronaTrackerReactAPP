import React, {useState,useEffect} from 'react';
import {FormControl,Select,MenuItem} from '@material-ui/core';
import './App.css';
//BEM naming convention
//"https://disease.sh/v3/covid-19/countries"

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  //USEEFFECT =  Runs a pierce of code
  // based on a given condition

  useEffect(() => {
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

        setCountries(countries)
      }); 
    
    };

    getCountriesData();
  }, [])


const onCountryChange = (event) =>{
  const countryCode = event.target.value;
  setCountry(countryCode);
}

  return (
    <div className="app">
      
      <div className = "app_header">
        <h1>Covid-19 Tracker</h1>
        <FormControl className = "app_dropdown">
          <Select variant = "outlined"  onChange = {onCountryChange} value={country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>

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


      


      {/*Header*/}
      {/*Title + Select input dropdown field*/}
      {/*InfoBoxs*/}
      {/*InfoBoxs*/}
      {/*InfoBoxs*/}

      {/*Table*/}
      {/*Graph*/}



      {/*Map*/}

    </div>
  );
}

export default App;
