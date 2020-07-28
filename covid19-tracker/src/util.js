import {Circle, Popup} from "react-leaflet";
import React from "react";
import numeral  from "numeral";

const casesTypeColors={
    cases:{
        hex: "#CC1034",
        multiplier:800,

    },
    recovered: {
        hex: "#7dd71d",
        multiplier:1200,
    },
    deaths: {
        hex: "#fb4443",
        multiplier:2000,
    },
}

export const sortData = (data)=>{
    const soertedData = [...data];

    soertedData.sort((a,b) => {
        if(a.cases > b.cases){
            return -1;

        }else{
            return 1;
        }
    })

    return soertedData;
}

//Draw cicles on the map with interactive tooltop
export const showDataOnMap = (data, casesType='cases') =>(
    data.map(country =>(
        <Circle
            center = {[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity = {0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius ={
                Math.sqrt(country[casesType])*casesTypeColors[casesType].multiplier
            }
           
        >
         <Popup>
            <h1>hi im a pop up</h1>     
        </Popup> 
        </Circle>
       
    ))
)