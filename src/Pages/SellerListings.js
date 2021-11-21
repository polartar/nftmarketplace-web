import React, { useEffect } from 'react'

import {
    Container,
} from '@mui/material'
import { useParams } from "react-router-dom";
import { getAnalytics, logEvent } from '@firebase/analytics'
import MarketSelection from '../Components/Market/MarketScreen';


const SellerScreen = () => {
    let { address } = useParams();
    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'marketplace_seller',
            seller_address : address
        });
    }, [address]);

    
    return (
        <Container maxWidth='lg'>  
            <MarketSelection seller={address}/>
        </Container>
    )
}

export default SellerScreen
