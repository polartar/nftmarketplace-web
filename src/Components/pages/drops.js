import React from 'react';
import Footer from '../components/Footer';
import LatestDropsCollection from "../components/LatestDropsCollection";
import {createGlobalStyle} from "styled-components";
import DropsCarousel from '../components/DropsCarousel';
import HotCollections from "../components/HotCollections";
import UpcomingDrops from "../Drops/UpcomingDrops";
import PastDrops from "../Drops/PastDrops";
import foundingMember  from "../../Assets/founding_member.png";
import {Link} from "react-router-dom";
import CurrentDrops from "../components/CurrentDrops";

const GlobalStyles = createGlobalStyle`
`;

const Drops = () => (
    <div>
        <GlobalStyles/>
        <section style={{paddingTop:'90px', paddingBottom:'8px', background:'transparent'}}>
            <div className="d-flex justify-content-center px-5">
                <p className="my-auto me-5">
                    Enjoy amazing discounts on drops and 50% off service fees while holding an Ebisu's Bay Founding Member NFT. <span className="fw-bold"><Link to="/drops/founding-member">Learn More ></Link></span>
                </p>
                <div style={{width: '70px'}} className="my-auto">
                    <Link to="/drops/founding-member">
                        <img src={foundingMember} className="img-responsive" alt="Founding Member Membership"/>
                    </Link>
                </div>
            </div>
        </section>
        <section className="jumbotron breadcumb no-bg h-vh" style={{backgroundImage: `url(${'./img/background/12.jpg'})`}}>
            <div className='container'>
                <div className='row py-4'>
                    <DropsCarousel/>
                </div>
            </div>
        </section>

        <section className='container'>
            <div className='row'>
                <div className='col-lg-12'>
                    <div className='text-center'>
                        <h2>Active Drops</h2>
                        <div className="small-border"></div>
                    </div>
                </div>
                <div className='col-lg-12'>
                    <CurrentDrops />
                </div>
            </div>
        </section>

        <section className='container no-top'>
            <div className='row'>
                <div className='col-lg-12'>
                    <div className='text-center'>
                        <h2>Upcoming Drops</h2>
                        <div className="small-border"></div>
                    </div>
                </div>
                <div className='col-lg-12'>
                    <UpcomingDrops />
                </div>
            </div>
        </section>

        <section className='container no-top'>
            <div className='row'>
                <div className='col-lg-12'>
                    <div className='text-center'>
                        <h2>Completed Drops</h2>
                        <div className="small-border"></div>
                    </div>
                </div>
                <div className='col-lg-12'>
                    <PastDrops />
                </div>
            </div>
        </section>

        <Footer />

    </div>
);
export default Drops;
