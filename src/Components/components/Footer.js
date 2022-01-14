import React, { memo } from 'react';
import { useLocation } from "react-router-dom";
import nebkas from "../../Assets/nebkas-logo.png"
import weAreFi from "../../Assets/wearefi-logo.png"

const Footer = () => {
    const location = useLocation()


    return (
        <footer className="footer-light" data-is-in-home-page={ (location.pathname === '/').toString() }>
            <div className="container text-center">
                <h5>Partners</h5>
                <div className="row">
                    <div className="col">
                        <a href="https://nebkas.ro" target="_blank">
                            <img src={ nebkas } alt='nebkas.co' width='128px'/>
                        </a>
                    </div>
                    <div className="col">
                        <a href="https://www.weare.fi/" target="_blank">
                            <img src={ weAreFi } alt='WeAre Solutions' width='64px'/>
                        </a>
                    </div>
                </div>
            </div>

            <div className="subfooter">
                <div className="container">
                    <div className="row align-items-center">
                        <div className='col-2'>
                            <img height="40px"
                                 src="/img/web_logo.svg"
                                 alt="#"
                            />
                        </div>

                        <div className="col-10 social-icons d-flex justify-content-end">
                            <span onClick={ () => window.open("https://twitter.com/EbisusBay", "_blank") }>
                                <i className="fa fa-twitter fa-lg"/>
                            </span>
                        </div>

                        <a href="/tos.html" target="_blank" className='col-12 pt-3 text-center'>
                            &nbsp;{ 'Terms of Service' }
                        </a>

                        <span className="col-12 pt-3 copy text-center" style={{opacity: '0.6'}}>
                            Copyright &copy; 2021 EbisusBay.com. All rights reserved
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);
