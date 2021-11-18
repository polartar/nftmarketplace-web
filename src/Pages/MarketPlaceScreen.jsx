import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import {
    Container,
    Box,
    Dialog,
    CircularProgress,
    Stack,
    CardMedia,
    Grid,
    Card,
    Typography,
    DialogContent, 
    DialogActions,
    CardActions,
    Pagination,
    Button,
    Paper,
} from '@mui/material'
import { loadPage, init } from '../GlobalState/Market'
import { getAnalytics, logEvent } from '@firebase/analytics'
import { useSelector, useDispatch } from 'react-redux'
import { connectAccount, chainConnect } from '../GlobalState/User'
import MetaMaskOnboarding from '@metamask/onboarding';


const MarketPlaceScreen = () => {
    const dispatch = useDispatch();
    // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const state = useSelector((state)=>{
        return state;
    });

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'marketplace'
        });
        dispatch(init(state));
    }, []);

    const [page, setPage] = React.useState(1);
    const handleChange = (event, value) => {
      setPage(value);
    };

    const response = useSelector((state) => {
        return state.market.response;
    });


    useEffect(() => {
        if(typeof listings === "undefined" && response != null){
            dispatch(loadPage(state, page));
        }
    }, [page, response]);

    const totalPages = useSelector((state) => {
        return state.market.totalPages;
    })

    const listings = useSelector((state) => {
        return state.market.listings[page];
    });

    const user = useSelector((state) => {
        return state.user;
    });

    const [buying, setBuying] = useState(false);
    const [error, setError] = useState(null);
    const closeError = () => {
        setError(null);
    };

    const loadingMarket = useSelector((state) => {
        return state.market.loadingPage;
    });

    const [showSuccess, setShowSuccess] = useState({
        show : false,
        hash: ""
    });

    const closeSuccess = () => {
        setShowSuccess({
            show: false,
            hash: ""
        });
    };

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
    
    return (
        <Container maxWidth='lg'>  
            
            <Box mb={16} mt={4} >
            <Stack>

                <Grid container spacing={4} justifyContent="center" alignItems="center" direction='row'>
                    {(!listings) ? null :  listings.map((val) => 
                        <Grid item xs={12} xl={3} lg={3} md={4} sm={6}  key={val.listingId.toNumber()}>
                            <Card>
                                <CardMedia  component='img' image={val.nft.image} height='285' sx={{}} />

                                <Box sx={{ p: 2, height : 150}}>
                                    <Typography  noWrap variant="h5" color='primary'>
                                        {val.nft.name}
                                    </Typography>

                                    <Typography variant='subtitle2' paragraph>
                                        {val.nft.description}
                                    </Typography>
                                </Box>
                                <CardActions>
                                    
                                    <Typography variant="subtitle2" color='primary'>
                                        {ethers.utils.formatEther(val.price)} CRO
                                    </Typography>
                                    <Button onClick={showBuy(val)}>Buy</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    )}
                </Grid> 
    
            <Container>
                <Pagination count={totalPages} page={page} siblingCount={3} boundaryCount={2} onChange={handleChange}/>
            </Container>
            </Stack>
            
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

            <Dialog
                open={loadingMarket}>
                <DialogContent>
                    <Stack spacing={2} direction='row'>
                        <CircularProgress/>
                        <Typography variant='h3'>
                            Loading...
                        </Typography>
                    </Stack>
                </DialogContent>
            </Dialog>
            </Box>
        </Container>
    )
}

export default MarketPlaceScreen
