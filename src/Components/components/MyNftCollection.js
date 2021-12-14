import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NftCard from './NftCard';
import { fetchNfts } from "../../GlobalState/User";
import {Spinner} from "react-bootstrap";

const MyNftCollection = ({ showLoadMore = true, walletAddress = null}) => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user)
    const isLoading = useSelector((state) => state.user.fetchingNfts)
    const nfts = useSelector((state) => user.nfts)

    const [height, setHeight] = useState(0);

    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }

    const canLoadMore = useSelector((state) => {
        return state.user.curPage < state.user.totalPages;
    });

    useEffect(() => {
        dispatch(fetchNfts(user.address, user.provider));
    }, [dispatch]);

    const loadMore = () => {
        dispatch(fetchNfts());
    }

    return (
        <>
            <div className='row'>
                {nfts && nfts.map( (nft, index) => (
                    <NftCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} />
                ))}
                { showLoadMore && canLoadMore &&
                <div className='col-lg-12'>
                    <div className="spacer-single"></div>
                    <span onClick={loadMore} className="btn-main lead m-auto">Load More</span>
                </div>
                }
            </div>
            {isLoading &&
                <div className='row mt-4'>
                    <div className='col-lg-12 text-center'>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                </div>
            }
            {!isLoading && nfts.length === 0 &&
                <div className='row mt-4'>
                    <div className='col-lg-12 text-center'>
                        <span>Nothing to see here...</span>
                    </div>
                </div>
            }
        </>
    );
};

export default memo(MyNftCollection);