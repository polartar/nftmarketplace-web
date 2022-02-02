import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {fetchSales, fetchUnfilteredListings} from '../../GlobalState/User';
import {Spinner} from "react-bootstrap";
import { getAnalytics, logEvent } from '@firebase/analytics'
import SoldNftCard from "./SoldNftCard";
import MyListingCard from "./MyListingCard";
import { MyNftPageActions } from "../../GlobalState/User";


const MyListingsCollection = ({ walletAddress = null}) => {

    const dispatch = useDispatch();
    const [width, setWidth] = useState(0);
    const isLoading = useSelector((state) => state.user.myUnfilteredListingsFetching);
    const myListings = useSelector((state) => state.user.myUnfilteredListings);

    const onImgLoad = ({target:img}) => {
        let currentWidth = width;
        if(currentWidth < img.offsetWidth) {
            setWidth(img.offsetWidth);
        }
    };

    useEffect(async() => {
        dispatch(fetchUnfilteredListings(walletAddress));
    }, [walletAddress]);

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'my_sales'
        })
    }, []);

    return (
        <>
            <p>You can use this page to manage your listings. 
                If a listing is invalid, make sure to cancel <strong>before</strong> you unstake the NFT or it 
                may reactivate at the old price. If you decide to take the risk, you can update the price once 
                it's back in your wallet which will make it appear on the marketplace again.<br></br>
                
                <strong>If a listing is invalid and it is now back in your wallet, it won't show on the marketplace
                    but anyone interacting with the contract directly will still be able to buy your NFT. 
                    Ensure that you cancel before unstaking or update the price as soon as possible once back in your wallet to prevent this.</strong></p>
            <div className='row'>
                
                {myListings && myListings.map( (nft, index) => (
                    <MyListingCard
                        nft={nft}
                        key={index}
                        onImgLoad={onImgLoad}
                        width={width}
                        canCancel={ nft.state == 0 }
                        canUpdate={ nft.state == 0 }
                        onUpdateButtonPressed={ () => MyNftPageActions.showMyNftPageListDialog(nft) }
                        onCancelButtonPressed={ () => dispatch(MyNftPageActions.showMyNftPageCancelDialog(nft)) }
                        newTab={ true }
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

            {!isLoading && myListings.length === 0 &&
                <div className='row mt-4'>
                    <div className='col-lg-12 text-center'>
                        <span>Nothing to see here...</span>
                    </div>
                </div>
            }
        </>
    );
};

export default memo(MyListingsCollection);
