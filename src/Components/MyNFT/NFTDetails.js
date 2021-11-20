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
import { getListing } from '../../GlobalState/Market';


export default function NFTDetails({
    listingId
}){

    const dispatch = useDispatch();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const nft = useSelector((state) => {
        return state.market.currentListing;
    })
    const user = useSelector((state) => {
        return state.user;
    });
    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
      }));
    useEffect(() => {
        dispatch(getListing(listingId));
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
        if(nft != null){
            logEvent(getAnalytics(), 'screen_view', {
                firebase_screen : 'NFT Details',
                name : nft.name,
                id : nft.nftId,
                listingId : nft.listingId
            })
        }
    }, [nft])

    const showBuy = (listing) => async () => {
        if(user.address){
            setBuying(true);
            try{
                const tx = await user.marketContract.makePurchase(listing.listingId, {
                    'value' : listing.price
                });
                const receipt = tx.wait();
                setShowSuccess({
                    show: true,
                    hash: receipt.hash
                });
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

    return(
        <Paper elevation='4'>
            {(nft != null) ? 
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

                        <Typography variant='subtitle2' component='p'>
                            {ethers.utils.formatEther(nft.price)} CRO
                        </Typography>

                        <Typography variant='subtitle1' component='p'>
                            {nft.description}
                        </Typography>
                    
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
                            {nft.properties.map((data) => {
                                return (
                                <ListItem key={data['trait_type']}>
                                    <Chip label={data['trait_type'] + ' : ' + data['value']} color="primary"/>
                                </ListItem>
                                );
                            })}
                        </Box>

                        <Button onClick={showBuy(nft)}>Buy</Button>
                    </Stack>
                    </Grid>
                    
                </Grid> 
            </Box>:

            <Dialog
                open={nft == null}>
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