import React, {useState, useEffect} from 'react'
import { ethers } from 'ethers'
import {useSelector, useDispatch} from 'react-redux'
import { useTheme, styled } from '@mui/material/styles';
import { getAnalytics, logEvent } from '@firebase/analytics'

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
    Chip,
    Box,
    Paper,
    CircularProgress
} from '@mui/material'

import { connectAccount, chainConnect } from '../../GlobalState/User'
import MetaMaskOnboarding from '@metamask/onboarding';
import { getListing, onListingLoaded } from '../../GlobalState/Market';
import { useHistory } from 'react-router';


export default function NFTDetails({
    listingId
}){

    const dispatch = useDispatch();
    const theme = useTheme();
    const history = useHistory();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const listing = useSelector((state) => {
        return state.market.currentListing;
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
        dispatch(getListing(state, listingId));
    }, [listingId])

    const [showSuccess, setShowSuccess] = useState({
        show : false,
        hash: ""
    });

    const [buying, setBuying] = useState(false);
    const [error, setError] = useState(null);
    const closeError = () => {
        setError(null);
    };
    const closeSuccess = () => {
        setShowSuccess({
            show: false,
            hash: ""
        });
    };

    useEffect(() => {
        if(listing != null){
            logEvent(getAnalytics(), 'screen_view', {
                firebase_screen : 'NFT Details',
                name : listing.nft.name,
                id : listing.nftId,
                listingId : listing.listingId
            })
        }
    }, [listing])

    const showBuy = () => async () => {
        if(user.address){
            setBuying(true);
            try{
                const tx = await user.marketContract.makePurchase(listing.listingId, {
                    'value' : listing.price
                });
                const receipt = await tx.wait();
                setShowSuccess({
                    show: true,
                    hash: receipt.hash
                });
                dispatch(onListingLoaded({
                    ...listing,
                    'state' : 1,
                    'purchaser' : user.address
                }));
            }catch(error){
                if(error.data){
                    setError(error.data.message);
                } else if(error.message){
                    setError(error.message)
                } else {
                    console.log(error);
                    setError("Unknown Error")
                }
            }finally{
                setBuying(false);
            }
        } else{
            if(user.needsOnboard){
                const onboarding = new MetaMaskOnboarding();
                onboarding.startOnboarding();
            } else if(!user.address){
                dispatch(connectAccount());
            } else if(!user.correctChain){
                dispatch(chainConnect());
            }
        }

    }

    const viewCollection = (listing) => () => {
        history.push(`/collection/${listing.nftAddress}`)
    }

    const viewSeller = (listing) => () => {
        history.push(`/seller/${listing.seller}`)
    }

    return(
        <Paper elevation={4}>
            {(listing !== null) ? 
            <Box p={4}>
                <Grid container spacing={{sm : 4}} columns={fullScreen ? 1 : 2}>
                    <Grid item xs={2} md={1} key='1'>
                        <Container>
                            <CardMedia component='img' src={listing.nft.image} width='350' />
                        </Container>
                    </Grid>
                    <Grid item xs={1} key='2' >
                    <Stack spacing={2} direction='column' alignItems='flex-start'>

                        <Typography  variant="h5" color='primary' component="p">
                            {listing.nft.name}
                        </Typography>

                        <Stack direction='row' spacing={2}>
                            <Typography variant='subtitle2' component='p' sx={{pt:1}}>
                                {ethers.utils.formatEther(listing.price)} CRO
                            </Typography>

                            { (listing.state === 0) ? 
                            <Button onClick={showBuy()}>Buy</Button> : 
                            <Typography variant='subtitle1' color='primary'>
                                {(listing.state === 1) ? 'SOLD' : 'CANCELLED' }
                            </Typography>
                            }
                        </Stack>

                        <Typography variant='subtitle1' component='p'>
                            {listing.nft.description}
                        </Typography>
                    
                        {
                            (listing.nft.properties !== null && listing.nft.properties.length > 0) ?
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
                                {listing.nft.properties.map((data, i) => {
                                    return (
                                    <ListItem key={i}>
                                        <Chip label={data['trait_type'] + ' : ' + data['value']} color="primary"/>
                                    </ListItem>
                                    );
                                })}
                         </Box> : null
                        }

                        <Button onClick={viewCollection(listing)}>More From Collection</Button>
                        <Button onClick={viewSeller(listing)}>More From Seller</Button>

                        
                    </Stack>
                    </Grid>
                    
                </Grid> 
            </Box>:

            <Dialog
                open={listing === null}>
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
            <Dialog 
                onClose={closeSuccess}
                open={showSuccess.show}>
                <DialogContent>
                    <Typography variant='h3'>Success! 🥳 </Typography>
                    <Typography variant='subtitle2'>{showSuccess.hash}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeSuccess}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={buying}>
                <DialogContent>
                    <Stack spacing={2} direction='row'>
                        <CircularProgress/>
                        <Typography variant='h3'>
                            Attempting Purchase...
                        </Typography>
                    </Stack>
                </DialogContent>
            </Dialog>
            
            <Dialog 
                open={error != null}
                onClose={closeError}>
                    <DialogContent>
                        <Typography variant='h3'>There was an issue 😵</Typography>
                        <Typography variant='subtitle2'>{
                            (error) ? error : ""
                        }</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeError}>Close</Button>
                    </DialogActions>
            </Dialog>
        </Paper>
    )
}