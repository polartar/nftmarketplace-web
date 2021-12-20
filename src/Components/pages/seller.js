import React from 'react';
import ListingCollection from '../components/ListingCollection';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import TopFilterBar from '../components/TopFilterBar';
import {useParams} from "react-router-dom";

const GlobalStyles = createGlobalStyle`
`;



const Seller = () => {
    const { address } = useParams();

    return (
        <div>
            <GlobalStyles/>

            <section className='jumbotron breadcumb no-bg'
                     style={{backgroundImage: `url(${'/img/background/subheader.png'})`}}>
                <div className='mainbreadcumb'>
                    <div className='container'>
                        <div className='row m-10-hor'>
                            <div className='col-12 text-center'>
                                <h1>Marketplace</h1>
                                <p>{address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <TopFilterBar showFilter={false}/>
                    </div>
                </div>
                <ListingCollection sellerId={address}/>
            </section>


            <Footer/>
        </div>
    );
};
export default Seller;