import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import CloseIcon from '@mui/icons-material/Close';
import { Redirect } from 'react-router-dom'
import {
    CardMedia,
    Container,
    Grid,
    Alert,
    IconButton,
    Collapse,
    Card,
    Typography,
    Dialog, 
    Stack,
    DialogContent, 
    CircularProgress,
    useMediaQuery,
    Button,
    TextField,
    DialogActions,
    CardActions,
    DialogTitle,
    Stepper,
    Step,
    StepLabel,
    Snackbar,
    StepContent,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';

import { getAnalytics, logEvent } from '@firebase/analytics'
import { fetchNfts } from '../../GlobalState/User';
import { Box } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { nanoid } from 'nanoid'
import LinkIcon from '@mui/icons-material/Link';
import { registeredCode, withdrewRewards, transferedNFT, updateListed, withdrewPayments } from '../../GlobalState/User';
import {ethers} from 'ethers'
import './mynft.css'


export const MyNFTs = () => {

    const dispatch = useDispatch();
    const theme = useTheme();

    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [alertOpen, setAlertOpen] = useState(true);
    const [askTransfer, setAskTransfer] = useState(false);

    
    const [progressText, setProgressText] = useState('Working...');
    const [doingWork, setDoingWork] = useState(false);
    const [selectedNft, setSelectedNft] = useState(null);
    const [transferAddress, setTransferAddress] = useState(null);

    const user = useSelector((state) => {
        return state.user;
    });

    const [error, setError] = React.useState({
        error: false,
        message: ""
    });

    const closeError = () => {
        setError({error: false, message: error.message});
    };
    const [showSuccess, setShowSuccess] = useState({
        show : false,
        hash: ""
    });
    const closeSuccess = () => {
        setShowSuccess({
            show: false,
            hash: ""
        });
    }

    useEffect(() => {
        dispatch(fetchNfts(user))
    }, []);

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'my_nfts'
        })
    }, []);

    const withdrawPayments = async () => {
        try {
            setDoingWork(true);
            const tx = await user.membershipContract.withdrawPayments(user.address);
            const receipt = await tx.wait();
            setShowSuccess({
                show: true,
                hash: receipt.hash
            });
            dispatch(withdrewRewards());
        }catch(error){
            if(error.data){
                setError({error: true, message: error.data.message});
            } else if(error.message){
                setError({error: true, message: error.message});
            } else {
                console.log(error);
                setError({error: true, message: "Unknown Error"});
            }
        }finally{
            setDoingWork(false);
        }
    }

    const withdrawBalance = async() => {
        try{
            setDoingWork(true);
            const tx = await user.marketContract.withdrawPayments(user.address);
            const receipt = await tx.wait();
            setShowSuccess({
                show: true,
                hash: receipt.hash
            });
            dispatch(withdrewPayments());
        }catch(error){
            if(error.data){
                setError({error: true, message: error.data.message});
            } else if(error.message){
                setError({error: true, message: error.message});
            } else {
                console.log(error);
                setError({error: true, message: "Unknown Error"});
            }
        }finally{
            setDoingWork(false);
        }
    }

    const registerCode = async () => {
        try{
            setDoingWork(true);
            const id = nanoid(10);
            const encoded = ethers.utils.formatBytes32String(id)
            const tx = await user.membershipContract.register(encoded);
            const receipt = await tx.wait();
            setShowSuccess({
                show: true,
                hash: receipt.hash
            });
            dispatch(registeredCode(id));
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
            setDoingWork(false);
        }
    }

    /// TRANSFER------------------

    const transferNft = async () => {
        try{
            closeTransfer();
            setDoingWork(true);
            let tx;
            if(selectedNft.multiToken){
                tx = await selectedNft.contract.safeTransferFrom(user.address, transferAddress, selectedNft.id, 1, []);
            } else {
                tx = await selectedNft.contract.safeTransferFrom(user.address, transferAddress, selectedNft.id);
            }
            const receipt = await tx.wait(); 
            setShowSuccess({
                show: true,
                hash: receipt.hash
            });
            dispatch(transferedNFT(selectedNft));
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
            setDoingWork(false);
        }
    }

    const showTransferDialog = (nft) => () => {
        setSelectedNft(nft);
        setAskTransfer(true);
    }

    const closeTransfer = () =>{
        setAskTransfer(false);
    }

    /// END TRANSFER-=------------

    ////--- SALE -------- >>

    const [salePrice, setSalePrice] = useState(null);
    const listingSteps = [
        {
          label: 'Approve Transfer',
          description: `Ebisu's Bay needs approval to transfer your NFT on your behalf.`,
        },
        {
            label : 'Enter Price',
            description : 'Enter the listing price in CRO. There is a 0% transaction fee on completed sale!'
        },
        {
          label: 'Confirm Listing',
          description: 'Sign transaction to complete listing.',
        },

    ];
    const [showMemberOnly, setShowMemberOnly] = useState(false);
    const [startSale, setStartSale] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [nextEnabled, setNextEnabled] = useState(false);

    const showListDialog = (nft) => async () => {
        try{
            setSelectedNft(nft);
            setStartSale(true);
            const transferEnabled = await nft.contract.isApprovedForAll(user.address, user.marketContract.address);
            if(transferEnabled){
                setActiveStep(1);
            } else {
                setNextEnabled(true);  
            }
        }catch(error){
            if(error.data){
                setError(error.data.message);
            } else if(error.message){
                setError(error.message)
            } else {
                console.log(error);
                setError("Unknown Error")
            }
            setStartSale(false);
            setSelectedNft(null);
            setActiveStep(0);
        } 
        // finally {
            // setStartSale(false);
            // setSelectedNft(null);
            // setActiveStep(0);
        // }

    }

    const setApprovalForAll = async() => {
        try{
            let tx = await selectedNft.contract.setApprovalForAll(user.marketContract.address, true);
            await tx.wait();
            setNextEnabled(false);
            setActiveStep(1);
        }catch(error){
            if(error.data){
                setError(error.data.message);
            } else if(error.message){
                setError(error.message)
            } else {
                console.log(error);
                setError("Unknown Error")
            }
            setStartSale(false);
            setSelectedNft(null);
            setActiveStep(0);
        }
    }

    const makeListing = async () => {
        try{
            setNextEnabled(false);
            setDoingWork(true);
            const price = ethers.utils.parseEther(salePrice);
            let tx = await user.marketContract.makeListing(selectedNft.contract.address, selectedNft.id, price);
            let receipt = await tx.wait();
            dispatch(updateListed(selectedNft.contract.address, selectedNft.id, true));
            setShowSuccess({
                show: true,
                hash: receipt.hash
            })
        }catch(error){
            if(error.data){
                setError(error.data.message);
            } else if(error.message){
                setError(error.message)
            } else {
                console.log(error);
                setError("Unknown Error")
            }
        } finally{
            setDoingWork(false);
            setStartSale(false);
            setSelectedNft(null);
            setActiveStep(0);
        }
    }

    useEffect(() => {
        if(salePrice && salePrice.length > 0 && salePrice[0] != '0'){
            setNextEnabled(true);
        } else {
            setNextEnabled(false);
        }
    }, [salePrice])
    

    const cancelList = () =>{
        setStartSale(false);
        setActiveStep(0);
        setNextEnabled(false);
    }

    const cancelMemberOnly = () => {
        setShowMemberOnly(false);
    }

    const handleNext = () => {
        if(activeStep === 0){
           setApprovalForAll();
        } else if(activeStep === 1){
            setActiveStep(2);
        } else if(activeStep === 2){
            makeListing();
        }
    };

    const showCancelDialog = (nft) => async () => {
        try{
            setDoingWork(true);
            let tx = await user.marketContract.cancelListing(nft.listingId);
            let receipt = await tx.wait();
            dispatch(updateListed(nft.contract.address, nft.id, false));
            setShowSuccess({
                show: true,
                hash: receipt.hash
            });
        }catch(error){
            if(error.data){
                setError({error: true, message: error.data.message});
            } else if(error.message){
                setError({error: true, message: error.message});
            } else {
                console.log(error);
                setError({error: true, message: "Unknown Error"});
            }
        }finally{
            setDoingWork(false);
        }
        
    }

    //// END SALE 
    const [showCopied, setShowCopied] = useState(false);
    const copyClosed = () => {
        setShowCopied(false);
    }
    const copyLink = (nft) => () =>{
        navigator.clipboard.writeText(window.location.origin + '/listing/' + nft.listingId)
        setShowCopied(true);
    }

    return(
        <Container maxWidth="lg" mt={3}>
            {(user.address)? 
            <Box mb={16} mt={4}>
                <Collapse in={alertOpen}>
                <Alert
                action={
                    <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setAlertOpen(false);
                    }}
                    >
                    <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{ mb: 2 }}
                >
                Fear Not! Your NFTs from other collections will be visible here when the Block Explorer is stable. In the meantime contact us with the smart contract of your missing NFT and we will add support!
                </Alert>
            </Collapse>

            {/*<Box>

            <Stack spacing={2} direction='row'>
                        <Stack  >
                            <Typography variant='subtitle1'>
                                Account Balance: {user.marketBalance} CRO
                            </Typography>
                            {(user.marketBalance === '0.0') ?
                                    null :
                                    <Button onClick={withdrawBalance}>
                                        Withdraw
                                    </Button>
                            }
            
                        </Stack>
            {(user.isMember) ? 
                        <Box >
                        {(user.code && user.code.length > 0)?
                            <Container>
                                <Typography variant='subtitle1'>
                                    Referral Code: {user.code}
                                </Typography>
                                <Stack spacing={2} direction='row'>
                                    <Typography variant='subtitle1'>
                                        Referral Rewards: {user.rewards} CRO
                                    </Typography>
                                    {(user.rewards === '0.0') ?
                                         null :
                                         <Button onClick={withdrawPayments}>
                                             Withdraw
                                         </Button>
                                    }
                    
                                </Stack>
                            </Container> : 
        
                            <Container>
                                <Typography variant='subtitle1'>
                                    No Referral Code Found. 
                                </Typography>
                                <Button onClick={registerCode}>
                                    Register
                                </Button>
                            </Container>
        
                        }
                    </Box> 
                    : null
            }
            </Stack>
        </Box>*/}

            
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                {user.nfts.map((val, j) => 
                    <Grid item xs={12} xl={3} lg={3} md={4} sm={6}  key={j}>
                        <Card>
                            <CardMedia  component='img' image={val.image} height='285' sx={{}} />

                            <Box sx={{ p: 2, height : 150}}>
                                <Typography  noWrap variant="h5" color='primary'>
                                    {val.name}
                                </Typography>
                                {(val.count) ?
                                  <Typography variant='subtitle' paragraph>
                                        Count: {val.count}
                                   </Typography>  
                                    : null  
                                } 
                                <Typography variant='subtitle2' paragraph>
                                    {val.description}
                                </Typography>
                            </Box>
                            <CardActions>
                                <Button onClick={showTransferDialog(val)}>Transfer</Button>
                                { (!val.listed) ?
                                    <Button onClick={showListDialog(val)} disabled={!val.listable}>Sell</Button> :
                                        (val.listingId) ? 
                                            <Stack direction='row'>
                                                <Button onClick={showCancelDialog(val)}>Cancel</Button> 
                                                <IconButton color='primary' onClick={copyLink(val)}>
                                                    <LinkIcon/>
                                                </IconButton>
                                            </Stack>
                                        : null
                                }
                            </CardActions>
                        </Card>
                    </Grid>
                )}
            </Grid> 
            </Box>
                : 
                <Redirect to='/'/>
            }
            {(selectedNft) ? 
                <Dialog
                onClose={closeTransfer}
                fullScreen={fullScreen}
                open={askTransfer}>
                    <DialogContent>
                        <DialogTitle>
                            Start Transfer
                        </DialogTitle>
                        <Grid container spacing={{sm : 4}} columns={fullScreen ? 1 : 2}>
                            <Grid item xs={2} md={1} key='1'>
                                <Container>
                                    <CardMedia component='img' src={selectedNft.image} width='150' />
                                </Container>
                            </Grid>
                            <Grid item xs={1} key='2' >
                                <TextField label="Address" variant="outlined" onChange={ (e) => {
                                    setTransferAddress(e.target.value);
                                }}/>
                            </Grid>
                        </Grid>

                        <DialogActions>
                            <Button onClick={closeTransfer}>Cancel</Button>
                            <Button onClick={transferNft}>OK</Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            : null}

            {(selectedNft) ? 
                <Dialog 
                    fullScreen={fullScreen}
                    onClose={cancelList}
                    open={startSale}>
                    <DialogContent>
                        <DialogTitle>List {selectedNft.name}</DialogTitle>
                        <Grid container spacing={{sm : 4}} columns={fullScreen ? 1 : 2}>
                            <Grid item xs={2} md={1} key='1'>
                                <Container>
                                    <CardMedia component='img' src={selectedNft.image} width='150' />
                                </Container>
                            </Grid>
                            <Grid item xs={1} key='2' >
                                <Stepper activeStep={activeStep} orientation="vertical">
                                {listingSteps.map((step, index) => (
                                    <Step key={step.label}>
                                        <StepLabel
                                        optional={
                                            index === 2 ? (
                                            <Typography variant="caption">Last step</Typography>
                                            ) : null
                                        }
                                        >
                                        {step.label}
                                        </StepLabel>
                                        <StepContent>
                                        <Typography>{step.description}</Typography>
                                        {(index === 1) ?  
                                            <TextField type='number' label="Price" variant="outlined" onChange={ (e) => {
                                                setSalePrice(e.target.value);
                                            }}/>   : null 
                                        }
                                        <Box sx={{ mb: 2 }}>
                                            <div>
                                            <LoadingButton
                                                variant="contained"
                                                loading={!nextEnabled && index !==1 }
                                                disabled={!nextEnabled}
                                                onClick={handleNext}
                                                sx={{ mt: 1, mr: 1 }}
                                            >
                                                {index === listingSteps.length - 1 ? 'Finish' : 'Continue'}
                                            </LoadingButton>
                                            {/* <Button
                                                disabled={index === 0}
                                                onClick={handleBack}
                                                sx={{ mt: 1, mr: 1 }}
                                            >
                                                Back
                                            </Button> */}
                                            </div>
                                        </Box>
                                        </StepContent>
                                    </Step>
                                    ))}
                                </Stepper>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            : null}

        <Snackbar open={showCopied} autoHideDuration={6000} onClose={copyClosed}>
            <Alert onClose={copyClosed} severity="success" sx={{ width: '100%' }}>
                Link Copied!
            </Alert>
        </Snackbar>

            <Dialog
                open={user.fetchingNfts || doingWork}>
                <DialogContent>
                    <Stack spacing={2} direction='row'>
                        <CircularProgress/>
                        <Typography variant='h3'>
                            {progressText}
                        </Typography>
                    </Stack>
                </DialogContent>
            </Dialog>

            <Snackbar  
            open={error.error} 
            autoHideDuration={10000} 
            onClose={closeError}
            sx={{ top: "85%" }}>
            <Alert onClose={closeError} severity="error" sx={{ width: '100%' }}>
                {`Error whilst processing transaction:\n ${error.message}`}
            </Alert>
        </Snackbar>
        <Snackbar  
            open={showSuccess.show} 
            autoHideDuration={10000} 
            onClose={closeSuccess}>
            <Alert onClose={closeSuccess} severity="error" sx={{ width: '100%' }}>
                Transaction was successful!
            </Alert>
        </Snackbar>

            <Dialog open={showMemberOnly} onClose={cancelMemberOnly}>
                <DialogContent>
                    <Typography variant='h6'>Beta features are for members only.</Typography>
                </DialogContent>
                <DialogActions>
                        <Button onClick={cancelMemberOnly}>Close</Button>
                    </DialogActions>
            </Dialog>

        </Container>
    )
} 

