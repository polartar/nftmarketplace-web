import React, { useEffect } from 'react'

import {
    Container,
} from '@mui/material'

import { getAnalytics, logEvent } from '@firebase/analytics'
import MarketSelection from '../Components/Market/MarketScreen';


const MarketPlaceScreen = () => {

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'marketplace'
        });
    }, []);

    
    return (
        <Container maxWidth='lg'>  
            <MarketSelection/>
        </Container>
    )
}

export default MarketPlaceScreen
