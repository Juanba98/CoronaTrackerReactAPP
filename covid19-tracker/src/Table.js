import React from 'react';
import './Table.css';
import numeral from "numeral";
function Table({countries}) {
    //console.log(countries);
    return <div className = "table">
    {countries.slice(0,10).map(({Country,TotalConfirmed}) =>(
       <tbody key = {Country}>
       <tr key={Country}>
            <td>{Country}</td>
            <td><strong>{numeral(TotalConfirmed).format("0,0")}</strong></td>
        </tr>
        </tbody>
    ))}

    </div>
    
            
}

export default Table
