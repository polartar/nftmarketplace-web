import React from 'react';
import Footer from '../components/footer';
import LatestDropsCollection from "../components/LatestDropsCollection";
import Reveal from "react-awesome-reveal";
import SliderCarouselSingleRedux from "../components/SliderCarouselSingleRedux";
import {keyframes} from "@emotion/react";
import {createGlobalStyle} from "styled-components";
import SliderMain from '../components/SliderCarouselNew';

const GlobalStyles = createGlobalStyle`
`;

const Drops = () => (
    <div>
        <GlobalStyles/>
        <section className="jumbotron breadcumb no-bg h-vh" style={{backgroundImage: `url(${'./img/background/12.jpg'})`}}>
            <div className='container'>
                <div className='row'>
                    <SliderMain/>
                </div>
            </div>
        </section>

        <section className='container no-bottom no-top'>
            <div className='row'>
                <div className='col-lg-12'>
                    <div className='text-center'>
                        <h2>Latest Drops</h2>
                        <div className="small-border"></div>
                    </div>
                </div>
                <div className='col-lg-12'>
                    <LatestDropsCollection/>
                </div>
            </div>
        </section>

        <Footer />

    </div>
);
export default Drops;