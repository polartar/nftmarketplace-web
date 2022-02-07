import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSales } from '../../GlobalState/User';
import {Spinner} from "react-bootstrap";
import { getAnalytics, logEvent } from '@firebase/analytics'
import SoldNftCard from "./SoldNftCard";
import InvalidListingsPopup from './InvalidListingsPopup';

const MySoldNftCollection = ({ walletAddress = null}) => {

    const dispatch = useDispatch();
    const [width, setWidth] = useState(0);
    const isLoading = useSelector((state) => state.user.mySoldNftsFetching);
    const mySoldNfts = useSelector((state) => state.user.mySoldNfts);

    const onImgLoad = ({target:img}) => {
        let currentWidth = width;
        if(currentWidth < img.offsetWidth) {
            setWidth(img.offsetWidth);
        }
    };

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
            <InvalidListingsPopup navigateTo={true}/>
            <div className='row'>
                {mySoldNfts && mySoldNfts.map( (nft, index) => (
                    <SoldNftCard
                        nft={nft}
                        key={index}
                        onImgLoad={onImgLoad}
                        width={width}
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
