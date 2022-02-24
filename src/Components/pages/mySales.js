import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Footer from '../components/Footer';
import MySoldNftCollection from '../components/MySoldNftCollection';

const MySales = () => {
  const walletAddress = useSelector((state) => state.user.address);

  const Content = () => (
    <>
      <Helmet>
        <title>My Sales | Ebisu's Bay Marketplace</title>
        <meta name="description" content="My Sales for Ebisu's Bay Marketplace" />
      </Helmet>
      <section className="jumbotron breadcumb no-bg tint">
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12 text-center">
                <h1>My Sales</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <MySoldNftCollection walletAddress={walletAddress} />
      </section>

      <Footer />
    </>
  );

  return <div>{walletAddress ? <Content /> : <Redirect to="/marketplace" />}</div>;
};

export default MySales;
