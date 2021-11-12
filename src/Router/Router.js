import { useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Link, NavLink} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'
import Home from "../Pages/Home";
import MarketPlaceScreen from "../Pages/MarketPlaceScreen";
import MyNftScreen from "../Pages/MyNft";
import RoadMapScreen from "../Pages/RoadMapScreen";
import mainLogo from "../Assets/web_logo.svg";

import { withStyles, useTheme } from '@mui/styles';
import {
  AppBar, 
  Tabs,
  Tab, 
  Toolbar,
  Box, 
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogContent,
  Stack,
  CircularProgress
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { connectAccount } from "../GlobalState/User";
import Blockies from 'react-blockies';
import MetaMaskOnboarding from '@metamask/onboarding';
import { SwitchChain } from "../Components/OnBoarding/OnBoarding";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from "../App";

const styles = theme => ({
  fullHeight: {
    ...theme.mixins.toolbar,
  },
});

export const NavTabs = withStyles(styles)((props) => {
  const routes = ["/", "/marketplace", "/roadmap", "/nfts", "/"];
  const { classes } = props;
  const dispatch = useDispatch();
  const address = useSelector((state) => {
    return state.user.address;
  });

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const correctChain = useSelector((state) => {
    return state.user.correctChain;
  });

  const needsOnboard = useSelector((state) => {
    return state.user.needsOnboard;
  });

  const connectingWallet = useSelector((state) => {
    return state.user.connectingWallet;
  })

  const startConnect = () => {
    if(needsOnboard){
      const onboarding = new MetaMaskOnboarding();
      onboarding.startOnboarding();
    } else{
      dispatch(connectAccount());
    }
  };

  return (
    <div className="desktopNavTabs">
      <Route
        path="/"
        render={(history) => (
          <AppBar color="inherit">
            <Toolbar>
            
              <Link to='/'>
                <img src={mainLogo} alt="Logo" height="54"/>
              </Link>
              
              <Box component='div' width='1.5%'/>

              <NavLink to='/' style={{ textDecoration: 'none', color: 'unset' }}>
                <Typography  color='inherit' component='div' style={{fontWeight : 600}}>
                  Ebisus
                </Typography>
              </NavLink>
              <NavLink to='/' style={{ textDecoration: 'none', color: 'unset' }}>
                <Typography color='inherit' component='div' style={{fontWeight : 400}}>
                  Bay
                </Typography>
              </NavLink>

              <Box component='div' sx={{ flexGrow: 1 }}/>
              <Tabs
              classes={{ root: classes.fullHeight }}
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              selectionFollowsFocus={true}
                value={
                  history.location.pathname !== "/"
                    ? history.location.pathname
                    : false
                }>
                  
                <Tab
                classes={{ root: classes.fullHeight }}
                  value={routes[1]}
                  label="Marketplace"
                  component={Link}
                  to={routes[1]}
                  textColor="ihnerit"
                />

                <Tab
                classes={{ root: classes.fullHeight }}
                  value={routes[2]}
                  textColor="inherit"
                  label="RoadMap"
                  component={Link}
                  to={routes[2]}
                />
              {(address) ?
                  <Tab
                  classes={{ root: classes.fullHeight }}
                    value={routes[3]}
                    textColor="inherit"
                    label="My NFTs"
                    component={Link}
                    to={routes[3]}
                  /> : null
              } 

              </Tabs>
              <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                 {theme.palette.mode === 'dark' ? <Brightness7Icon color='primary'/> : <Brightness4Icon color='primary'/>}
              </IconButton>
              {(address)? 
                (correctChain) ?
                  <Avatar sx={{ bgcolor: '#d32f2f' }} alt={address}>
                    <Blockies seed={address} size={30}/>
                  </Avatar>
                 :
                  <SwitchChain/>
                
                : <IconButton color='primary' aria-label="connect" onClick={startConnect} >
                    <AccountBalanceWalletIcon/>
                  </IconButton>
              }
            </Toolbar>
          </AppBar>
        )}
      />
      <Dialog
        open={connectingWallet}>
        <DialogContent>
            <Stack spacing={2} direction='row'>
                <CircularProgress/>
                <Typography variant='h3'>
                    Connecting Wallet....
                </Typography>
            </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export const AppRouter = () => {
  return (
    <Router>
      <NavTabs />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/marketplace" component={MarketPlaceScreen} />
        <Route exact path="/roadmap" component={RoadMapScreen} />
        <Route exact path="/nfts" component={MyNftScreen} />
      </Switch>
    </Router>

  );
};
