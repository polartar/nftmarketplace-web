import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSales } from '../../GlobalState/User';
import {Spinner} from "react-bootstrap";
import { getAnalytics, logEvent } from '@firebase/analytics'
import SoldNftCard from "./SoldNftCard";

const MySoldNftCollection = ({ walletAddress = null}) => {

    const dispatch = useDispatch();
    const [height, setHeight] = useState(0);
    const user = useSelector((state) => state.user);
    const isLoading = useSelector((state) => state.user.mySoldNftsFetching);
    const mySoldNfts = useSelector((state) => user.mySoldNfts);

    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }

    useEffect(async() => {
        dispatch(fetchSales(walletAddress));
    }, [walletAddress]);

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'my_sales'
        })
    }, []);

    return (
        <>
            <div className='row'>
                {mySoldNfts && mySoldNfts.map( (nft, index) => (
                    <SoldNftCard
                        nft={nft}
                        key={index}
                        onImgLoad={onImgLoad}
                        height={height}
                    />
                ))}
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

            {!isLoading && mySoldNfts.length === 0 &&
                <div className='row mt-4'>
                    <div className='col-lg-12 text-center'>
                        <span>Nothing to see here...</span>
                    </div>
                </div>
            }
        </>
    );
};

export default memo(MySoldNftCollection);
