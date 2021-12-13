import React, { useEffect, useState } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { header } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import { connectAccount, onLogout } from "../../GlobalState/User";
import useOnclickOutside from "react-cool-onclickoutside";
import { Link, NavLink, useHistory } from "react-router-dom";
import Blockies from "react-blockies";

setDefaultBreakpoints([
    { xs: 0 },
    { l: 1199 },
    { xl: 1200 }
]);

const Header = function() {
    const dispatch = useDispatch();
    const history = useHistory();

    const [showmenu, btn_icon] = useState(false);
    const [showpop, btn_icon_pop] = useState(false);
    const [shownot, btn_icon_not] = useState(false);
    const closePop = () => {
        btn_icon_pop(false);
    };
    const closeNot = () => {
        btn_icon_not(false);
    };
    const refpop = useOnclickOutside(() => {
        closePop();
    });
    const refpopnot = useOnclickOutside(() => {
        closeNot();
    });

    const walletAddress = useSelector((state) => {
        return state.user.address;
    });
    const correctChain = useSelector((state) => {
        return state.user.correctChain;
    });
    const marketBalance = useSelector((state) => {
        return state.user.marketBalance;
    });
    const referralCode = useSelector((state) => {
        return state.user.code;
    });

    const navigateTo = (link) => {
        closePop();
        history.push(link);
    }

    const logout = async () => {
        dispatch(onLogout());
    }

    useEffect(() => {
        const header = document.getElementById("myHeader");
        const totop = document.getElementById("scroll-to-top");
        const sticky = header.offsetTop;
        const scrollCallBack = window.addEventListener("scroll", () => {
            btn_icon(false);
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky");
                totop.classList.add("show");

            } else {
                header.classList.remove("sticky");
                totop.classList.remove("show");
            }
        });
        return () => {
            window.removeEventListener("scroll", scrollCallBack);
        };
    }, []);

    useEffect(() => {
        if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER") != null && walletAddress == null) {
            dispatch(connectAccount(true));
        }
    }, []);

    // const { switcher, themes, currentTheme, status } = useThemeSwitcher();
    // const [isDarkMode, setIsDarkMode] = React.useState(false);
    // if (status === 'loading') {
    //     return <div>Loading styles...</div>;
    // }

    // const toggleDarkMode = () => {
    //     setIsDarkMode(previous => {
    //         switcher({ theme: previous ? themes.light : themes.dark });
    //         return !previous;
    //     });
    // };

    const connectWalletPressed = async () => {
        dispatch(connectAccount());
    };

    return (
        <header id="myHeader" className='navbar white'>
            <div className='container'>
                <div className='row w-100-nav'>
                    <div className='logo px-0'>
                        <div className='navbar-title navbar-item'>
                            <NavLink to="/">
                                <img
                                    src="/img/logo.png"
                                    className="img-fluid d-block"
                                    alt="#"
                                />
                                <img
                                    src="/img/logo-2.png"
                                    className="img-fluid d-3"
                                    alt="#"
                                />
                                <img
                                    src="/img/logo-3.png"
                                    className="img-fluid d-4"
                                    alt="#"
                                />
                                <img
                                    src="/img/logo-light.png"
                                    className="img-fluid d-none"
                                    alt="#"
                                />
                            </NavLink>
                        </div>
                    </div>

                    <BreakpointProvider>
                        <Breakpoint l down>
                            {showmenu &&
                            <div className='menu'>
                                <div className='menu'>
                                    <div className='navbar-item'>
                                        <NavLink to="/home">
                                            Home
                                            <span className='lines'></span>
                                        </NavLink>
                                    </div>
                                    <div className='navbar-item'>
                                        <NavLink to="/marketplace">
                                            Marketplace
                                            <span className='lines'></span>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                            }
                        </Breakpoint>

                        <Breakpoint xl>
                            <div className='menu'>
                                <div className='navbar-item'>
                                    <NavLink to="/home">
                                        Home
                                        <span className='lines'></span>
                                    </NavLink>
                                </div>
                                <div className='navbar-item'>
                                    <NavLink to="/marketplace">
                                        Marketplace
                                        <span className='lines'></span>
                                    </NavLink>
                                </div>
                                <div className='navbar-item'>
                                    <NavLink to="/drops">
                                        Drops
                                        <span className='lines'></span>
                                    </NavLink>
                                </div>
                            </div>
                        </Breakpoint>
                    </BreakpointProvider>

                    <div className='mainside'>
                        {!walletAddress && (
                            <div className='connect-wal'>
                                <button id="walletButton" className="btn-main" onClick={connectWalletPressed}>
                                    Connect Wallet
                                </button>
                            </div>
                        )}
                        {walletAddress && !correctChain && (
                            <p>Wrong Chain!</p>
                        )}
                        {walletAddress && correctChain && (
                            <div id="de-click-menu-profile" className="de-menu-profile">
                                <span onClick={()=> btn_icon_pop(!showpop)}>
                                    <Blockies size={8} scale={4}/>
                                </span>
                                {showpop &&
                                <div className="popshow" ref={refpop}>
                                    <div className="d-wallet">
                                        <h4>Balance</h4>
                                        <span>{marketBalance} CRO</span>
                                        <button id="btn_copy" title="Withdraw Balance">Withdraw</button>
                                    </div>
                                    <div className="d-wallet">
                                        <h4>My Wallet</h4>
                                        <span id="wallet" className="d-wallet-address">{`${walletAddress.substring(0, 2)}...${walletAddress.substring(walletAddress.length-3, walletAddress.length)}`}</span>
                                        <button id="btn_copy" title="Copy Address">Copy</button>
                                    </div>
                                    <div className="d-wallet">
                                        <h4>Referral Code</h4>
                                        <span id="wallet" className="d-wallet-address">{referralCode}</span>
                                        <button id="btn_copy" title="Copy Referral Code">Copy</button>
                                    </div>
                                    <div className="d-line"></div>
                                    <ul className="de-submenu-profile">
                                        <li>
                                      <span onClick={() => navigateTo(`/nfts`)}>
                                          <i className="fa fa-photo"></i> My NFTs
                                      </span>
                                        </li>
                                        <li>
                                      <span onClick={logout}>
                                        <i className="fa fa-sign-out"></i> Disconnect Wallet
                                      </span>
                                        </li>
                                    </ul>
                                </div>
                                }
                            </div>
                        )}
                    </div>

                </div>

                <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
                    <div className="menu-line white"></div>
                    <div className="menu-line1 white"></div>
                    <div className="menu-line2 white"></div>
                </button>

            </div>
        </header>
    );
}
export default Header;