import React, { memo, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { MyNftPageActions } from '../../GlobalState/User';

const mapStateToProps = (state) => ({
    walletAddress: state.user.address,
    marketContract: state.user.marketContract,
    myNftPageListDialog: state.user.myNftPageListDialog,
    myNftPageCancelDialog: state.user.myNftPageCancelDialog,
});

const MyNftCancelDialog = (
    {
        marketContract,
        myNftPageCancelDialog,
    }) => {

    const dispatch = useDispatch();

    useEffect(async () => {
        if (myNftPageCancelDialog) {
            dispatch(MyNftPageActions.CancelListing(myNftPageCancelDialog, marketContract));
        }
    }, [ myNftPageCancelDialog ]);

    return (<></>);
};

export default connect(mapStateToProps)(memo(MyNftCancelDialog));
