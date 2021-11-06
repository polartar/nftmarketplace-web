import React, { useEffect } from 'react'
import marketPrep from '../Assets/market_prepare.webp'
import {Typography, Container, Box} from '@mui/material'
import FullCounter from '../Components/Counter/FullCounter'
import { getAnalytics, logEvent } from '@firebase/analytics'


const MarketPlaceScreen = () => {

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'marketplace'
        })
    }, []);
    
    return (
        <Container maxWidth='xl'>  
            <Box m={5}>
            <Typography align='center' style={{fontWeight : 600, fontSize: 44}} color='primary'>
                We are hard at work preparing the market for you.
            </Typography>
            </Box>     
            
            <img src={marketPrep} width='100%' alt='Market Prep'/>

            <Box m={5} mb={12}>
                <Typography align='center'  style={{fontWeight : 600, fontSize: 34}} color='primary'>
                    Cronos Launches In...
                </Typography>
                <FullCounter/>
            </Box>   
            
        </Container>
    )
}

export default MarketPlaceScreen
