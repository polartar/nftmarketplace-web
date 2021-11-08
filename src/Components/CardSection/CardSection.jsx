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
    CircularProgress
} from '@mui/material'

import { useTheme } from '@mui/material/styles';
import { getAnalytics, logEvent } from '@firebase/analytics'

import { fetchMemberInfo, fetchVipInfo } from '../../GlobalState/Memberships'
import {fetchCronieInfo} from '../../GlobalState/Cronies'
import { connectAccount, chainConnect } from '../../GlobalState/User'
import MetaMaskOnboarding from '@metamask/onboarding';

import { ethers } from 'ethers'

const CardSection = () => {
    const dispatch = useDispatch();
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

    const [minting, setMinting] = useState(false);
    const closeMinting = () => {
        setMinting(false);
    };
    const [mintError, setMintError] = useState(null);
    const closeError = () => {
        setMintError(null);
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

    const [numToMint, setNumToMint] = useState(1);
    const [referral, setRefferal] = useState("");

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = React.useState(false)
    let [selectedItem, setSelectedItem] = useState({})
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
        dispatch(fetchMemberInfo());
        dispatch(fetchVipInfo());
        dispatch(fetchCronieInfo());
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const mintNow = async() => {
        if(user.address && user.membershipContract){
            // console.log("parsing: " + selectedItem.price);
            // console.log("parsing " + selectedItem.discount);
            const price = ethers.utils.parseEther(selectedItem.price);
            const discount = ethers.utils.parseEther(selectedItem.discount);
            let finalPrice;
            if(referral && selectedItem.id !== 0){
                // console.log("adding discount");
                finalPrice = price.mul(numToMint).sub(discount.mul(numToMint));
            } else {
                finalPrice = price.mul(numToMint);
            }
            const gasLimit = ethers.BigNumber.from(3000000).mul(numToMint); 
            // console.log(referral);
            const ref32 = ethers.utils.formatBytes32String(referral);
            // console.log(price);
            // console.log(discount);
            // console.log(finalPrice);
            // console.log("final price: " + ethers.utils.formatEther(finalPrice));
            console.log('ref ' + ref32);
            const extra = {
                'value': finalPrice,
            }
            handleClose();
            if(selectedItem.id === 0){
                setMinting(true);
                try{
                    const resposne = await user.croniesContract.mint(numToMint, extra);
                    const receipt = await resposne.wait();
                    setShowSuccess({
                        show: true,
                        hash: receipt.hash
                    })
                }catch(error){
                    setMintError(error);
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
                    setMintError(error);
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
             fullScreen={fullScreen}
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
        
                                <Typography variant='subtitle2' component='p'>
                                    {selectedItem.price} CRO
                                </Typography>
                            </Stack>
                            <Typography variant='subtitle1' component='p'>
                                {selectedItem.p1}
                            </Typography>
                            <Typography variant='subtitle1' component='p'>
                                {selectedItem.p2}
                            </Typography>
                            <Typography variant='subtitle2' component='p'>
                                    Minting {numToMint}
                            </Typography>
                            <Slider defaultValue={1} step={1} marks min={1} max={parseInt(selectedItem.maxMint)} onChange={ (e, val) =>
                                setNumToMint(val)
                            }/>

                            {selectedItem.id === 0 ? null :
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
                    <Button onClick={mintNow}>Mint</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={minting}>
                <DialogContent>
                    <Stack spacing={2} direction='row'>
                        <CircularProgress/>
                        <Typography variant='h3'>
                            Minting...
                        </Typography>
                    </Stack>
                </DialogContent>
            </Dialog>
            <Dialog 
                onClose={closeSuccess}
                open={showSuccess.show}>
                <DialogContent>
                    <Typography variant='h3'>Success! 🥳 </Typography>
                    <Typography variant='subtitle2'>showSuccess.hash</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeSuccess}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog 
                open={mintError != null}
                onClose={closeError}>
                    <DialogContent>
                        <Typography variant='h3'>There was an issue 😵</Typography>
                        <Typography variant='subtitle2'>{
                            mintError? mintError.message : ""
                        }</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeError}>Close</Button>
                    </DialogActions>
            </Dialog>
                
        </Container>

    )
}

export default CardSection
