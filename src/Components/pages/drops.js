import React from 'react';
import Footer from '../components/Footer';
import LatestDropsCollection from "../components/LatestDropsCollection";
import {createGlobalStyle} from "styled-components";
import DropsCarousel from '../components/DropsCarousel';
import HotCollections from "../components/HotCollections";
import UpcomingDrops from "../Drops/UpcomingDrops";
import PastDrops from "../Drops/PastDrops";

const GlobalStyles = createGlobalStyle`
`;

const Drops = () => (
    <div>
        <GlobalStyles/>
        <section className="jumbotron breadcumb no-bg h-vh h-min-100-vh" style={{backgroundImage: `url(${'./img/background/12.jpg'})`}}>
            <div className='container pt0 pt-3'>
                <div className='row'>
                    <DropsCarousel/>
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
