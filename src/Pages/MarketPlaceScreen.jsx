import React, { useEffect } from 'react'
// import marketPrep from '../Assets/market_prepare.webp'
import {
    Typography,
    Container,
    Box,
    Dialog,
    CircularProgress,
    Stack,
    DialogContent
} from '@mui/material'
import { loadMarket } from '../GlobalState/Market'
import { getAnalytics, logEvent } from '@firebase/analytics'
import { useSelector, useDispatch } from 'react-redux'


const MarketPlaceScreen = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'marketplace'
        });
        dispatch(loadMarket());
    }, []);


    const loadingMarket = useSelector((state) => {
        return state.market.loadingPage;
    })
    
    return (
        <Container maxWidth='xl' mb={12}>  
            
            <Dialog
                open={loadingMarket}>
                <DialogContent>
                    <Stack spacing={2} direction='row'>
                        <CircularProgress/>
                        <Typography variant='h3'>
                            Loading...
                        </Typography>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Container>
    )
}

export default MarketPlaceScreen
