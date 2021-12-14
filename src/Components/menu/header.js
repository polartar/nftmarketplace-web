import React, { useEffect, useState } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { header } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import {connectAccount, onLogout, setTheme} from "../../GlobalState/User";
import useOnclickOutside from "react-cool-onclickoutside";
import { Link, NavLink, useHistory } from "react-router-dom";
import Blockies from "react-blockies";
import AccountMenu from "../components/AccountMenu";

setDefaultBreakpoints([
    { xs: 0 },
    { l: 1199 },
    { xl: 1200 }
]);

const Header = function() {
    const [showmenu, btn_icon] = useState(false);

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

                    <AccountMenu/>
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