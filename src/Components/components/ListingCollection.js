import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ListingCard from './ListingCard';
import {init, fetchListings} from "../../GlobalState/marketplaceSlice";
import InfiniteScroll from 'react-infinite-scroll-component';
import {Spinner} from "react-bootstrap";
import { SortOption } from '../Models/sort-option.model';

import { FilterOption } from "../Models/filter-option.model";

const ListingCollection = ({ showLoadMore = true, collectionId = null , sellerId = null, cacheName = null}) => {

    const dispatch = useDispatch();
    const listings = useSelector((state) => state.marketplace.listings)
    const [height, setHeight] = useState(0);

    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }

    const canLoadMore = useSelector((state) => {
        return state.marketplace.curPage === 0 || state.marketplace.curPage < state.marketplace.totalPages;
    });

    const marketplace = useSelector((state) => {
        return state.marketplace;
    });

    useEffect(async () => {
        if (collectionId) {
            const sortOption = new SortOption();
            sortOption.key = 'listingId';
            sortOption.direction = 'desc';
            sortOption.label = 'By Id';

            const filterOption = new FilterOption();
            filterOption.type = 'collection';
            filterOption.address = collectionId;
            filterOption.name = 'By Collection';

            dispatch(init(sortOption, filterOption));
            dispatch(fetchListings());
            return;
        }

        if (sellerId) {
            const sortOption = new SortOption();
            sortOption.key = 'listingId';
            sortOption.direction = 'desc';
            sortOption.label = 'By Id';

            const filterOption = new FilterOption();
            filterOption.type = 'seller';
            filterOption.address = sellerId;
            filterOption.name = 'By Seller';

            dispatch(init(sortOption, filterOption));
            dispatch(fetchListings());
            return;
        }

        const filterOption = marketplace.cachedFilter[cacheName] ?? FilterOption.default();
        const sortOption = marketplace.cachedSort[cacheName] ?? SortOption.default();

        dispatch(init(sortOption, filterOption));
        dispatch(fetchListings());

    }, [dispatch]);

    const loadMore = () => {
        dispatch(fetchListings());
    }

    if (showLoadMore) {
        return (
            <InfiniteScroll
                dataLength={listings.length}
                next={loadMore}
                hasMore={canLoadMore}
                style={{ overflow: 'hidden' }}
                loader={
                    <div className='row'>
                        <div className='col-lg-12 text-center'>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    </div>
                }
                endMessage={() => {
                    if (listings.length) {
                        return (
                            <div className='row mt-4'>
                                <div className='col-lg-12 text-center'>
                                    <span>Nothing to see here...</span>
                                </div>
                            </div>
                        )
                    }
                }}
            >
                <div className='row'>
                    {listings && listings.map( (listing, index) => (
                        <ListingCard listing={listing} key={index} onImgLoad={onImgLoad} height={height} />
                    ))}
                </div>
            </InfiniteScroll>
        );
    }
    else {
        return (
            <div className='row'>
                {listings && listings.map( (listing, index) => (
                    <ListingCard listing={listing} key={index} onImgLoad={onImgLoad} height={height} />
                ))}
                { showLoadMore && canLoadMore &&
                    <div className='col-lg-12'>
                        <div className="spacer-single"/>
                        <span onClick={loadMore} className="btn-main lead m-auto">Load More</span>
                    </div>
                }
            </div>
        );
    }
};

export default memo(ListingCollection);
