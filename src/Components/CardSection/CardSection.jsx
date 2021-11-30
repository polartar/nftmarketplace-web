import React, {useState, useEffect} from 'react'
import MyCard from '../Card/Card'
import {useSelector, useDispatch} from 'react-redux'
import './cardSec.css'

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
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme } from '@mui/material/styles';
import { getAnalytics, logEvent } from '@firebase/analytics'

import { fetchMemberInfo, fetchVipInfo, memberships } from '../../GlobalState/Memberships'
import {fetchCronieInfo} from '../../GlobalState/Cronies'
import { connectAccount, chainConnect } from '../../GlobalState/User'
import MetaMaskOnboarding from '@metamask/onboarding';

import { ethers } from 'ethers'
import { useHistory } from 'react-router'

const CardSection = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const cardSelector = useSelector((state)=>{
        return state.initState.nftCard
    })

    const founders = useSelector((state) => {
        return state.memberships.founders
    })

    const vips = useSelector((state) => {
        return state.memberships.vips
    });

    const cronies = useSelector((state) => {
        return state.cronies
    });

    const user = useSelector((state) => {
        return state.user;
    });

    const gettingContractData = useSelector((state) => {
        return state.user.gettingContractData;
    })

    const [minting, setMinting] = useState(false);
    const closeMinting = () => {
        setMinting(false);
    };
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

    const [numToMint, setNumToMint] = useState(1);
    const [referral, setRefferal] = useState("");

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = React.useState(false)
    const [selectedItem, setSelectedItem] = useState({})
    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOpen = (event) => {
        setOpen(true)
        let selection;
        if(event.id === 0){
            selection = cronies;
        } else if(event.id === 1){
            selection = founders;
        } else{
            selection = vips;
        }
        setSelectedItem({
            ...event,
            ...selection
        })
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : event.title
        })
    }

   useEffect(() => {
        if(!gettingContractData && !cronies.fetching && !founders.fetching && minting){
            // let selection;
            // const id = selectedItem.id;
            // if(id === 0){
            //     selection = cronies;
            // } else{
            //     selection = founders;
            // }
            // setSelectedItem({
            //     ...selectedItem,
            //     ...selection
            // })
            // mintNow();
            
            //some reason price isn't set on foundres by above, quick dirty fix just close the dialog :(
            setOpen(false);
            setMinting(false);
        }
   }, [gettingContractData, cronies, founders])

    useEffect(() => {
        dispatch(fetchMemberInfo());
        dispatch(fetchVipInfo());
        dispatch(fetchCronieInfo());
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const mintNow = async() => {
        if(gettingContractData || cronies.fetching || founders.fetching){
            setMinting(true);
            return;
        }
        if(user.address && user.membershipContract){
            const price = ethers.utils.parseEther(selectedItem.price);
            const discount = ethers.utils.parseEther(selectedItem.discount);
            let finalPrice;
            if(referral && selectedItem.id !== 0){
                // console.log("adding discount");
                finalPrice = price.mul(numToMint).sub(discount.mul(numToMint));
            } else {
                finalPrice = price.mul(numToMint);
            }

            const ref32 = ethers.utils.formatBytes32String(referral);
            console.log('ref ' + ref32);
            const extra = {
                'value': finalPrice,
            }
            handleClose();
            if(selectedItem.id === 0){
                setMinting(true);
                try{
                    const gas = String(900015 * numToMint);
                    const resposne = await user.croniesContract.mint(numToMint, {...extra, 'gasPrice' : ethers.utils.parseUnits("5000", "gwei"), 'gasLimit' : gas});
                    const receipt = await resposne.wait();
                    setShowSuccess({
                        show: true,
                        hash: receipt.hash
                    })
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
                    setMinting(false);
                }
            } else{
                //member
                setMinting(true);
                try{
                    const response = await user.membershipContract.mint(selectedItem.id, numToMint, ref32, extra);
                    const receipt = await response.wait();
                    setShowSuccess({
                        show : true,
                        hash : receipt.hash
                    })
                } catch(error){
                    if(error.data){
                        setError({error: true, message: error.data.message});
                    } else if(error.message){
                        setError({error: true, message: error.message});
                    } else {
                        console.log(error);
                        setError({error: true, message: "Unknown Error"});
                    }
                } finally {
                    setMinting(false);
                }

            }
        } else {
            if(user.needsOnboard){
                const onboarding = new MetaMaskOnboarding();
                onboarding.startOnboarding();
            } else if(!user.address){
                dispatch(connectAccount());
            } else if(!user.correctChain){
                dispatch(chainConnect());
            }
        }
    };

    return (
        <Container>
            <div className='cardSectContainer'>
                <MyCard data={cardSelector} dots value handleActionArea={handleClickOpen} handleBuyNow={handleClickOpen}/>
            </div>
            <Dialog
             open={open}
             onClose={handleClose}
             className='mintDialog'
             maxWidth='lg'>
                 <DialogContent dividers={true}>
                    <Grid container spacing={{sm : 4}} columns={fullScreen ? 1 : 2}>
                        <Grid item xs={2} md={1} key='1'>
                            <Container>
                                <CardMedia component='img' src={selectedItem.img} width='350' />
                            </Container>
                        </Grid>
                        <Grid item xs={1} key='2' >
                        <Stack spacing={2} direction='column' alignItems='flex-start'>
                            <Stack spacing={2} direction='row' alignItems='baseline'>
                                <Typography  variant="h5" color='primary' component="p">
                                    {selectedItem.title}
                                </Typography>
                                {(selectedItem.id === 2) ? null :
                                    <Typography variant='subtitle2' component='p'>
                                        {selectedItem.price} CRO
                                    </Typography>
                                }
                            </Stack>

                            {(selectedItem.id === 2) ? null :
                                <Typography  variant="subtitle1" color='primary' component="p">
                                        {selectedItem.count} / {selectedItem.max}
                                </Typography>
                            }

                            <Typography variant='subtitle1' component='p'>
                                {selectedItem.p1}
                            </Typography>
                            <Typography variant='subtitle1' component='p'>
                                {selectedItem.p2}
                            </Typography>
                            {(selectedItem.id === 2) ? null :
                              <Typography variant='subtitle2' component='p'>
                                   Minting {numToMint}
                                </Typography>
                            }

                            {(selectedItem.id === 2) ? null :
                                <Slider defaultValue={1} step={1} marks min={1} max={parseInt(selectedItem.maxMint)} onChange={ (e, val) =>
                                    setNumToMint(val)
                                }/>
                            }

                            {selectedItem.id !== 1 ? null :
                              <TextField label="Referral Code" variant="outlined" onChange={ (e) =>{
                                console.log('setting refferal ' + e.target.value);
                                setRefferal(e.target.value);
                              }} />
                            }

                        </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    {
                        (selectedItem.id === 2) ? <Button onClick={() => history.push(`/seller/0x0800833a3706db6fBbD846d5d1b9370a79Af8097`)}>View Collection</Button>
                         :<Button  onClick={mintNow}>Mint</Button>
                    }
                </DialogActions>
            </Dialog>
            <Dialog
                open={minting}>
                <DialogContent>
                    <Stack spacing={2} direction='row'>
                        <CircularProgress/>
                        <Typography variant='h3'>
                            {(gettingContractData) ? "Fetching Contract..." :  "Minting..."}
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
            <Alert onClose={closeSuccess} severity="success" sx={{ width: '100%' }}>
                Transaction was successful!
            </Alert>
        </Snackbar>

        </Container>

    )
}

export default CardSection
