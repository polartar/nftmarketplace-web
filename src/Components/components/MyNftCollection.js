import React, { memo, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { MyNftPageActions, updateListed } from '../../GlobalState/User';
import {
    Box,
    Button, CardMedia, Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid, Stack, Step, StepContent, StepLabel, Stepper,
    TextField, Typography
} from "@mui/material";
import {toast} from "react-toastify";
import {ethers} from "ethers";
import * as PropTypes from "prop-types";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { createSuccessfulTransactionToastContent } from "../../utils";
import NftCardList from "./NftCardList";

function LoadingButton(props) {
    return null;
}

LoadingButton.propTypes = {
    loading: PropTypes.bool,
    variant: PropTypes.string,
    onClick: PropTypes.func,
    sx: PropTypes.shape({mr: PropTypes.number, mt: PropTypes.number}),
    disabled: PropTypes.bool,
    children: PropTypes.node
};

const ListDialogStepEnum = {
    WaitingForTransferApproval: 0,
    EnteringPrice: 1,
    ConfirmListing: 2
}

Object.freeze(ListDialogStepEnum);

const mapStateToProps = (state) => ({
    walletAddress: state.user.address,
    marketContract: state.user.marketContract,
    myNftPageTransferDialog: state.user.myNftPageTransferDialog,
    myNftPageListDialog: state.user.myNftPageListDialog,
    myNftPageCancelDialog: state.user.myNftPageCancelDialog,
});

const MyNftCollection = (
    {
        walletAddress,
        marketContract,
        myNftPageTransferDialog,
        myNftPageListDialog,
        myNftPageCancelDialog,
    }) => {

    const dispatch = useDispatch();


    /// CANCEL------------------

    useEffect(async () => {
        if (myNftPageCancelDialog) {
            dispatch(MyNftPageActions.CancelListing(myNftPageCancelDialog, marketContract));
        }
    }, [ myNftPageCancelDialog ]);

    /// TRANSFER------------------

    const [transferAddress, setTransferAddress] = useState(null);


    useEffect(async () => {
        if (!myNftPageTransferDialog) {
            setTransferAddress(null);
        }
    }, [ myNftPageTransferDialog ]);

    const onTransferDialogAddressValueChange = (inputEvent) => {
        const address = inputEvent.target.value;
        setTransferAddress(address);
    }

    const onTransferDialogConfirm = async () => {
        dispatch(MyNftPageActions.TransferDialogConfirm(myNftPageTransferDialog, walletAddress, transferAddress));
    }

    const onTransferDialogCancel = () =>{
        dispatch(MyNftPageActions.HideMyNftPageTransferDialog());
    }


    /// LIST------------------

    useEffect(async () => {
        if (myNftPageListDialog) {
            await showListDialog(myNftPageListDialog);
        } else {
            setListDialogActiveStep(ListDialogStepEnum.WaitingForTransferApproval);
        }
    }, [ myNftPageListDialog ]);


    const [salePrice, setSalePrice] = useState(null);

    const onListingDialogPriceValueChange = (inputEvent) => {
        setSalePrice(inputEvent.target.value);
    }

    const listingSteps = [
        {
            label: 'Approve Transfer',
            description: `Ebisu's Bay needs approval to transfer your NFT on your behalf.`,
        },
        {
            label : 'Enter Price',
            description : `Enter the listing price in CRO.`
        },
        {
            label: 'Confirm Listing',
            description: 'Sign transaction to complete listing.',
        },

    ];

    const [listDialogActiveStep, setListDialogActiveStep] = useState(ListDialogStepEnum.WaitingForTransferApproval);
    const [nextEnabled, setNextEnabled] = useState(false);

    const [fee, setFee] = useState(0);
    const [royalty, setRoyalty] = useState(0);

    useEffect(() => {
        if(salePrice && salePrice.length > 0 && salePrice[0] != '0'){
            setNextEnabled(true);
        } else {
            setNextEnabled(false);
        }
    }, [salePrice])

    const showListDialog = async (nft) => {
        try{
            const fees = await marketContract.fee(walletAddress);
            const royalties = await marketContract.royalties(nft.address)

            setFee((fees / 10000) * 100);
            setRoyalty((royalties[1] / 10000) * 100);

            const transferEnabled = await nft.contract.isApprovedForAll(walletAddress, marketContract.address);

            if(transferEnabled){
                setListDialogActiveStep(ListDialogStepEnum.EnteringPrice);
            } else {
                setNextEnabled(true);
            }
        }catch(error){
            if(error.data){
                toast.error(error.data.message);
            } else if(error.message){
                toast.error(error.message);
            } else {
                console.log(error);
                toast.error("Unknown Error");
            }
            setListDialogActiveStep(ListDialogStepEnum.WaitingForTransferApproval);
        }
    }


    const listDialogSetApprovalForAllStep = async () => {
        try{
            const selectedNft = myNftPageListDialog;

            const tx = await selectedNft.contract.setApprovalForAll(marketContract.address, true);
            await tx.wait();

            setNextEnabled(false);
            setListDialogActiveStep(ListDialogStepEnum.EnteringPrice);

        }catch(error){
            if(error.data){
                toast.error(error.data.message);
            } else if(error.message){
                toast.error(error.message);
            } else {
                console.log(error);
                toast.error("Unknown Error");
            }
            setListDialogActiveStep(ListDialogStepEnum.WaitingForTransferApproval);
        }
    }

    const listDialogConfirmListingStep = async () => {
        const selectedNft = myNftPageListDialog;

        setNextEnabled(false);

        dispatch(MyNftPageActions.ListingDialogConfirm({
            selectedNft,
            salePrice,
            marketContract
        }));
    }

    const cancelList = () =>{
        dispatch(MyNftPageActions.HideMyNftPageListDialog());
        setListDialogActiveStep(ListDialogStepEnum.WaitingForTransferApproval);
        setNextEnabled(false);
    }

    const handleNext = () => {
        if(listDialogActiveStep === ListDialogStepEnum.WaitingForTransferApproval){
            listDialogSetApprovalForAllStep();

        } else if(listDialogActiveStep === ListDialogStepEnum.EnteringPrice){
            setListDialogActiveStep(ListDialogStepEnum.ConfirmListing);

        } else if(listDialogActiveStep === ListDialogStepEnum.ConfirmListing){
            listDialogConfirmListingStep();
        }
    };

    const getYouReceiveViewValue = () => {
        const youReceive = salePrice - ((fee / 100) * salePrice) - ((royalty / 100) * salePrice);
        return ethers.utils.commify(youReceive.toFixed(2))
    }

    return (
        <>
            <NftCardList/>

            {(myNftPageTransferDialog) ?
                <Dialog
                    onClose={onTransferDialogCancel}
                    open={!!myNftPageTransferDialog}>
                    <DialogContent>
                        <DialogTitle>
                            Start Transfer
                        </DialogTitle>
                        <Grid container spacing={{sm : 4}} columns={2}>
                            <Grid item xs={2} md={1} key='1'>
                                <Container>
                                    <CardMedia component='img' src={myNftPageTransferDialog.image} width='150' />
                                </Container>
                            </Grid>
                            <Grid item xs={1} key='2' >
                                <TextField label="Address" variant="outlined" onChange={onTransferDialogAddressValueChange}/>
                            </Grid>
                        </Grid>

                        <DialogActions>
                            <Button onClick={onTransferDialogCancel}>Cancel</Button>
                            <Button onClick={onTransferDialogConfirm}>OK</Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
                : null}

            {(myNftPageListDialog) ?
                <Dialog
                    onClose={cancelList}
                    open={!!myNftPageListDialog}>
                    <DialogContent>
                        <DialogTitle>List {myNftPageListDialog.name}</DialogTitle>
                        <Grid container spacing={{sm : 4}} columns={2}>
                            <Grid item xs={2} md={1} key='1'>
                                <Container>
                                    <CardMedia component='img' src={myNftPageListDialog.image} width='150' />
                                </Container>
                            </Grid>
                            <Grid item xs={1} key='2' >
                                <Stepper activeStep={listDialogActiveStep} orientation="vertical">
                                    {listingSteps.map((step, index) => (
                                        <Step key={step.label}>
                                            <StepLabel
                                                optional={
                                                    index === 2 ? (
                                                        <Typography variant="caption">Last step</Typography>
                                                    ) : null
                                                }
                                            >
                                                {step.label}
                                            </StepLabel>
                                            <StepContent>
                                                <Typography>{step.description}</Typography>
                                                {(index === 1) ?
                                                    <Stack>
                                                        <TextField sx={{ marginTop: "10px", marginBottom: "10px" }}
                                                                   type='number'
                                                                   label="Price"
                                                                   variant="outlined"
                                                                   onChange={onListingDialogPriceValueChange}/>
                                                        <Typography>
                                                            Buyer pays: <span className='bold'>
                                                        { (salePrice) ? ethers.utils.commify(salePrice) : 0 }</span> CRO
                                                        </Typography>
                                                        <Typography>
                                                            Service Fee: <span className='bold'>{fee}</span>%
                                                        </Typography>
                                                        <Typography>
                                                            Royalty Fee: <span className='bold'>{royalty}</span>%
                                                        </Typography>

                                                        <Typography>
                                                            You receive: <span className='bold'>{getYouReceiveViewValue()}</span> CRO
                                                        </Typography>
                                                    </Stack>
                                                    : null
                                                }

                                                <Box sx={{ mb: 2 }}>
                                                    <div>
                                                        <button className='btn-main lead mb-5 mr15' disabled={!nextEnabled} onClick={handleNext}>
                                                            {!nextEnabled && index !== 1 ?
                                                                <span className='d-flex align-items-center'>
                                                                    <FontAwesomeIcon icon={faSpinner} className='fa-spin'/>
                                                                    <span className='ps-2'>Working...</span>
                                                                </span>
                                                                :
                                                                <>
                                                                    {index === listingSteps.length - 1 ? 'Finish' : 'Continue'}
                                                                </>
                                                            }
                                                        </button>
                                                    </div>
                                                </Box>
                                            </StepContent>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
                : null}
        </>
    );
};

export default connect(mapStateToProps)(memo(MyNftCollection));
