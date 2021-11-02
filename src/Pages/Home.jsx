import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import {React, useEffect} from 'react'
import CardSection from '../Components/CardSection/CardSection'
import { getAnalytics, logEvent } from '@firebase/analytics'

const Home = () => {
    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'home'
        })
    }, []);

    return (
        <Box mt={16}>
            <Typography align='center' variant='h3' color='primary'>
                Commemorative and Founding Member NFTs 
            </Typography>
            <CardSection />
        </Box>
    )
}

export default Home
