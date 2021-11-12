import {
  React, 
  Fragment, 
  useLayoutEffect, 
  useMemo, 
  createContext,
  useState
} from 'react'
import {useDispatch} from 'react-redux'

import {
  createTheme,
  ThemeProvider,
  Zoom,
  Fab,
  useScrollTrigger,
  Box,
  CssBaseline,
  Container,
} from '@mui/material';

import {makeStyles} from "@mui/styles"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import "./App.css";
import Footer from './Components/Footer/Footer';
import { AppRouter } from "./Router/Router";

import { initializeApp } from 'firebase/app';
import firebaseConfig from './Firebase/firebase_config'
import { initializeAnalytics } from "firebase/analytics";
import { initProvider } from './GlobalState/User';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(10),
    right: theme.spacing(2),
    zIndex: 999,
  }
}));

function ScrollTop(props) {
  const { children } = props;
  const classes = useStyles();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}



function App(props) {

  const dispatch = useDispatch();
  const [mode, setMode] = useState('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );
  
  useLayoutEffect(() =>{
    const firebase = initializeApp(firebaseConfig);
    initializeAnalytics(firebase);
    dispatch(initProvider());
  }, []);



  const theme = useMemo(
    () => createTheme({
      palette: {
        mode: mode,
        primary: {
          main: "#d32f2f",
        },
        secondary: {
          main: "#ef5350",
        },
    
      },
    
    }), [mode]
  );

  return (
    <Fragment>
      <ColorModeContext.Provider value={colorMode}>
      <Container className="App">
        <Box id="back-to-top-anchor" height='54px'/>
        <ThemeProvider theme={theme}>
        <CssBaseline/>
        <AppRouter firebase/>
        <Footer />
        <ScrollTop {...props}>
          <Fab color="primary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
          
        </ThemeProvider>

      </Container>
      </ColorModeContext.Provider>
    </Fragment>
  );
}

export default App;