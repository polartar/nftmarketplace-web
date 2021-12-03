import React from 'react'
import { useParams } from "react-router-dom";

import { 
    Container,
    Box,
} from '@mui/material'
import NFTDetails from '../Components/MyNFT/NFTDetails'

export const SingleNftDetails = () => {
    let { address, id } = useParams();
    return(
        <Container maxWidth='lg'>
            <Box mt={16} mb={16}>
                <NFTDetails collectionId={address} nftId={id} />
            </Box>
        </Container>
    )
}