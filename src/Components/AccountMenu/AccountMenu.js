import * as React from 'react';
import {
    Box,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Dialog,
    DialogContent,
    Stack,
    CircularProgress,
    Button,
    ListItemIcon,
    ListItemText,
    IconButton,
    Typography,
    Tooltip,
    Alert,
    Snackbar,
    Skeleton,
    Container,
} from '@mui/material';
import { useTheme } from '@mui/styles';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleIcon from '@mui/icons-material/People';
import Logout from '@mui/icons-material/Logout';
import Blockies from 'react-blockies';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from "react-router-dom";
import { registeredCode, withdrewRewards, withdrewPayments, onLogout } from '../../GlobalState/User';
import { nanoid } from 'nanoid'
import {ethers} from 'ethers'
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ColorModeContext } from "../../App";
import { connectAccount } from "../../GlobalState/User";
import MetaMaskOnboarding from '@metamask/onboarding';
import SettingsIcon from '@mui/icons-material/Settings';


import './accountmenu.css'
import '../../App.css'


export const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const [progressText] = React.useState('Working...');
  const [doingWork, setDoingWork] = React.useState(false);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const user = useSelector((state) => {
    return state.user;
  });

  const address = useSelector((state) => {
    try {
        return ethers.utils.getAddress(state.user.address);
    } catch {
        return null;
    }
});

const [showSuccess, setShowSuccess] = React.useState({
    show : false,
    hash: ""
});
    const [error, setError] = React.useState({
        error: false,
        message: ""
    });

    const closeError = () => {
        setError({error: false, message: error.message});
    };
    const closeSuccess = () => {
        setShowSuccess({
            show: false,
            hash: ""
        });
    };

  const withdrawRewards = async () => {
    try {
        setDoingWork(true);
        const tx = await user.membershipContract.withdrawPayments(user.address);
        const receipt = await tx.wait();
        setShowSuccess({
            show: true,
            hash: receipt.hash
        });
        dispatch(withdrewRewards());
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
        setDoingWork(false);
    }
}

const withdrawBalance = async() => {
    try{
        setDoingWork(true);
        const tx = await user.marketContract.withdrawPayments(user.address);
        const receipt = await tx.wait();
        setShowSuccess({
            show: true,
            hash: receipt.hash
        });
        dispatch(withdrewPayments());
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
        setDoingWork(false);
    }
}

const registerCode = async () => {
    try{
        setDoingWork(true);
        const id = nanoid(10);
        const encoded = ethers.utils.formatBytes32String(id)
        const tx = await user.membershipContract.register(encoded);
        const receipt = await tx.wait();
        setShowSuccess({
            show: true,
            hash: receipt.hash
        });
        dispatch(registeredCode(id));
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
        setDoingWork(false);
    }
}

const logout = async () => {
    await user.web3modal.clearCachedProvider();
    dispatch(onLogout());
    //window.location.reload();
}

const [showCopied, setShowCopied] = React.useState(false);
    const copyClosed = () => {
        setShowCopied(false);
    }
    const handleCopy = (code) => () =>{
        navigator.clipboard.writeText(code);
        console.log("Copied!");
        setShowCopied(true);
    }
    const needsOnboard = useSelector((state) => {
        return state.user.needsOnboard;
      });

const startConnect = () => {
    if(needsOnboard){
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
    } else{
        dispatch(connectAccount());
    }
};

  return (
    <React.Fragment>
      {(user.address)?
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="Account settings">
            <Button onClick={handleClick} className='accountMenuButton' color='primary' >
                    <Avatar sx={{ bgcolor: '#d32f2f' }} alt={user.address} sx={{ width: 30, height: 30, marginRight: "8px"}}>
                        <Blockies seed={user.address} size={10}/>
                    </Avatar>
                    <Typography>{`${address.substring(0, 2)}...${address.substring(address.length-3, address.length)}`}</Typography>
                    <KeyboardArrowDownIcon sx={{marginLeft: "5px"}}></KeyboardArrowDownIcon>
            </Button>
            </Tooltip>
        </Box>
      :
        <IconButton color='primary' aria-label="connect" onClick={handleClick} >
            <SettingsIcon/>
        </IconButton>
      }
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {(user.address)?
        <MenuItem className="accountMenu" sx={{ marginTop: "8px" }}>
            <ListItemIcon>
                <AccountBalanceWalletIcon sx={{fill: 'lightgreen'}} fontSize="medium" />
            </ListItemIcon>
            <ListItemText>{`${address.substring(0, 8)}...${address.substring(address.length-8, address.length)}`}</ListItemText>
        </MenuItem>
        :
        <>
        <MenuItem className="accountMenu" sx={{ marginTop: "8px", color: 'lightgreen' }} onClick={startConnect}>
            <ListItemIcon>
                <AccountBalanceWalletIcon sx={{fill: 'lightgreen'}} fontSize="medium" />
            </ListItemIcon>
            Connect Wallet
        </MenuItem>
        <Divider/>
        </>
        }
        {(user.address)?
        <>
        <Divider/>
        <MenuItem component={Link} to='/nfts' className="accountMenu" sx={{ marginTop: "8px" }}>
            <ListItemIcon>
                <InsertPhotoIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText>My NFTs</ListItemText>
        </MenuItem>
        <Divider/>
        {(user.marketBalance == "Loading...") ?
            <>
            <Container sx={{ margin: "15px 0px 7px 0px", fontWeight: "500"}}>
                <Skeleton variant="text" width={100} height={20} sx={{ display: "block"}}/>
                <MenuItem className="accountMenu">
                    <Skeleton variant="circular" width={25} height={25} sx={{ display: "block", marginRight: "10px"}}/>
                    <Skeleton variant="text" width={150} height={20} sx={{ display: "block"}}/>
                </MenuItem>
            </Container>
            <Divider/>
            </>
        :
            <Container sx={{ margin: "15px 0px 7px 0px", fontWeight: "500"}}>
                Marketplace Balance
                {(user.marketBalance > 0) ?
                    <MenuItem onClick={withdrawBalance} className="accountMenu" sx={{ marginTop: "5px"}}>
                        <ListItemIcon>
                            <AttachMoneyIcon fontSize="medium" />
                        </ListItemIcon>
                        <ListItemText>Withdraw {ethers.utils.commify(user.marketBalance)} CRO</ListItemText>
                    </MenuItem>
                :
                    <MenuItem onClick={withdrawBalance} className="accountMenu" sx={{ marginTop: "5px"}}>
                        <ListItemIcon>
                            <AttachMoneyIcon fontSize="medium" />
                        </ListItemIcon>
                        <ListItemText>Withdraw {ethers.utils.commify(user.marketBalance)} CRO</ListItemText>
                    </MenuItem>
                }
            </Container>
        }
        <Divider/>
        {(user.rewards == "Loading...") ?
            <Container sx={{ margin: "15px 0px 7px 0px", fontWeight: "500"}}>
                <Skeleton variant="text" width={100} height={20} sx={{ display: "block"}}/>
                <MenuItem className="accountMenu">
                    <Skeleton variant="circular" width={25} height={25} sx={{ display: "block", marginRight: "10px"}}/>
                    <Skeleton variant="text" width={150} height={20} sx={{ display: "block"}}/>
                </MenuItem>
                <MenuItem className="accountMenu">
                    <Skeleton variant="circular" width={25} height={25} sx={{ display: "block", marginRight: "10px"}}/>
                    <Skeleton variant="text" width={150} height={20} sx={{ display: "block"}}/>
                </MenuItem>
            </Container>
        :
            <>
            {(user.isMember) ?
            <Container sx={{ margin: "15px 0px 7px 0px", fontWeight: "500"}}>
                    Referrals
                    {(user.code && user.code.length > 0) ?
                        <>
                        <MenuItem onClick={handleCopy(user.code)} className="accountMenu" sx={{ marginTop: "5px"}}>
                            <ListItemIcon>
                                    <ContentCopyIcon fontSize="medium" />
                            </ListItemIcon>
                            <ListItemText>Copy Referral Code</ListItemText>
                        </MenuItem>
                        {(user.rewards === '0.0') ?
                            <MenuItem className="accountMenu" sx={{ marginTop: "5px"}}>
                                <ListItemIcon>
                                    <AttachMoneyIcon fontSize="medium" />
                                </ListItemIcon>
                                <ListItemText>Withdraw {ethers.utils.commify(user.rewards)} CRO</ListItemText>
                            </MenuItem>
                            :
                            <MenuItem onClick={withdrawRewards} className="accountMenu" sx={{ marginTop: "5px"}}>
                                <ListItemIcon>
                                        <AttachMoneyIcon fontSize="medium" />
                                </ListItemIcon>
                                <ListItemText>Withdraw {ethers.utils.commify(user.rewards)} CRO</ListItemText>
                            </MenuItem>
                        }
                        </>

                        :
                        <MenuItem onClick={registerCode} className="accountMenu">
                        <ListItemIcon>
                                <PeopleIcon fontSize="medium" />
                        </ListItemIcon>
                        <ListItemText>Register Referral Code</ListItemText>
                        </MenuItem>
                    }
                </Container>
                : null
            }
            </>
        }
        <Divider />
        </> : null }
        <Container sx={{ margin: "15px 0px 7px 0px", fontWeight: "500"}}>
            Settings
            <MenuItem onClick={colorMode.toggleColorMode} className="accountMenu" sx={{ marginTop: "5px", fontWeight: 300}}>
            <ListItemIcon>
                 {theme.palette.mode === 'dark' ?
                    <LightModeIcon/>
                    :
                    <DarkModeIcon/>
                }
            </ListItemIcon>
            <ListItemText>
            {theme.palette.mode === 'dark' ?
                    <>
                    Light Mode
                    </>
                    :
                    <>
                    Dark Mode
                    </>
            }
            </ListItemText>
            </MenuItem>
        </Container>
        <Divider />
        {(user.address)?
        <MenuItem onClick={logout} sx={{ margin: "5px 0px 5px 0px", color: "#ff7f7f"}} className="accountMenu">
          <ListItemIcon>
            <Logout fontSize="medium" />
          </ListItemIcon>
            Disconnect Wallet
        </MenuItem>
        : null }
      </Menu>

        <Snackbar open={showCopied} autoHideDuration={6000} onClose={copyClosed}
            sx={{ top: "85%" }}
        >
                <Alert onClose={copyClosed} severity="success">
                    Referral code copied!
                </Alert>
        </Snackbar>
        <Dialog
            open={doingWork}>
            <DialogContent>
                <Stack spacing={2} direction='row'>
                    <CircularProgress/>
                    <Typography variant='h3'>
                        {progressText}
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
    </React.Fragment>
  );
};
