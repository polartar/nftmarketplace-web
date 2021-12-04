import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import banner from '../../Assets/drops/elonsadventures/elonsadventures.gif'
import {Typography, Link, Container, Button} from '@mui/material'
import { 
  Box,
  Dialog,
  DialogContent,
  Stack,
  CircularProgress,
  Snackbar,
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

  useEffect(() => {
    countdownRef.current.start();
  },[]);

  useLayoutEffect(() => {
    (async () => {
      const response = await fetch("https://us-central1-ebisusbay.cloudfunctions.net/dropLive");
      const data = await response.json();
      setStartTime(data.liveAt);
      setIsLive(data.isLive);
    })();
  }, []);

  const [isLive, setIsLive] = useState(false);
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



  const mintNow = async() => {
    if(user.address){
      setMinting(true);
      const contract = user.elonContract;
      try{
        const cost = ethers.utils.parseEther("500");
        const extra = {
          'value' : cost
        };
        const response = await contract.safeMint(extra);
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
            <Button variant="outlined" onClick={mintNow} disabled>
              SOLD OUT
            </Button>
          </Box> 
         </Container>
      }


      <Box mt={3}>
        <Typography component='p' variant='subtitle1' mb={3}>
          We invite you to take part in Elon's Adventures. He is viral, he is global, he is interstellar.
        </Typography>

        <Typography component='span' variant='subtitle1' mr={1}>
          We are offering 20 one of a kind unique adventures. Each hand drawn by the very talented and beautiful
        </Typography>
        <Link href="https://www.instagram.com/im_barbara_redekop/" variant='subtitle1' target="_blank" rel="noreferrer">
         Barbara Redekop.
        </Link>

        <Box>
        <Typography component='p' variant='caption' mt={3}>
            Founding members will have the chance to mint one random adventure at the presale price of 500 CRO. After 48 hours the drop will open to the general public for 800 CRO.
          </Typography>
        </Box>
          
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