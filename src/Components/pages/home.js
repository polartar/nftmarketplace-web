import React from 'react';
import SliderMain from '../components/SliderMain';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import SliderCarouselRedux from "../components/SliderCarouselRedux";
import ListingCollection from "../components/ListingCollection";
import CarouselCollectionRedux from "../components/CarouselCollectionRedux";

const GlobalStyles = createGlobalStyle`
`;

const homethree= () => (
    <div>
        <GlobalStyles />
        <section className="jumbotron no-bg no-bottom">
            <div className='container-fluid'>
                <div className='row'>
                    <SliderCarouselRedux/>
                </div>
            </div>
        </section>

        <section className='container no-top'>
            <div className='container'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className="spacer-double"></div>
                        <h2 className='style-2'>New Items</h2>
                    </div>
                </div>
                <ListingCollection/>
            </div>
        </section>

        <section className='container'>
            <div className='row'>
                <div className='col-lg-12'>
                    <h2 className='style-2'>Hot Collections</h2>
                </div>
            </div>
            <div className='container'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <CarouselCollectionRedux/>
                    </div>
                </div>
            </div>
        </section>

        <Footer />

    </div>
);
export default homethree;