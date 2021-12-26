import React from 'react';
import Footer from '../components/footer';
import LatestDropsCollection from "../components/LatestDropsCollection";
import {createGlobalStyle} from "styled-components";
import DropsCarousel from '../components/DropsCarousel';

const GlobalStyles = createGlobalStyle`
`;

const Drops = () => (
    <div>
        <GlobalStyles/>
        <section className="jumbotron breadcumb no-bg h-vh" style={{backgroundImage: `url(${'./img/background/12.jpg'})`}}>
            <div className='container'>
                <div className='row'>
                    <DropsCarousel/>
                </div>
            </div>
        </section>

        <Footer />

    </div>
);
export default Drops;