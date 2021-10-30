import React from 'react'
import marketPrep from '../Assets/market_prepare.png'
import {Typography} from '@mui/material'

const MarketPlaceScreen = () => {
    return (
        <div>
            <Typography align='center' variant='h2'>
                We are hard at work preparing the market for you
            </Typography>
            <img src={marketPrep} width='100%'/>
        </div>
    )
}

export default MarketPlaceScreen
