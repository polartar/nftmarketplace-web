import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUnfilteredListings, MyListingsCollectionPageActions } from '../../GlobalState/User';
import { Form, Spinner } from "react-bootstrap";
import { getAnalytics, logEvent } from '@firebase/analytics'
import MyListingCard from "./MyListingCard";
import MyNftListDialog from "./MyNftListDialog";
import MyNftCancelDialog from "./MyNftCancelDialog";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const MyListingsCollection = ({ walletAddress = null}) => {

    const dispatch = useDispatch();
    const [width, setWidth] = useState(0);
    const isLoading = useSelector((state) => state.user.myUnfilteredListingsFetching);
    const myListings = useSelector((state) => state.user.myUnfilteredListings);
    const myUnfilteredListingsInvalidOnly = useSelector((state) => state.user.myUnfilteredListingsInvalidOnly);
    const [openInvalidListingsAlertDialog, setOpenInvalidListingsAlertDialog] = useState(false);
    const [userAcknowledgedWarning, setUserAcknowledgedWarning] = useState(false);

    const onImgLoad = ({target:img}) => {
        let currentWidth = width;
        if(currentWidth < img.offsetWidth) {
            setWidth(img.offsetWidth);
        }
    };

    useEffect(async() => {
        dispatch(fetchUnfilteredListings(walletAddress));
    }, [walletAddress]);

    useEffect(async() => {
        if (!userAcknowledgedWarning) {
            setOpenInvalidListingsAlertDialog(myListings.some((value => !value.valid)));
        }
    }, [myListings]);

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'my_sales'
        })
    }, []);

    const invalidListingsWarningAcknowledged = () => {
        setUserAcknowledgedWarning(true);
        setOpenInvalidListingsAlertDialog(false)
    };

    return (
        <>
            {
                myListings.some((value => true)) &&
                (
                    <div className="alert alert-danger" role="alert">
                        <span> <FontAwesomeIcon color='var(--bs-danger)' icon={faExclamationCircle} size={"2x"}/> </span>
                        <p>
                            <strong>You have some invalid listings which must be addressed.</strong> This can happen when an NFT is staked or transferred without being delisted first or approval is revoked.
                            To rectify this, you must either:
                        </p>
                        <ol>
                            <li><strong>Cancel your listing here before it's returned to your wallet or approval granted (recommended).</strong></li>
                            <li>(<strong>Not Recommended - DO AT YOUR OWN RISK</strong>) Cancel or update the price of the item as soon as possible when it's back in your wallet. This is risky as although it may not be able
                                to be seen on the marketplace, it will be valid on the smart contract the second it's returned to your wallet. If anyone was interacting with it directly they
                                would be able to purchase your item for the price of your old listing if you are not quick enough.</li>
                        </ol>
                    </div>
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
            <div className='row gap-3'>
                <div className='card-group'>

                { myListings && myListings.filter(x => x.listed).filter(x => myUnfilteredListingsInvalidOnly ? !x.valid : true).map((nft, index) => (
                    <div key={index} className="d-item col-lg-6 col-md-12 mb-4 px-2">
                        <MyListingCard
                            nft={ nft }
                            key={ index }
                            onImgLoad={ onImgLoad }
                            width={ width }
                            canCancel={ nft.state === 0 }
                            canUpdate={ nft.state === 0 && nft.isInWallet }
                            onUpdateButtonPressed={ () => dispatch(MyListingsCollectionPageActions.showMyNftPageListDialog(nft)) }
                            onCancelButtonPressed={ () => dispatch(MyListingsCollectionPageActions.showMyNftPageCancelDialog(nft)) }
                            newTab={ true }
                        />
                    </div>
                )) }
                </div>
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
            { openInvalidListingsAlertDialog &&
                <div className='checkout'>
                    <div className='maincheckout' style={{maxWidth: '650px'}}>
                        <button className='btn-close' onClick={() => setOpenInvalidListingsAlertDialog(false)}>x</button>
                        <div className='heading'>
                            <h3>Warning!</h3>
                        </div>
                        <p>
                            <strong>You have some invalid listings which must be addressed.</strong> This can happen when an NFT is staked or transferred without being delisted first or approval is revoked.
                            To rectify this, you must either:
                        </p>
                        <ol>
                            <li><strong>Cancel your listing here before it's returned to your wallet or approval granted (recommended).</strong></li>
                            <li>(<strong>Not Recommended - DO AT YOUR OWN RISK</strong>) Cancel or update the price of the item as soon as possible when it's back in your wallet. This is risky as although it may not be able
                                to be seen on the marketplace, it will be valid on the smart contract the second it's returned to your wallet. If anyone was interacting with it directly they
                                would be able to purchase your item for the price of your old listing if you are not quick enough.</li>
                        </ol>

                        <div className="text-center mb-2">
                            <button className='btn-main inline white me-2' style={{width:'auto'}} onClick={() => invalidListingsWarningAcknowledged()}>
                                I Understand
                            </button>
                            <button className='btn-main inline' style={{width:'auto'}} onClick={() => {
                                invalidListingsWarningAcknowledged();
                                dispatch(MyListingsCollectionPageActions.setInvalidOnly(true));
                            }}>
                                Show Invalid Listings
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default memo(MyListingsCollection);
