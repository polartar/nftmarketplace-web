import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ListingCard from './ListingCard';
import {init, fetchListings} from "../../GlobalState/auctionsSlice";
import InfiniteScroll from 'react-infinite-scroll-component';
import {Spinner} from "react-bootstrap";
import AuctionCard from "./AuctionCard";

const AuctionCollection = ({ showLoadMore = true, collectionId = null , sellerId = null, cacheName = null}) => {

    const dispatch = useDispatch();
    const listings = useSelector((state) => state.auctions.auctions)

    const canLoadMore = useSelector((state) => {
        return state.marketplace.curPage === 0 || state.marketplace.curPage < state.marketplace.totalPages;
    });

    const marketplace = useSelector((state) => {
        return state.marketplace;
    });

    const isFilteredOnCollection = useSelector((state) => {
        return marketplace.curFilter !== null &&
            marketplace.curFilter.type === 'collection' &&
            marketplace.curFilter.address !== null;
    });

    useEffect(async () => {
        let sort = {
            type: 'listingId',
            direction: 'desc'
        }

        let filter = {
            type: null,
            address: null
        }

        if(collectionId){
            filter.type = 'collection';
            filter.address = collectionId;
        } else if(sellerId){
            filter.type = 'seller';
            filter.address = sellerId;
        } else {
            //  if cacheName is supplied filter and sort values remain same after changing pages.
            const cachedFilter = marketplace.cachedFilter[cacheName];
            const cachedSort = marketplace.cachedSort[cacheName];

            if (cachedFilter) {
                filter.type = cachedFilter.type;
                filter.address = cachedFilter.address;
            }

            if (cachedSort) {
                sort.type = cachedSort.type;
                sort.direction = cachedSort.direction;
            }
        }
        dispatch(init(sort, filter));
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
                <div className='card-group'>
                    {listings && listings.map( (listing, index) => (
                        <div key={index} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                            <AuctionCard
                                listing={listing}
                                imgClass="marketplace"
                            />
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        );
    }
    else {
        return (
            <div className='row'>
                <div className='card-group'>
                    {listings && listings.map( (listing, index) => (
                        <div key={index} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                            <ListingCard
                                listing={listing}
                                imgClass="marketplace"
                            />
                        </div>
                    ))}
                </div>
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

export default memo(AuctionCollection);
