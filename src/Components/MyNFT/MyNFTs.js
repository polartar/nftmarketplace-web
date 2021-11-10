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

export const MyNFTs = () => {

    const dispatch = useDispatch();
    const theme = useTheme();

    const [alertOpen, setAlertOpen] = useState(false);
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

    const transferNft = async () => {
        try{
            closeTransfer();
            setDoingWork(true);
            let tx;
            if(selectedNft.multiToken){
                tx = await selectedNft.contract.safeTransferFrom(user.address, transferAddress, selectedNft.id, 1, "");
            } else {
                tx = await selectedNft.contract.safeTransferFrom(user.address, transferAddress, selectedNft.id);
            }
            const receipt = await tx.wait(); 
            setShowSuccess({
                show: true,
                hash: receipt.hash
            })
        }catch(error){
            console.log(error);
            setError(error);
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
                Fear Not! Your NFTs from other collections will be visible here when the Block Explorer is stable.
                </Alert>
            </Collapse>
            
            <Grid container spacing={1} justifyContent="center" alignItems="center">
                {user.nfts.map((val, j) => 
                    <Grid item xs={12} xl={4} lg={4} md={4} sm={6}  key={j}>
                        <Card>
                            <CardMedia component='img' src={val.image} />
                            <Typography  variant="h5" color='primary' component="p">
                                {val.name}
                            </Typography>   
                            <Typography variant='subtitle2' component='p'>
                                {val.description}
                            </Typography>
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
                            error? error.message : ""
                        }</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeError}>Close</Button>
                    </DialogActions>
            </Dialog>

        </Container>
    )
} 