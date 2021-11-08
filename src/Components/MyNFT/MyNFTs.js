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

} from '@mui/material'
import vip_member from '../../Assets/vip_member.webp'
import member from '../../Assets/founding_member.webp'
import { getAnalytics, logEvent } from '@firebase/analytics'
import { fetchNfts } from '../../GlobalState/User';
import { Box } from '@mui/system';

export const MyNFTs = () => {
    const dispatch = useDispatch();
    const [alertOpen, setAlertOpen] = useState(true);
    const user = useSelector((state) => {
        return state.user;
    });
    const nfts = useSelector((state) => {
        // const cronies = state.user.cronies;
        // const founderCount = state.user.founderCount;
        // const vipCount = state.user.vipCount;
        // const cImages = cronies.map((v,j) => {
        //     return v.image
        // });
        // let ret = [];
        // for(let i = 0; i < founderCount; i++){
        //     ret.push(member)
        // }
        // for(let i = 0; i < vipCount; i++){
        //     ret.push(vip_member);
        // }
        // ret += cImages;
        // return ret;
        return state.user.cronies;
    });

    useEffect(() => {
        dispatch(fetchNfts(user))
    }, []);

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'my_nfts'
        })
    }, []);

    console.log(nfts);
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
                {console.log(nfts)}
                {nfts.map((val, j) => 
                    <Grid item xs={12} xl={4} lg={4} md={4} sm={6}  key={j}>
                        <Card>
                            <CardMedia component='img' src={URL.createObjectURL(val.image)} />
                        </Card>
                    </Grid>
                )}
            </Grid> 
            </Box>
                : 
                <Redirect to='/'/>
            }


        </Container>
    )
} 