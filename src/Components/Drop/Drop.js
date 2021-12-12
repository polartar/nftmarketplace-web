import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import banner from '../../Assets/drops/eb_drop.gif'
import ebisu from '../../Assets/Ebisu.gif'
import {Typography, Link, Container, Button, CardMedia} from '@mui/material'
import { 
  Box,
  Dialog,
  DialogContent,
  Stack,
  CircularProgress,
  Snackbar,
  Slider,
  Alert
} from '@mui/material';
import "./drop.css"
import Countdown from 'react-countdown';
import { connectAccount } from '../../GlobalState/User'

import {  ethers} from 'ethers'
import {useSelector, useDispatch} from 'react-redux'



const Drop = () => {
  const countdownRef = useRef();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   countdownRef.current.start();
  // },[]);

  // useLayoutEffect(() => {
  //   (async () => {
  //     const response = await fetch("https://us-central1-ebisusbay.cloudfunctions.net/dropLive");
  //     const data = await response.json();
  //     setStartTime(data.liveAt);
  //     setIsLive(data.isLive);
  //   })();
  // }, []);

  const [isLive, setIsLive] = useState(true);
  const [startTime, setStartTime] = useState(1638565200000);
  const user = useSelector((state) => {
    return state.user;
  });
  const [minting, setMinting] = useState(false);
  const closeMinting = () => {
      setMinting(false);
  };
  const [error, setError] = React.useState({
      error: false,
      message: ""
  });
  const [showSuccess, setShowSuccess] = useState({
    show : false,
    hash: ""
  });

  const closeError = () => {
    setError({error: false, message: error.message});
  };

  const closeSuccess = () => {
    setShowSuccess({
        show: false,
        hash: ""
    });
  }
  const [numToMint, setNumToMint] = useState(1);


  const mintNow = async() => {
    if(user.address){
      setMinting(true);
      const contract = user.ebisuContract;
      try{
        const memberCost = ethers.utils.parseEther("100");
        const regCost = ethers.utils.parseEther("150");
        let cost;
        if(user.isMember){
            cost = memberCost;
        } else {
          cost = regCost;
        }
        cost = cost.mul(numToMint);
        const extra = {
          'value' : cost
        };
        const response = await contract.safeMint(numToMint, extra);
        const receipt = await response.wait();
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
    } else {
      dispatch(connectAccount());
    }
  };

  return(

    <Box className='container'>
      <img src={banner} className='banner'></img>
      {
         !isLive ? 
         <Container>
            <Typography className='countdowndesc'>
              FOUNDING MEMBER PRE-SALE BEGINS
            </Typography>
            <Typography className='countdown'>
              <Countdown date={startTime} ref={countdownRef} />
            </Typography>
            <Typography className='time'>
              FRIDAY 3 DECEMBER 21:00 UTC
            </Typography>
         </Container> : 
         <Container>
            <Box mt={3}>

            <Slider defaultValue={1} step={1} marks min={1} max={10} onChange={ (e, val) =>
                                    setNumToMint(val)
                                }/>
            <Button variant="outlined" onClick={mintNow} >
              MINT
            </Button>
          </Box> 
         </Container>
      }


      <Box mt={3}>

        {/* <img src={ebisu} maxWidth='350'/> */}
        

        <Typography component='p' variant='subtitle1' mb={3}>
        Ebisu has many origins, all of which have lead to his current status as one of the Seven Lucky Gods.
Eternally grateful for the generosity and luck that had saved his life Ebisu is spreading joy and luck to all he encounters.


        </Typography>

        <Typography component='span' variant='subtitle1' mr={1}>
        May his blessing be upon you as a guiding light in your journeys on the Cronos Cain. Brought to you by 
        </Typography>
        <Link href="https://www.instagram.com/im_barbara_redekop/" variant='subtitle1' target="_blank" rel="noreferrer">
         Barbara Redekop.
        </Link>

        <Box>
        <Typography component='p' variant='caption' mt={3}>
            Minting will be open for 1 week for the price of 150 CRO, founding members pay 100 CRO.
          </Typography>
        </Box>
          
        <CardMedia component='img' src={ebisu} />
      </Box>

      <Dialog
                open={minting}>
                <DialogContent>
                    <Stack spacing={2} direction='row'>
                        <CircularProgress/>
                        <Typography variant='h3'>
                             "Minting..."
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

    </Box>
  )
};

export default Drop;