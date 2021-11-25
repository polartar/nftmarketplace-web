import * as React from 'react';
import {
    Box,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Dialog,
    DialogContent,
    DialogActions,
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
    MenuList,
    Container,
} from '@mui/material';
import { withStyles, useTheme, makeStyles } from '@mui/styles';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PeopleIcon from '@mui/icons-material/People';
import Logout from '@mui/icons-material/Logout';
import Blockies from 'react-blockies';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from "react-router-dom";
import { registeredCode, withdrewRewards, withdrewPayments, onLogout } from '../../GlobalState/User';
import { nanoid } from 'nanoid'
import {ethers} from 'ethers'

import './accountmenu.css'

export const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const [alertOpen, setAlertOpen] = React.useState(true);  
  const [progressText, setProgressText] = React.useState('Working...');
  const [doingWork, setDoingWork] = React.useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const user = useSelector((state) => {
    return state.user;
  });
  const balance = useSelector((state) => {
      if (typeof user.balance === 'undefined') {
          return 0;
      }
    return state.user;
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

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                <Avatar sx={{ bgcolor: '#d32f2f' }} alt={user.address}>
                    <Blockies seed={user.address} size={30}/>
                </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            '& .MuiMenuItem-root': {
                borderBottom: "0 none",
            },
            border: "0px none"
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={Link} to='/nfts' sx={{ border: "0px none" }} >
            <ListItemIcon>
                <InsertPhotoIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText>My NFTs</ListItemText>
        </MenuItem>
        {(user.balance == "Loading...") ?
            <Container sx={{ margin: "10px 0px 10px 0px", fontWeight: "500"}}>
                <Skeleton variant="text" width={100} height={20} sx={{ display: "block"}}/>
                <MenuItem>
                    <Skeleton variant="circular" width={25} height={25} sx={{ display: "block", marginRight: "10px"}}/>
                    <Skeleton variant="text" width={280} height={20} sx={{ display: "block"}}/>
                </MenuItem>
            </Container>
        :
            <Container sx={{ margin: "10px 0px 10px 0px", fontWeight: "500"}}>
                Marketplace Balance
                <MenuItem onClick={withdrawBalance}>
                    <ListItemIcon>
                        <AttachMoneyIcon fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText>Withdraw {balance} CRO</ListItemText>
                </MenuItem>
            </Container>
        }
        {(user.rewards == "Loading...") ?
            <Container sx={{ margin: "10px 0px 10px 0px", fontWeight: "500"}}>
                <Skeleton variant="text" width={100} height={20} sx={{ display: "block"}}/>
                <MenuItem>
                    <Skeleton variant="circular" width={25} height={25} sx={{ display: "block", marginRight: "10px"}}/>
                    <Skeleton variant="text" width={280} height={20} sx={{ display: "block"}}/>
                </MenuItem>
                <MenuItem>
                    <Skeleton variant="circular" width={25} height={25} sx={{ display: "block", marginRight: "10px"}}/>
                    <Skeleton variant="text" width={280} height={20} sx={{ display: "block"}}/>
                </MenuItem>
            </Container>
        :
            <>
            {(user.isMember) ? 
                <Container sx={{ margin: "10px 0px 10px 0px", fontWeight: "500"}}>
                    Referrals
                    {(user.code && user.code.length > 0) ?
                        <>
                        <MenuItem onClick={handleCopy(user.code)}>
                            <ListItemIcon>
                                    <ContentCopyIcon fontSize="medium" />
                            </ListItemIcon>
                            <ListItemText>Copy Referral Code</ListItemText>
                        </MenuItem>
                        {(user.rewards === '0.0') ?
                            null 
                            :
                            <MenuItem onClick={withdrawRewards}>
                                <ListItemIcon>
                                        <AttachMoneyIcon fontSize="medium" />
                                </ListItemIcon>
                                <ListItemText>Withdraw {user.rewards} CRO</ListItemText>
                            </MenuItem>
                        }
                        </>

                        : 
                        <MenuItem onClick={registerCode}>
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
        <MenuItem onClick={logout} sx={{ color: "#ff7f7f"}}>
          <ListItemIcon>
            <Logout fontSize="medium" />
          </ListItemIcon>
            Disconnect Wallet
        </MenuItem>
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
            <Alert onClose={closeSuccess} severity="error" sx={{ width: '100%' }}>
                Transaction was successful!
            </Alert>
        </Snackbar>
    </React.Fragment>
  );
};
