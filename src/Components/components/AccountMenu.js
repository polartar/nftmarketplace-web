import React, {memo, useEffect, useState} from 'react';
import { Row, Col, Toast, Button } from "react-bootstrap"
import Blockies from "react-blockies";
import {useDispatch, useSelector} from "react-redux";
import useOnclickOutside from "react-cool-onclickoutside";
import {useHistory} from "react-router-dom";
import {connectAccount, onLogout, setTheme} from "../../GlobalState/User";

const AccountMenu = function() {
    const dispatch = useDispatch();
    const history = useHistory();

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
    const theme = useSelector((state) => {
        return state.user.theme;
    });

    const navigateTo = (link) => {
        closePop();
        history.push(link);
    }

    const logout = async () => {
        dispatch(onLogout());
    }

    const connectWalletPressed = async () => {
        dispatch(connectAccount());
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        console.log('toggleTheme...', newTheme);
        dispatch(setTheme(newTheme));
    }

    useEffect(() => {
        if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER") != null && walletAddress == null) {
            dispatch(connectAccount(true));
        }
    }, []);

    return (
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
                            <h4>My Wallet</h4>
                            <div className="d-flex justify-content-between">
                                <span id="wallet" className="d-wallet-address">{`${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length-3, walletAddress.length)}`}</span>
                                <button className="btn_menu" title="Copy Address">Copy</button>
                            </div>
                        </div>
                        <div className="d-wallet">
                            <h4>Market Balance</h4>
                            <div className="d-flex justify-content-between">
                                <span>{marketBalance} CRO</span>
                                <button className="btn_menu" title="Withdraw Balance">Withdraw</button>
                            </div>
                        </div>
                        <div className="d-wallet">
                            <h4>Referral Balance</h4>
                            <div className="d-flex justify-content-between">
                                <span>{marketBalance} CRO</span>
                                <button className="btn_menu" title="Withdraw Balance">Withdraw</button>
                            </div>
                        </div>
                        <div className="d-wallet">
                            <h4>Referral Code</h4>
                            <div className="d-flex justify-content-between">
                                <span id="wallet" className="d-wallet-address">{referralCode}</span>
                                <button className="btn_menu" title="Copy Referral Code">Copy</button>
                            </div>
                        </div>
                        <div className="d-line"></div>
                        <ul className="de-submenu-profile">
                            <li>
                                          <span onClick={() => navigateTo(`/nfts`)}>
                                              <i className="fa fa-photo"></i> My NFTs
                                          </span>
                            </li>
                            <li>
                                          <span onClick={toggleTheme}>
                                              <i className="fa fa-photo"></i> Change Theme
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
    );
}

export default memo(AccountMenu);