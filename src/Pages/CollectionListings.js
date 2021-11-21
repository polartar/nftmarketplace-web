import React, { useEffect } from 'react'

import {
    Container,
} from '@mui/material'
import { useParams } from "react-router-dom";
import { getAnalytics, logEvent } from '@firebase/analytics'
import MarketSelection from '../Components/Market/MarketScreen';


const CollectionScreen = () => {
    let { address } = useParams();
    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'marketplace_collection',
            collection_address : address
        });
    }, [address]);

    
    return (
        <Container maxWidth='lg'>  
            <MarketSelection collection={address}/>
        </Container>
    )
}

export default CollectionScreen
