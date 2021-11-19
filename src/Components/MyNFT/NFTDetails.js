import React, {useState, useEffect} from 'react'

import {useSelector, useDispatch} from 'react-redux'


import { 
    Button,
    CardMedia, 
    Container, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    Grid, 
    Stack, 
    Typography, 
    useMediaQuery,
    Slider,
    TextField,
    CircularProgress
} from '@mui/material'
import { Box } from '@mui/system';

export default function NFTDetails({
    listingId
}){
    console.log(listingId);
    return(
        <Box>
            <Typography>
                {listingId}
            </Typography>
        </Box>
    )
}