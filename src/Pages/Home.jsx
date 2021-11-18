import { Typography, Link, Stack } from '@mui/material'
import { Box } from '@mui/system'
import {React, useEffect} from 'react'
import CardSection from '../Components/CardSection/CardSection'
import { getAnalytics, logEvent } from '@firebase/analytics'
import nebkas from '../Assets/nebkas-logo.png'

const Home = () => {
    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'home'
        })
    }, []);

    return (
        <Box mt={16} mb={16}>
            <Typography align='center' variant='h3' color='primary'>
                Commemorative and Founding Member NFTs 
            </Typography>
            <CardSection />
            <Stack>
                <Typography align='center' variant='subtitle2' color='primary'>
                    Powered By:
                </Typography>
                <Link align='center' target='_blank' href='https://nebkas.ro'>
                    <img src={nebkas} alt='nebkas.co' width='128px'/>
                </Link>
            </Stack>

        </Box>
    )
}

export default Home
