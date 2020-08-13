import React from 'react';
import './Map.css'
import {Map as LeafletMap, TileLayer} from "react-leaflet";
import { showDataOnMap } from './util';
function Map({countries,center, casesType,zoom,setCountry,mapInfo}) {
    return (
        <div className = "map">
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    atribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'></TileLayer>

                    {/* Lopp throug countries and drow circles oin the screeen*/}
                    {showDataOnMap(countries,casesType,setCountry,mapInfo)}
            </LeafletMap>
        </div>
    
    )
}

export default Map
