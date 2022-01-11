import React from 'react';
import { Link } from "react-router-dom";
import nebkas from "../../Assets/nebkas-logo.png"
import weAreFi from "../../Assets/wearefi-logo.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTwitter, faMedium } from '@fortawesome/free-brands-svg-icons'
import {faSquare} from "@fortawesome/free-solid-svg-icons";

const footer= () => (
  <footer className="footer-light">
            <div className="container text-center">
                <h5>Partners</h5>
                <div className="row">
                    <div className="col">
                        <a href="https://nebkas.ro" target="_blank">
                            <img src={nebkas} alt='nebkas.co' width='128px'/>
                        </a>
                    </div>
                    <div className="col">
                        <a href="https://www.weare.fi/" target="_blank">
                            <img src={weAreFi} alt='WeAre Solutions' width='64px'/>
                        </a>
                    </div>
                </div>
            </div>
            <div className="subfooter">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="de-flex">
                                <div className="de-flex-col">
                                    <span onClick={()=> window.open("", "_self")}>
                                        <img
                                            height="40px"
                                            src="/img/web_logo.svg"
                                            alt="#"
                                        />
                                        <span className="copy">Copyright &copy; 2021 EbisusBay.com. All rights reserved</span>
                                    </span>
                                    <a href="/tos.html" target="_blank">
                                        &nbsp;{'| Terms of Service'}
                                    </a>
                                </div>
                                <div className="de-flex-col">
                                    <div className="eb-social-icons">
                                        <span className="fa-layers fa-fw fa-2x" onClick={()=> window.open("https://discord.gg/ebisusbay", "_blank")}>
                                            <FontAwesomeIcon icon={faSquare} className="layer1" />
                                            <FontAwesomeIcon icon={faDiscord} inverse transform="shrink-8"/>
                                        </span>
                                        <span className="fa-layers fa-fw fa-2x" onClick={()=> window.open("https://twitter.com/EbisusBay", "_blank")}>
                                            <FontAwesomeIcon icon={faSquare} className="layer1" />
                                            <FontAwesomeIcon icon={faTwitter} inverse transform="shrink-7"/>
                                        </span>
                                        <span className="fa-layers fa-fw fa-2x" onClick={()=> window.open("https://blog.ebisusbay.com", "_blank")}>
                                            <FontAwesomeIcon icon={faSquare} className="layer1" />
                                            <FontAwesomeIcon icon={faMedium} inverse transform="shrink-7"/>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
);
export default footer;