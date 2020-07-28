
//To create the basic schema of the app  => rfce 
import React from 'react';
import {Card,CardContent, Typography} from '@material-ui/core'
import "./InfoBox.css";
function InfoBox({tittle, cases, total,active,isGreen,isRed,isBlack, ...props}) {
    return (
        <Card
            onClick = {props.onClick}
            className = {`infoBox ${active && 'infoBox--selected'} ${isRed && "infoBox--red"} ${isBlack && "infoBox--black"}`}>
           <CardContent>
               
                <Typography className="infobox_title" color="textSecondary">{tittle}</Typography> 

                <h2 className = {`infoBox_cases ${isRed && "infoBox__cases--red"} ${isBlack && "infoBox__cases--black"} ${isGreen && "infoBox__cases--green"} `}>{cases}</h2>

                <Typography className = "infoBox_total" color="textSecondary"> {total} Total </Typography>
           </CardContent>
        </Card>
    )
}

export default InfoBox
