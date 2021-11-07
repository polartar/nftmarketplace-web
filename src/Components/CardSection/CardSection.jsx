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
    Slider
} from '@mui/material'

import { useTheme } from '@mui/material/styles';
import { getAnalytics, logEvent } from '@firebase/analytics'

import { fetchMemberInfo, fetchVipInfo } from '../../GlobalState/Memberships'


// import { Contract, ethers } from 'ethers'
// import rpc from '../../Assets/contracts/test_rpc.json'
// import Membership from '../../Assets/contracts/EbisusBayMembership.json'



// const userProvider = new ethers.providers.Web3Provider(window.ethereum);
// const writeMemberships = new Contract(rpc.membership_contract, Membership.abi, userProvider);

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
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
                            <Slider defaultValue={1} step={1} marks min={1} max={selectedItem.maxMint} />
                        </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>

    )
}

export default CardSection
