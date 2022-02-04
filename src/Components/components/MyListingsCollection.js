import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUnfilteredListings, MyListingsCollectionPageActions } from '../../GlobalState/User';
import { Form, Spinner } from "react-bootstrap";
import { getAnalytics, logEvent } from '@firebase/analytics'
import MyListingCard from "./MyListingCard";
import MyNftListDialog from "./MyNftListDialog";
import MyNftCancelDialog from "./MyNftCancelDialog";

const MyListingsCollection = ({ walletAddress = null}) => {

    const dispatch = useDispatch();
    const [width, setWidth] = useState(0);
    const isLoading = useSelector((state) => state.user.myUnfilteredListingsFetching);
    const myListings = useSelector((state) => state.user.myUnfilteredListings);
    const myUnfilteredListingsInvalidOnly = useSelector((state) => state.user.myUnfilteredListingsInvalidOnly);

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
            {
                myListings.some((value => !value.valid)) &&
                (
                    <p>You can use this page to manage your listings.
                        If a listing is invalid, make sure to cancel <strong>before</strong> you unstake the NFT or it
                        may reactivate at the old price. If you decide to take the risk, you can update the price once
                        it's back in your wallet which will make it appear on the marketplace again. <br/>
                        <strong>
                            If a listing is invalid and it is now back in your wallet, it won't show on the marketplace
                            but anyone interacting with the contract directly will still be able to buy your NFT.
                            Ensure that you cancel before unstaking or update the price as soon as possible once back in your
                            wallet to prevent this.
                        </strong>
                    </p>
                )
            }

            <div className='row pt-3'>
                <div className='col-12 col-sm-6 col-md-4 m-0 text-nowrap d-flex align-items-center'>
                    <div className="items_filter">
                        <Form.Switch
                            className=""
                            label={ 'Only invalid' }
                            checked={ myUnfilteredListingsInvalidOnly }
                            onChange={ () => dispatch(MyListingsCollectionPageActions.setInvalidOnly(!myUnfilteredListingsInvalidOnly)) }
                        />
                    </div>
                </div>
            </div>
            <div className='row'>

                { myListings && myListings.filter(x => x.listed).filter(x => myUnfilteredListingsInvalidOnly ? !x.valid : true).map((nft, index) => (
                    <MyListingCard
                        nft={ nft }
                        key={ index }
                        onImgLoad={ onImgLoad }
                        width={ width }
                        canCancel={ nft.state === 0 }
                        canUpdate={ nft.state === 0 }
                        onUpdateButtonPressed={ () => dispatch(MyListingsCollectionPageActions.showMyNftPageListDialog(nft)) }
                        onCancelButtonPressed={ () => dispatch(MyListingsCollectionPageActions.showMyNftPageCancelDialog(nft)) }
                        newTab={ true }
                    />
                )) }
            </div>
            { isLoading &&
                <div className='row mt-4'>
                    <div className='col-lg-12 text-center'>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                </div>
            }

            { !isLoading && myListings.length === 0 &&
                <div className='row mt-4'>
                    <div className='col-lg-12 text-center'>
                        <span>Nothing to see here...</span>
                    </div>
                </div>
            }

            <MyNftListDialog/>
            <MyNftCancelDialog/>
        </>
    );
};

export default memo(MyListingsCollection);
