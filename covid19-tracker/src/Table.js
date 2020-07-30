import React from 'react';
import './Table.css';
import numeral from "numeral"
function Table({countriesData}) {
    return <div className = "table">
    {countriesData.map(({Country,TotalConfirmed}) =>(
        <tr>
            <td>{Country}</td>
            <td><strong>{numeral(10).format("0,0")}</strong></td>
        </tr>

    ))}

    </div>
    
            
}

export default Table
