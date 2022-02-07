import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUnfilteredListings, MyListingsCollectionPageActions } from '../../GlobalState/User';
import {useHistory} from "react-router-dom";


const InvalidListingsPopup = (props) => {

const [openInvalidListingsAlertDialog, setOpenInvalidListingsAlertDialog] = useState(false);
const myListings = useSelector((state) => state.user.myUnfilteredListings);
const dispatch = useDispatch();
const [userAcknowledgedWarning, setUserAcknowledgedWarning] = useState(false);
const history = useHistory();



 useEffect(async() => {
    if (!userAcknowledgedWarning) {
        setOpenInvalidListingsAlertDialog(myListings.some((value => !value.valid)));
    }
}, [myListings]);


const invalidListingsWarningAcknowledged = () => {
    setUserAcknowledgedWarning(true);
    setOpenInvalidListingsAlertDialog(false)
};

const navigateTo = (link) => {
    history.push(link);
}

return (
    <>
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
                <p><strong>Please note we are unable to provide refunds if a sale for an old price occurrs due to the seller not following the instructions laid out in point #1.</strong></p>

                <div className="text-center mb-2">
                    <button className='btn-main inline white me-2' style={{width:'auto'}} onClick={() => invalidListingsWarningAcknowledged()}>
                        I Understand
                    </button>
                    <button className='btn-main inline' style={{width:'auto'}} onClick={() => {
                        invalidListingsWarningAcknowledged();
                        dispatch(MyListingsCollectionPageActions.setInvalidOnly(true));
                        if (props.navigateTo) {
                            navigateTo(`/wallet/listings`);
                        }

                    }}>
                        Show Invalid Listings
                    </button>
                </div>
            </div>
        </div>
    }
    </>
)}

export default memo(InvalidListingsPopup);
