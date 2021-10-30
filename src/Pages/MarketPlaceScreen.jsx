import React from 'react'
import marketPrep from '../Assets/market_prepare.jpg'
import {Typography, Container, Box} from '@mui/material'
import FullCounter from '../Components/Counter/FullCounter'

const MarketPlaceScreen = () => {
    return (
        <Container maxWidth='xl'>  
            <Box m={5}>
            <Typography align='center' variant='h3'>
                We are hard at work preparing the market for you
            </Typography>
            </Box>     
            
            <img src={marketPrep} width='100%'/>

            <Box m={5}>
            <Typography align='center' variant='h3'>
                Cronos Launches In...
            </Typography>
            <FullCounter/>
            </Box>   
            
        </Container>
    )
}

export default MarketPlaceScreen
