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
} from '@mui/material';
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


export const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [error, setError] = React.useState(null);
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

    const closeError = () => {
        setError(null);
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
            setError(error.data.message);
        } else if(error.message){
            setError(error.message)
        } else {
            console.log(error);
            setError("Unknown Error")
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
            setError(error.data.message);
        } else if(error.message){
            setError(error.message)
        } else {
            console.log(error);
            setError("Unknown Error")
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
            setError(error.data.message);
        } else if(error.message){
            setError(error.message)
        } else {
            console.log(error);
            setError("Unknown Error")
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
      >
        <MenuItem component={Link} to='/nfts'>
            <ListItemIcon>
                <InsertPhotoIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText>My NFTs</ListItemText>
        </MenuItem>
        <MenuItem onClick={withdrawBalance}>
            <ListItemIcon>
                <AttachMoneyIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText>Withdraw {balance} CRO from Balance</ListItemText>
        </MenuItem>
        {(user.isMember) ? 
            <>
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
                            <ListItemText>Withdraw {user.rewards} CRO of Referral Rewards</ListItemText>
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
            </>
            : null
        }
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="medium" />
          </ListItemIcon>
            Disconnect Wallet
        </MenuItem>
      </Menu>

        <Snackbar open={showCopied} autoHideDuration={6000} onClose={copyClosed}
            sx={{ top: "85%" }}
        >
                <Alert onClose={copyClosed} severity="success" sx={{ width: '100%', backgroundColor: "#4e9a50", color: "white", fontWeight: "500" }}>
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

        <Dialog 
            onClose={closeSuccess}
            open={showSuccess.show}>
            <DialogContent>
                <Typography variant='h3'>Success! 🥳 </Typography>
                <Typography variant='subtitle2'>{showSuccess.hash}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeSuccess}>Close</Button>
            </DialogActions>
        </Dialog>

        <Dialog 
            open={error != null}
            onClose={closeError}>
                <DialogContent>
                    <Typography variant='h3'>There was an issue 😵</Typography>
                    <Typography variant='subtitle2'>{
                        (error) ? error : ""
                    }</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeError}>Close</Button>
                </DialogActions>
        </Dialog>
    </React.Fragment>
  );
}
