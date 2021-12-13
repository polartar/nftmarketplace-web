import { React, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux'
import ScrollToTopBtn from './Components/menu/ScrollToTop';
import Header from './Components/menu/header';
import { createGlobalStyle } from 'styled-components';
import { AppRouter } from "./Router/Router";

import { initializeApp } from 'firebase/app';
import firebaseConfig from './Firebase/firebase_config'
import { initializeAnalytics } from "firebase/analytics";
import { initProvider } from './GlobalState/User';

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
    React.useEffect(() => window.scrollTo(0,0), [location])
    return children
}

function App() {
    const dispatch = useDispatch();

    useLayoutEffect(() =>{
        const firebase = initializeApp(firebaseConfig);
        initializeAnalytics(firebase);
        dispatch(initProvider());
    }, []);

    return (
        <div className="wraper">
            <GlobalStyles />
            <AppRouter firebase/>
            <ScrollToTopBtn />
        </div>
    );
}

export default App;
