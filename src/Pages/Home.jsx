import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import CardSection from '../Components/CardSection/CardSection'


const Home = () => {
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
