import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { useParams } from "react-router-dom";

import { 
    Container,
    Box,
} from '@mui/material'
import NFTDetails from '../Components/MyNFT/NFTDetails'

export const DirectListing = () => {
    let { id } = useParams();
    return(
        <Container maxWidth='lg'>
            <Box mt={16} mb={16}>
                <NFTDetails listingId={id} />
            </Box>
        </Container>
    )
}