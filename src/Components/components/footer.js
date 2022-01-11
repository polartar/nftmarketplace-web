import React from 'react';
import { Link } from "react-router-dom";
import nebkas from "../../Assets/nebkas-logo.png"
import weAreFi from "../../Assets/wearefi-logo.png"
import { faDiscord, faTwitter, faMedium } from '@fortawesome/free-brands-svg-icons'
import { faSquare, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import LayeredIcon from "./LayeredIcon";

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
                                        <a href="https://discord.gg/ebisusbay" target="_blank">
                                            <LayeredIcon
                                                icon={faDiscord}
                                                bgIcon={faSquare}
                                                shrink={8}
                                            />
                                        </a>
                                        <a href="https://twitter.com/EbisusBay" target="_blank">
                                            <LayeredIcon
                                                icon={faTwitter}
                                                bgIcon={faSquare}
                                                shrink={7}
                                            />
                                        </a>
                                        <a href="https://blog.ebisusbay.com" target="_blank">
                                            <LayeredIcon
                                                icon={faMedium}
                                                bgIcon={faSquare}
                                                shrink={7}
                                            />
                                        </a>
                                        <a href="mailto:support@ebisusbay.com">
                                            <LayeredIcon
                                                icon={faEnvelope}
                                                bgIcon={faSquare}
                                                shrink={7}
                                            />
                                        </a>
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