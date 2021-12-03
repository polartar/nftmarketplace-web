import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { useTheme, styled } from '@mui/material/styles';
import { getAnalytics, logEvent } from '@firebase/analytics'

import { 
    Button,
    CardMedia, 
    Container, 
    Dialog, 
    DialogContent, 
    Grid, 
    Stack, 
    Typography, 
    useMediaQuery,
    Chip,
    Box,
    Paper,
    CircularProgress,
} from '@mui/material'

import {getNftDetails} from '../../GlobalState/User'
import { useHistory } from 'react-router';


export default function NFTDetails({
    collectionId,
    nftId
}){

    const dispatch = useDispatch();
    const theme = useTheme();
    const history = useHistory();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const nft = useSelector((state) => {
        return state.user.currentNft;
    })
    const user = useSelector((state) => {
        return state.user;
    });
    const state = useSelector((state) => {
        return state;
    });

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
      }));

    useEffect(() => {
        dispatch(getNftDetails(state, collectionId, nftId));
    }, [collectionId, nftId])

    useEffect(() => {
        if(nft != null){
            logEvent(getAnalytics(), 'screen_view', {
                firebase_screen : 'NFT Details',
                name : nft.name,
                id : nft.nftId,
                contract : collectionId
            })
        }
    }, [nft])

    const viewCollection = () => () => {
        history.push(`/collection/${collectionId}`)
    }

    return(
        <Paper elevation={4}>
            {(nft !== null) ?
            <Box p={4}>
                <Grid container spacing={{sm : 4}} columns={fullScreen ? 1 : 2}>
                    <Grid item xs={2} md={1} key='1'>
                        <Container>
                            <CardMedia component='img' src={nft.image} width='350' />
                        </Container>
                    </Grid>
                    <Grid item xs={1} key='2' >
                    <Stack spacing={2} direction='column' alignItems='flex-start'>

                        <Typography  variant="h5" color='primary' component="p">
                            {nft.name}
                        </Typography>


                        <Typography variant='subtitle1' component='p'>
                            {nft.description}
                        </Typography>
                    
                        {
                            (nft.properties !== null && nft.properties.length > 0) ?
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                    listStyle: 'none',
                                    p: 0.5,
                                    m: 0,
                                }}
                                component="ul"
                                >
                                {nft.properties.map((data, i) => {
                                    return (
                                    <ListItem key={i}>
                                        <Chip label={data['trait_type'] + ' : ' + data['value']} color="primary"/>
                                    </ListItem>
                                    );
                                })}
                         </Box> : null
                        }

                        <Button onClick={viewCollection()}>More From Collection</Button>
                    </Stack>
                    </Grid>

                </Grid> 
            </Box>:

            <Dialog
                open={nft === null}>
                <DialogContent>
                    <Stack spacing={2} direction='row'>
                        <CircularProgress/>
                        <Typography variant='h3'>
                            Loading...
                        </Typography>
                    </Stack>
                </DialogContent>
            </Dialog>
        }
        </Paper>
    )
}