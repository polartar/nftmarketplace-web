import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "../Pages/Home";
import MarketPlaceScreen from "../Pages/MarketPlaceScreen";
import MyNftScreen from "../Pages/MyNft";
import RoadMapScreen from "../Pages/RoadMapScreen";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import mainLogo from "../Assets/web_logo.svg";
import Avatar from "@material-ui/core/Avatar";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import { MemoryRouter, useRouteMatch } from 'react-router-dom';

export const NavTabs = () => {
  const routes = ["/", "/marketplace", "/roadmap", "/mynft", "/"];

  return (
    <div className="desktopNavTabs">
      <Route
        path="/"
        render={(history) => (
          <AppBar>
            <Tabs
            variant='standard'
            centered='false'
              selectionFollowsFocus={true}
              value={
                history.location.pathname !== "/"
                  ? history.location.pathname
                  : false
              }
              textColor='inherit'
            >
              <div className="maintabsDiv">
                <Tab
                  value={routes[0]}
                  label=""
                  // textColor="primary"
                  component={Link}
                  to={routes[0]}
                  icon={
                    <Avatar
                      className="mainLoogo"
                      alt="test avatar"
                      src={mainLogo}
                    />
                  }
                />
              </div>
              <Tab
                value={routes[1]}
                label="Marketplace"
                component={Link}
                to={routes[1]}
                textColor="primary"

                // color='primary'
              />
              {/* <Tab
                value={routes[3]}
                textColor="primary"
                label="My Nfts"
                component={Link}
                to={routes[3]}/> */}
              <Tab
                value={routes[2]}
                textColor="primary"
                label="RoadMap"
                component={Link}
                to={routes[2]}
              />
              {/* <Tab
                value={routes[4]}
                component={Link}
                to={routes[4]}
                label=""
                textColor="primary"
                icon={<AccountBalanceWalletIcon className="wIcon" />}
              /> */}
            </Tabs>
          </AppBar>
        )}
      />
    </div>
  );
};

export const AppRouter = () => {
  return (
    <Router>
      <NavTabs />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/marketplace" component={MarketPlaceScreen} />
        <Route exact path="/roadmap" component={RoadMapScreen} />
        <Route exact path="/mynft" component={MyNftScreen} />
      </Switch>
    </Router>
  );
};
