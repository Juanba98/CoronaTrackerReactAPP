
//To create the basic schema of the app  => rfce 
import React from 'react';
import {Card,CardContent, Typography} from '@material-ui/core'

function InfoBox({tittle, cases, total}) {
    return (
        <Card className = "infoBox">
           <CardContent>
               
                <Typography className="infobox_title" color="textSecondary">{tittle}</Typography> 

                <h2 className = "infoBox_cases">{cases}</h2>

                <Typography className = "infoBox_total" color="textSecondary"> {total} Total </Typography>
           </CardContent>
        </Card>
    )
}

export default InfoBox
