import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import banner from '../../Assets/drops/eb_drop.gif'
import ebisu from '../../Assets/Ebisu.gif'
import {Typography, Link, Container, Button, CardMedia} from '@mui/material'
import config from '../../Assets/networks/rpc_config.json'
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



export default function Drop({
  dropId,
}){
  const readProvider = new ethers.providers.JsonRpcProvider(config.read_rpc);
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

  const user = useSelector((state) => {
    return state.user;
  });

  const drop = useSelector((state)=>{
    return state.initState.nftCard[dropId];
  });

  const [dropObject, setDropObject] = useState(null);

  useEffect(async() => {
    let currentDrop = drop;
    if (user.provider) {
      try {
        let writeContract = await new ethers.Contract(currentDrop.address, currentDrop.abi, user.provider.getSigner());
        currentDrop = Object.assign({writeContract: writeContract}, currentDrop);
      } catch(error) {
        console.log(error);
      }
    }
    try {
      let readContract = await new ethers.Contract(currentDrop.address, currentDrop.abi, readProvider);
      currentDrop = Object.assign({currentSupply: (await readContract.totalSupply()).toString()}, currentDrop);
    } catch(error) {
      console.log(error);
    }
    console.log(currentDrop);
    setDropObject(currentDrop);
  }, [user]);

  const [isLive, setIsLive] = useState(true);
  const [startTime, setStartTime] = useState(1638565200000);

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
      const contract = dropObject.writeContract;
      try{
        const memberCost = ethers.utils.parseEther(dropObject.memberCost);
        const regCost = ethers.utils.parseEther(dropObject.cost);
        let cost;
        if(user.isMember){
            cost = memberCost;
        } else {
          cost = regCost;
        }
        cost = cost.mul(numToMint);
        let method;
        for (const abiMethod of dropObject.abi) {
          if (abiMethod.includes("mint")) method = abiMethod;
        }
        const extra = {
          'value' : cost
        };
        var response;
        if (method.includes("address") && method.includes("uint256")) {
          response = await contract.mint(user.address, numToMint);
        } else {
          response = await contract.mint(numToMint, extra);
        }
        const receipt = await response.wait();
      }catch(error){
        if(error.data){
          console.log(error);
          setError({error: true, message: error.data.message});
      } else if(error.message){
        console.log(error);
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

  const convertTime = (time) => {
    let date = new Date(time * 1000);
    const fullDateString = date.toLocaleString('default', {timeZone: 'UTC'});
    const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
    let dateString = `${fullDateString.split(", ")[1]} ${date.getUTCDate()} ${month} ${date.getUTCFullYear()} UTC`
    return dateString
  }


  return(
    <Box className='container'>
      {(dropObject) ?
      <>
      <img src={dropObject.wideBanner} className='banner'></img>
        { !isLive ?
         <Container>
            <Typography className='countdowndesc'>
              SALE BEGINS
            </Typography>
            <Typography className='countdown'>
              <Countdown date={dropObject.start} ref={countdownRef} />
            </Typography>
            <Typography className='time'>
              {convertTime(dropObject.start)}
            </Typography>
         </Container> :
         <Container className='container'>

            <CardMedia component='img' src={dropObject.nftImage} className='nftImage'/>
            <Box mt={3}>
            {/*<Typography component="p" variant="subtitle1">{numToMint}</Typography>*/}
            <Slider defaultValue={1} step={1} marks min={1} max={dropObject.maxMintPerTx} onChange={ (e, val) =>
                                    setNumToMint(val)
                                }/>
            <Button variant="outlined" onClick={mintNow} >
              MINT {numToMint}
            </Button>
            <Box sx={{ margin: "15px"}}>
            <Typography class='details'>
            {dropObject.currentSupply}/{dropObject.totalSupply} minted! {isNaN(dropObject.totalSupply - dropObject.currentSupply)? null
            :
              <>
               (<span className='bold'>{dropObject.totalSupply - dropObject.currentSupply}</span> left)
              </>
            }
            </Typography>
            </Box>
          </Box>
         </Container>
      }


      <Box mt={3}>

        {/* <img src={ebisu} maxWidth='350'/> */}


        <Typography component='p' variant='subtitle1' mb={3}>
          {dropObject.description}
        </Typography>

        <Typography component='span' variant='subtitle1' mr={1}>
        Brought to you by
        </Typography>
        <Link href={dropObject.author.link} variant='subtitle1' target="_blank" rel="noreferrer">
         {dropObject.author.name}.
        </Link>

        <Box>
          {dropObject.cost != dropObject.memberCost ?
          <>
          <Typography component='p' mt={3} className='details'>
            Standard Price: <span className='bold'>{dropObject.cost} CRO </span>
          </Typography>
          <Typography component='p' mt={3} className='details'>
          Founding Member Price: <span className='bold'>{dropObject.memberCost} CRO </span>
          </Typography>
          </>
          :
          <Typography component='p' mt={3} className='details'>
            Price: <span className='bold'>{dropObject.cost} CRO </span>
          </Typography>
          }
          {dropObject.end ?
            <Typography component='p' mt={3} className='details'>
              Minting Ends: <span className='bold'>{convertTime(dropObject.end)}</span>
            </Typography>
          : null
          }
        </Box>
      </Box>
      </>
      : null
      }
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