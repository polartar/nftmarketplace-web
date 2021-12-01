import React, { useEffect, useRef } from 'react'
import banner from '../../Assets/drops/elonsadventures/elonsadventures.gif'
import {Typography, Button} from '@mui/material'
import { Box } from '@mui/system';
import "./drop.css"
import Countdown from 'react-countdown';


const Drop = () => {
  const countdownRef = useRef();

  useEffect(() => {
    countdownRef.current.start();
  });

  return(
    <Box className='container'>
      <img src={banner} className='banner'></img>
      <Typography className='countdowndesc'>
        TIME UNTIL DROP
      </Typography>
      <Typography className='countdown'>
        <Countdown date={1638565200000} ref={countdownRef} />
      </Typography>
      <Typography className='time'>
        FRIDAY 3 DECEMBER 21:00 UTC
      </Typography>
      <Button className='mintButton'>
        MINT
      </Button>
    </Box>
  )
};

export default Drop;