import React, {memo, useEffect, useState} from 'react';
import Blockies from "react-blockies";
import {useDispatch, useSelector} from "react-redux";
import useOnclickOutside from "react-cool-onclickoutside";
import {useHistory} from "react-router-dom";
import {connectAccount, onLogout, setTheme, withdrewRewards, withdrewPayments, registeredCode} from "../../GlobalState/User";
import {toast} from "react-toastify";
import MetaMaskOnboarding from '@metamask/onboarding';
import { nanoid } from 'nanoid'
import {ethers} from 'ethers'
import {NavLink} from "react-bootstrap";

const AccountMenu = function() {
    const dispatch = useDispatch();
    const history = useHistory();

    const [showpop, btn_icon_pop] = useState(false);

    const closePop = () => {
        btn_icon_pop(false);
    };
    const refpop = useOnclickOutside(() => {
        closePop();
    });
    const walletAddress = useSelector((state) => {
        return state.user.address;
    });
    const correctChain = useSelector((state) => {
        return state.user.correctChain;
    });
    const theme = useSelector((state) => {
        return state.user.theme;
    });
    const user = useSelector((state) => {
        return state.user;
    });
    const needsOnboard = useSelector((state) => {
        return state.user.needsOnboard;
    });

    const navigateTo = (link) => {
        closePop();
        history.push(link);
    }

    const logout = async () => {
        dispatch(onLogout());
    }

    const connectWalletPressed = async () => {
        if(needsOnboard){
            const onboarding = new MetaMaskOnboarding();
            onboarding.startOnboarding();
        } else{
            dispatch(connectAccount());
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        console.log('toggleTheme...', newTheme);
        dispatch(setTheme(newTheme));
    }

    const handleCopy = (code) => () =>{
        navigator.clipboard.writeText(code);
        toast.success('Copied!');
    }

    const withdrawRewards = async () => {
        try {
            // setDoingWork(true);
            const tx = await user.membershipContract.withdrawPayments(user.address);
            const receipt = await tx.wait();
            toast.success(`Success! ${receipt.hash}`);
            dispatch(withdrewRewards());
        } catch (error) {
            if (error.data) {
                toast.error(error.data.message);
            } else if (error.message) {
                toast.error(error.message);
            } else {
                console.log(error);
                toast.error("Unknown Error");
            }
        } finally {
            // setDoingWork(false);
        }
    }

    const withdrawBalance = async() => {
        try{
            // setDoingWork(true);
            const tx = await user.marketContract.withdrawPayments(user.address);
            const receipt = await tx.wait();
            toast.success(`Success! ${receipt.hash}`);
            dispatch(withdrewPayments());
        }catch(error){
            if (error.data) {
                toast.error(error.data.message);
            } else if (error.message) {
                toast.error(error.message);
            } else {
                console.log(error);
                toast.error("Unknown Error");
            }
        }finally{
            // setDoingWork(false);
        }
    }

    const registerCode = async () => {
        try{
            // setDoingWork(true);
            const id = nanoid(10);
            const encoded = ethers.utils.formatBytes32String(id)
            const tx = await user.membershipContract.register(encoded);
            const receipt = await tx.wait();
            toast.success(`Success! ${receipt.hash}`);
            dispatch(registeredCode(id));
        }catch(error){
            if (error.data) {
                toast.error(error.data.message);
            } else if (error.message) {
                toast.error(error.message);
            } else {
                console.log(error);
                toast.error("Unknown Error");
            }
        }finally{
            // setDoingWork(false);
        }
    }

    const clearCookies = async () => {
        dispatch(onLogout());
        toast.success(`Cookies cleared!`);
    }

    useEffect(() => {
        dispatch(connectAccount());
    }, []);

    return (
        <div className='mainside'>
            {!walletAddress && (
                <div className='connect-wal'>
                    <NavLink onClick={connectWalletPressed}>
                        Connect Wallet
                    </NavLink>
                </div>
            )}
            {walletAddress && !correctChain && (
                <p>Wrong Chain!</p>
            )}
            {walletAddress && correctChain && (
                <div id="de-click-menu-profile" className="de-menu-profile">
                                <span onClick={()=> btn_icon_pop(!showpop)}>
                                    <Blockies seed={user.address} size={8} scale={4}/>
                                </span>
                    {showpop &&
                    <div className="popshow" ref={refpop}>
                        <div className="d-wallet">
                            <h4>My Wallet</h4>
                            <div className="d-flex justify-content-between">
                                <span id="wallet" className="d-wallet-address">{`${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length-3, walletAddress.length)}`}</span>
                                <button className="btn_menu" title="Copy Address" onClick={handleCopy(walletAddress)}>Copy</button>
                            </div>
                        </div>
                        <div className="d-wallet">
                            <h4>Market Balance</h4>
                            <div className="d-flex justify-content-between">
                                <span>{user.marketBalance} CRO</span>
                                {user.marketBalance !== '0.0' &&
                                    <button className="btn_menu" title="Withdraw Balance" onClick={withdrawBalance}>Withdraw</button>
                                }
                            </div>
                        </div>
                        {user.isMember &&
                        <>
                                <div className="d-wallet">
                                    <h4>Referral Balance</h4>
                                    <div className="d-flex justify-content-between">
                                        <span>{user.rewards} CRO</span>
                                        {user.rewards !== '0.0' &&
                                            <button className="btn_menu" title="Withdraw Referral Rewards" onClick={withdrawRewards}>Withdraw</button>
                                        }
                                    </div>
                                </div>
                                {(user.code && user.code.length > 0) ?
                                    <div className="d-wallet">
                                        <h4>Referral Code</h4>
                                        <div className="d-flex justify-content-between">
                                            <span id="wallet" className="d-wallet-address">{user.code}</span>
                                            <button className="btn_menu" title="Copy Referral Code"
                                                    onClick={handleCopy(user.code)}>Copy
                                            </button>
                                        </div>
                                    </div>
                                    :
                                    <div className="d-wallet">
                                        <h4>Referral Code</h4>
                                        <div className="d-flex justify-content-between">
                                            <button className="btn_menu" title="Register Referral Code"
                                                    onClick={registerCode}>Register
                                            </button>
                                        </div>
                                    </div>
                                }
                            </>
                        }
                        <div className="d-line"></div>
                        <ul className="de-submenu-profile">
                            <li>
                                <span onClick={() => navigateTo(`/nfts`)}>
                                    <i className="fa fa-photo"></i> My NFTs
                                </span>
                            </li>
                            <li>
                                <span onClick={() => navigateTo(`/sales`)}>
                                    <i className="fa fa-shopping-basket"></i> My Sales
                                </span>
                            </li>
                            <li>
                                <span onClick={clearCookies}>
                                    <i className="fa fa-flash"></i> Clear Cookies
                                </span>
                            </li>
                        </ul>
                        <div className="d-line"></div>
                        <ul className="de-submenu-profile">
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
