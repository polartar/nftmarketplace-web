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
        return state.user.cronies;
    });

    const founderCount = useSelector((state) => {
        return state.user.founderCount;
    })

    const vipCount = useSelector((state) => {
        return state.user.vipCount;
    })

    const [memberships, setMemberArray] = useState([]);
    const [vips, setVipArray] = useState([]);

    const [totalMemberships, setMemberships] = useState(0)

    useEffect(() => {
        dispatch(fetchNfts(user))
    }, []);

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'my_nfts'
        })
    }, []);

    useEffect(() => {
        setMemberArray(Array.from({length:founderCount}, (v, i) => i))
        setVipArray(Array.from({length:vipCount}, (v, i) => i))
        setMemberships(vipCount + founderCount);
    },[vipCount, founderCount])

    

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

                {
                    vips.map((_,j) => {
                        return(
                            < Grid item xs={12} xl={4} lg={4} md={4} sm={6}  key={j}>
                                <Card>
                                    <CardMedia component='img' src={vip_member} />
                                    <Typography variant='subtitle1'>
                                        VIP Member
                                    </Typography>
                                </Card>
                            </Grid>
                        )
                    })
                }
                
                {
                    memberships.map((_,j) => {
                        return(
                        < Grid item xs={12} xl={4} lg={4} md={4} sm={6}  key={j + vipCount}>
                            <Card>
                                <CardMedia component='img' src={member} />
                                <Typography variant='subtitle1'>
                                    Founding Member
                                </Typography>
                            </Card>
                        </Grid>
                    )
                    })
                }

                
                {nfts.map((val, j) => 
                    <Grid item xs={12} xl={4} lg={4} md={4} sm={6}  key={j + totalMemberships}>
                        <Card>
                            <CardMedia component='img' src={URL.createObjectURL(val.image)} />
                            <Typography variant='subtitle1'>
                                {val.name}
                            </Typography>
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