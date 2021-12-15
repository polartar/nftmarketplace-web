import { React, useLayoutEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import ScrollToTopBtn from './Components/menu/ScrollToTop';
import { createGlobalStyle } from 'styled-components';
import { AppRouter } from "./Router/Router";
import {toast, ToastContainer} from 'react-toastify';

import { initializeApp } from 'firebase/app';
import firebaseConfig from './Firebase/firebase_config'
import { initializeAnalytics } from "firebase/analytics";
import { initProvider } from './GlobalState/User';

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

function App() {
    const dispatch = useDispatch();

    const theme = useSelector((state) => {
        return state.user.theme;
    });

    useLayoutEffect(() =>{
        const firebase = initializeApp(firebaseConfig);
        initializeAnalytics(firebase);
        dispatch(initProvider());
    }, []);

    return (
        <div className={"wraper " + (theme === 'dark' ? 'greyscheme' : '')}>
            <GlobalStyles />
            <AppRouter firebase/>
            <ScrollToTopBtn />
            <ToastContainer position={toast.POSITION.BOTTOM_LEFT} hideProgressBar={true} />
        </div>
    );
}

export default App;
