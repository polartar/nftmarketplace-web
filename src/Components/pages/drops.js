import React from 'react';
import SliderMain from '../components/SliderMain';
import CarouselCollectionRedux from '../components/CarouselCollectionRedux';
import Footer from '../components/footer';


const Drops = () => (
    <div>
        <section className="jumbotron breadcumb no-bg h-vh" style={{backgroundImage: `url(${'./img/bg-shape-1.jpg'})`}}>
            <SliderMain/>
        </section>

        <section className='container no-bottom'>
            <div className='row'>
                <div className='col-lg-12'>
                    <div className='text-center'>
                        <h2>Latest Drops</h2>
                        <div className="small-border"></div>
                    </div>
                </div>
                <div className='col-lg-12'>
                    <CarouselCollectionRedux/>
                </div>
            </div>
        </section>

        <Footer />

    </div>
);
export default Drops;