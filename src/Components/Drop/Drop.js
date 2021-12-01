import React, { useEffect, useRef } from 'react'
import banner from '../../Assets/drops/elonsadventures/elonsadventures.gif'
import {Typography, Link, Stack} from '@mui/material'
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
        FOUNDING MEMBER PRE-SALE BEGINS
      </Typography>
      <Typography className='countdown'>
        <Countdown date={1638565200000} ref={countdownRef} />
      </Typography>
      <Typography className='time'>
        FRIDAY 3 DECEMBER 21:00 UTC
      </Typography>

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

      {/* <Box mt={3}>
        <Button disabled variant="outlined" mt={3}>
          MINT
        </Button>
      </Box> */}

    </Box>
  )
};

export default Drop;