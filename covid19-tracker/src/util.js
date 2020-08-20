import {Circle, Popup} from "react-leaflet";
import React from "react";
import numeral  from "numeral";

const casesTypeColors={
    TotalConfirmed:{
        hex: "#CC1034",
        multiplier:800,

    },
    TotalRecovered: {
        hex: "#7dd71d",
        multiplier:1200,
    },
    TotalDeaths: {
        hex: "#000000",
        multiplier:2000,
    },
}

export const sortData = (data)=>{
    
    const sortedData = [...data];
    
    sortedData.sort((a,b) => {
        if(a.TotalConfirmed > b.TotalConfirmed){
            return -1;

        }else{
            return 1;
        }
    })
    //console.log(sortedData);
    return sortedData;
}

//Draw cicles on the map with interactive tooltop
export const showDataOnMap = (data, casesType='TotalConfirmed',setCountry, mapInfo) =>(
   
    data.map(country =>{
        const info  = mapInfo.filter((info) =>(
            info.countryCode === country.CountryCode
        ))
        if(info[0]){
            const {long,lat,flag} = info[0];
            /*console.log(long,lat,flag);
            console.log(country)
            
            console.log(casesType,">>>>>",country[casesType])*/
          return (
                 <Circle
                     key = {country.CountryCode}
                     center = {[lat, long]}
                     fillOpacity = {0.4}
                     color={casesTypeColors[casesType].hex}
                     fillColor={casesTypeColors[casesType].hex}
                     radius ={
                         Math.sqrt(country[casesType])*casesTypeColors[casesType].multiplier
                     }
                 
                 >
                 <Popup
                 onOpen = {()=>{setCountry(country.CountryCode)}}  >
                     
                     <div className="info-container">
                         <div 
                             className="info-flag"
                             style={{backgroundImage: `url(${flag})`}}/>
                         
                         <div className = "info-name">{country.country}</div>
                         <div className = "info-confirmed">Cases: {numeral(country.TotalConfirmed).format("0,0")}</div>
                         <div className = "info-recovered">Recovered: {numeral(country.TotalRecovered).format("0,0")}</div>
                         <div className = "info-deaths">Deaths: {numeral(country.TotalDeaths).format("0,0")}</div>
                     </div>
                 </Popup> 
                 </Circle>
            
                 )
            
      }})
)

export const prettyPrintStat = (stat) => (
    stat ? `+${numeral(stat).format("0,0")}` : "+0"

    )

export const prettyPrintStatTotal = (stat) => (
    stat ? `${numeral(stat).format("0,0")}` : "0"

    )