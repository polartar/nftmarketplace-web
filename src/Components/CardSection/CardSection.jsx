import React from 'react'
import MyCard from '../Card/Card'
import {useSelector} from 'react-redux'
import './cardSec.css'
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@mui/material'

export function CardItem(data) {
    console.log(data.title);
    return(
        <Card sx={{maxWWidth: 450, margin: 15, }}>
            <CardActionArea>
            <div
                style={{
                  display: "flex",
                  alignItem: "center",
                  justifyContent: "center"
                }}
              >
                <CardMedia style={{
                    width: "auto",
                    maxHeight: "200px" 
                  }}
                  component='img'
                  image={data.img}
                  title='...'/>
              </div>
              <CardContent>
                  <Typography gutterBottom variant="headline" component="h2">
                      {data.title}
                  </Typography>

              </CardContent>
            </CardActionArea>
        </Card>
    )
}

const CardSection = () => {
    const cardSelector = useSelector((state)=>{
        return state.reducer.nftCard
    })
    return (
        // <div className='cardSectContainer'>
        //     <MyCard data={cardSelector} />
        // </div>
        <Grid container spacing={1} justifyContent="center"  alignItems="center">
        {
            cardSelector.map((val, j) => {
                console.log(val)
                console.log(j)
                return(
                    <Grid item xs={12} xl={4} lg={4} md={4} sm={6}  key={j}>
                    <CardItem val/>
                    </Grid>
                )
            })
        }
        </Grid>
    )
}

export default CardSection
