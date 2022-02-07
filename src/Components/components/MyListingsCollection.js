import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUnfilteredListings, MyListingsCollectionPageActions } from '../../GlobalState/User';
import { Form, Spinner } from "react-bootstrap";
import { getAnalytics, logEvent } from '@firebase/analytics'
import MyListingCard from "./MyListingCard";
import MyNftListDialog from "./MyNftListDialog";
import MyNftCancelDialog from "./MyNftCancelDialog";
import InvalidListingsPopup from "./InvalidListingsPopup";

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
                            <strong>Some of your current listings are invalid.</strong> This can happen when a listed NFT was not delisted from the marketplace before being staked, transferred, or approval being revoked. This can cause NFTs to be sold significantly under floor price once the NFT returns to your wallet.
                        </p>
                        <h5>Option 1 (Recommended):</h5>
                        <p className="mb-4">
                            Cancel your listings below before those NFTs are returned to your wallet or approval granted.
                        </p>
                        <h5>Option 2 (AT YOUR OWN RISK, lower gas fees):</h5>
                        <p>
                            Either cancel or update the price of the NFT as soon as it is in your wallet. This is cheaper but must be done as soon as possible to avoid users from buying your listing before it can be cancelled or updated.
                        </p>
                        <p><strong>Please note: No refunds will be given for sales at older prices. It is your own responsibility to make sure you do not have any invalid listings at any given time!</strong></p>
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
            <InvalidListingsPopup navigateTo={false}/>
        </>
    );
};

export default memo(MyListingsCollection);
