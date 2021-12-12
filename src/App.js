import React from 'react';
import ScrollToTopBtn from './Components/menu/ScrollToTop';
import Header from './Components/menu/header';
import { createGlobalStyle } from 'styled-components';
import { AppRouter } from "./Router/Router";

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
  return (
    <div className="wraper">
      <GlobalStyles />
      <AppRouter firebase/>
      <ScrollToTopBtn />
    </div>
  );
}

export default App;
