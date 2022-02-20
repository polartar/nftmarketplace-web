import React, { useCallback } from 'react';
import ListingCollection from '../components/ListingCollection';
import Footer from '../components/Footer';
import { createGlobalStyle } from 'styled-components';
import TopFilterBar from '../components/TopFilterBar';
import { useParams } from 'react-router-dom';
import { sortOptions } from '../components/constants/sort-options';
import { SortOption } from '../Models/sort-option.model';
import { useDispatch, useSelector } from 'react-redux';
import { sortListings } from '../../GlobalState/marketplaceSlice';

const GlobalStyles = createGlobalStyle`
`;

const Seller = () => {
  const cacheName = 'sellerPage';

  const dispatch = useDispatch();
  const { address } = useParams();

  const marketplace = useSelector((state) => {
    return state.marketplace;
  });

  const selectDefaultSortValue = marketplace.cachedSort[cacheName] ?? SortOption.default();

  const selectSortOptions = useSelector((state) => {
    if (state.marketplace.hasRank) {
      return sortOptions;
    }

    return sortOptions.filter((s) => s.key !== 'rank');
  });

  const onSortChange = useCallback(
    (sortOption) => {
      dispatch(sortListings(sortOption, cacheName));
    },
    [dispatch]
  );

  return (
    <div>
      <GlobalStyles />

      <section
        className="jumbotron breadcumb no-bg"
        style={{ backgroundImage: `url(${'/img/background/subheader.jpg'})` }}
      >
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12 text-center">
                <h1>Marketplace</h1>
                <p>{`${address.substring(0, 4)}...${address.substring(address.length - 3, address.length)}`}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-lg-12">
            <TopFilterBar
              showFilter={false}
              showSort={true}
              sortPlaceHolder="Sort Listings..."
              sortOptions={[SortOption.default(), ...selectSortOptions]}
              defaultSortValue={selectDefaultSortValue}
              onSortChange={onSortChange}
            />
          </div>
        </div>
        <ListingCollection sellerId={address} />
      </section>

      <Footer />
    </div>
  );
};
export default Seller;
