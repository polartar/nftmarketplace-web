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
    DialogTitle
} from '@mui/material'
import { useTheme } from '@mui/material/styles';

import { getAnalytics, logEvent } from '@firebase/analytics'
import { fetchNfts } from '../../GlobalState/User';
import { Box } from '@mui/system';
import { nanoid } from 'nanoid'
import { registeredCode, withdrewRewards, transferedNFT } from '../../GlobalState/User';
import {ethers} from 'ethers'
import './mynft.css'


export const MyNFTs = () => {

    const dispatch = useDispatch();
    const theme = useTheme();

    const [alertOpen, setAlertOpen] = useState(true);
    const [askTransfer, setAskTransfer] = useState(false);
    const [progressText, setProgressText] = useState('Working...');
    const [doingWork, setDoingWork] = useState(false);
    const [selectedNft, setSelectedNft] = useState(null);
    const [transferAddress, setTransferAddress] = useState(null);

    const user = useSelector((state) => {
        return state.user;
    });

    const [error, setError] = useState(null);
    const closeError = () => {
        setError(null);
    }
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

    const showTransferDialog = (nft) => () => {
        setSelectedNft(nft);
        setAskTransfer(true);
    }

    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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
            })
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

    const closeTransfer = () =>{
        setAskTransfer(false);
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

            {(user.isMember) ? 
                        <Box sx={{p : 2}}>
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
                    </Box> : null
            }

            
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                {user.nfts.map((val, j) => 
                    <Grid item xs={12} xl={3} lg={3} md={4} sm={6}  key={j}>
                        <Card>
                            <CardMedia  component='img' image={val.image} height='285' sx={{}} />

                            <Box sx={{ p: 2, height : 150}}>
                                <Typography  noWrap variant="h5" color='primary'>
                                    {val.name}
                                </Typography>   
                                <Typography variant='subtitle2' paragraph>
                                    {val.description}
                                </Typography>
                            </Box>
                            <CardActions>
                                <Button onClick={showTransferDialog(val)}>Transfer</Button>
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

        </Container>
    )
} 