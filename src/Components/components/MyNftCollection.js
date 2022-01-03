import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NftCard from './NftCard';
import {withdrewRewards, transferedNFT, updateListed, fetchNfts} from '../../GlobalState/User';
import {Spinner} from "react-bootstrap";
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
import { getAnalytics, logEvent } from '@firebase/analytics'
import * as PropTypes from "prop-types";
import { createSuccessfulTransactionToastContent } from "../../utils";

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
const MyNftCollection = ({ showLoadMore = true, walletAddress = null}) => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user)
    const isLoading = useSelector((state) => state.user.fetchingNfts)
    const nfts = useSelector((state) => user.nfts)
    const [height, setHeight] = useState(0);

    const [alertOpen, setAlertOpen] = useState(true);
    const [askTransfer, setAskTransfer] = useState(false);


    const [progressText, setProgressText] = useState('Working...');
    const [doingWork, setDoingWork] = useState(false);
    const [selectedNft, setSelectedNft] = useState(null);
    const [transferAddress, setTransferAddress] = useState(null);

    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }

    useEffect(() => {
        dispatch(fetchNfts(user.address, user.provider, user.nftsInitialized));
    }, []);

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'my_nfts'
        })
    }, []);

    const withdrawPayments = async () => {
        try {
            setDoingWork(true);
            const tx = await user.membershipContract.withdrawPayments(user.address);
            const receipt = await tx.wait();
            toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
            dispatch(withdrewRewards());
        }catch(error){
            if(error.data){
                toast.error(error.data.message);
            } else if(error.message){
                toast.error(error.message);
            } else {
                console.log(error);
                toast.error("Unknown Error");
            }
        }finally{
            setDoingWork(false);
        }
    }

    /// TRANSFER------------------

    const transferNft = async () => {
        try{
            closeTransfer();
            setDoingWork(true);
            let tx;
            if(selectedNft.multiToken){
                tx = await selectedNft.contract.safeTransferFrom(user.address, transferAddress, selectedNft.id, 1, []);
            } else {
                tx = await selectedNft.contract.safeTransferFrom(user.address, transferAddress, selectedNft.id);
            }
            const receipt = await tx.wait();
            toast.success(`Transfer successful!`);
            dispatch(transferedNFT(selectedNft));
        }catch(error){
            if(error.data){
                toast.error(error.data.message);
            } else if(error.message){
                toast.error(error.message);
            } else {
                console.log(error);
                toast.error("Unknown Error");
            }
        }finally{
            setDoingWork(false);
        }
    }

    const showTransferDialog = (nft) => () => {
        setSelectedNft(nft);
        setAskTransfer(true);
    }

    const closeTransfer = () =>{
        setAskTransfer(false);
    }

    /// END TRANSFER-=------------

    ////--- SALE -------- >>

    const [salePrice, setSalePrice] = useState(null);
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
    const [showMemberOnly, setShowMemberOnly] = useState(false);
    const [startSale, setStartSale] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [nextEnabled, setNextEnabled] = useState(false);

    const [royalty, setRoyalty] = useState(0);
    const [fee, setFee] = useState(0);
    const [youReceive, setYouReceive] = useState(0);


    const calculateExtraFees = (price) => async () => {
        setYouReceive(price - ((fee / 100) * price) - ((royalty / 100) * price));
    }

    const showListDialog = (nft) => async () => {
        try{
            setSelectedNft(nft);
            setStartSale(true);
            let fees = await user.marketContract.fee(user.address);
            let royalties = await user.marketContract.royalties(nft.address)
            setFee((fees / 10000) * 100);
            setRoyalty((royalties[1] / 10000) * 100);
            const transferEnabled = await nft.contract.isApprovedForAll(user.address, user.marketContract.address);
            if(transferEnabled){
                setActiveStep(1);
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
            setStartSale(false);
            setSelectedNft(null);
            setActiveStep(0);
        }
        // finally {
        // setStartSale(false);
        // setSelectedNft(null);
        // setActiveStep(0);
        // }

    }

    const setApprovalForAll = async() => {
        try{
            let tx = await selectedNft.contract.setApprovalForAll(user.marketContract.address, true);
            await tx.wait();
            setNextEnabled(false);
            setActiveStep(1);
        }catch(error){
            if(error.data){
                toast.error(error.data.message);
            } else if(error.message){
                toast.error(error.message);
            } else {
                console.log(error);
                toast.error("Unknown Error");
            }
            setStartSale(false);
            setSelectedNft(null);
            setActiveStep(0);
        }
    }

    const makeListing = async () => {
        try{
            setNextEnabled(false);
            setDoingWork(true);
            const price = ethers.utils.parseEther(salePrice);
            let tx = await user.marketContract.makeListing(selectedNft.contract.address, selectedNft.id, price);
            let receipt = await tx.wait();
            dispatch(updateListed(selectedNft.contract.address, selectedNft.id, true));
            toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        }catch(error){
            if(error.data){
                toast.error(error.data.message);
            } else if(error.message){
                toast.error(error.message);
            } else {
                console.log(error);
                toast.error("Unknown Error");
            }
        } finally{
            setDoingWork(false);
            setStartSale(false);
            setSelectedNft(null);
            setActiveStep(0);
        }
    }

    useEffect(() => {
        if(salePrice && salePrice.length > 0 && salePrice[0] != '0'){
            setNextEnabled(true);
        } else {
            setNextEnabled(false);
        }
    }, [salePrice])


    const cancelList = () =>{
        setStartSale(false);
        setActiveStep(0);
        setNextEnabled(false);
    }

    const cancelMemberOnly = () => {
        setShowMemberOnly(false);
    }

    const handleNext = () => {
        if(activeStep === 0){
            setApprovalForAll();
        } else if(activeStep === 1){
            setActiveStep(2);
        } else if(activeStep === 2){
            makeListing();
        }
    };

    const showCancelDialog = (nft) => async () => {
        try{
            setDoingWork(true);
            let tx = await user.marketContract.cancelListing(nft.listingId);
            let receipt = await tx.wait();
            dispatch(updateListed(nft.contract.address, nft.id, false));
            toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        }catch(error){
            if(error.data){
                toast.error(error.data.message);
            } else if(error.message){
                toast.error(error.message);
            } else {
                console.log(error);
                toast.error("Unknown Error");
            }
        }finally{
            setDoingWork(false);
        }

    }

    //// END SALE
    const [showCopied, setShowCopied] = useState(false);
    const copyClosed = () => {
        setShowCopied(false);
    }
    const copyLink = (nft) => () =>{
        navigator.clipboard.writeText(window.location.origin + '/listing/' + nft.listingId)
        setShowCopied(true);
    }

    return (
        <>
            <div className='row'>
                {nfts && nfts.map( (nft, index) => (
                    <NftCard
                        nft={nft}
                        key={index}
                        onImgLoad={onImgLoad}
                        height={height}
                        canTransfer={true}
                        canSell={nft.listable && !nft.listed}
                        canCancel={nft.listed && nft.listingId}
                        canUpdate={nft.listable && nft.listed}
                        onTransferButtonPressed={showTransferDialog(nft)}
                        onSellButtonPressed={showListDialog(nft)}
                        onUpdateButtonPressed={showListDialog(nft)}
                        onCancelButtonPressed={showCancelDialog(nft)}
                        newTab={true}
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
            {!isLoading && nfts.length === 0 &&
                <div className='row mt-4'>
                    <div className='col-lg-12 text-center'>
                        <span>Nothing to see here...</span>
                    </div>
                </div>
            }

            {(selectedNft) ?
                <Dialog
                    onClose={closeTransfer}
                    open={askTransfer}>
                    <DialogContent>
                        <DialogTitle>
                            Start Transfer
                        </DialogTitle>
                        <Grid container spacing={{sm : 4}} columns={2}>
                            <Grid item xs={2} md={1} key='1'>
                                <Container>
                                    <CardMedia component='img' src={selectedNft.image} width='150' />
                                </Container>
                            </Grid>
                            <Grid item xs={1} key='2' >
                                <TextField label="Address" variant="outlined" onChange={ (e) => {
                                    setTransferAddress(e.target.value);
                                }}/>
                            </Grid>
                        </Grid>

                        <DialogActions>
                            <Button onClick={closeTransfer}>Cancel</Button>
                            <Button onClick={transferNft}>OK</Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
                : null}

            {(selectedNft) ?
                <Dialog
                    onClose={cancelList}
                    open={startSale}>
                    <DialogContent>
                        <DialogTitle>List {selectedNft.name}</DialogTitle>
                        <Grid container spacing={{sm : 4}} columns={2}>
                            <Grid item xs={2} md={1} key='1'>
                                <Container>
                                    <CardMedia component='img' src={selectedNft.image} width='150' />
                                </Container>
                            </Grid>
                            <Grid item xs={1} key='2' >
                                <Stepper activeStep={activeStep} orientation="vertical">
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
                                                        <TextField sx={{ marginTop: "10px", marginBottom: "10px" }}type='number' label="Price" variant="outlined" onChange={ (e) => {
                                                            dispatch(calculateExtraFees(e.target.value));
                                                            setSalePrice(e.target.value);
                                                        }}/>
                                                        <Typography>
                                                            Buyer pays: <span className='bold'>
                                                        {(salePrice)?
                                                            ethers.utils.commify(salePrice) : 0
                                                        }</span> CRO
                                                        </Typography>
                                                        <Typography>
                                                            Service Fee: <span className='bold'>{fee}</span>%
                                                        </Typography>
                                                        <Typography>
                                                            Royalty Fee: <span className='bold'>{royalty}</span>%
                                                        </Typography>

                                                        <Typography>
                                                            You receive: <span className='bold'>{ethers.utils.commify(youReceive.toFixed(2))}</span> CRO
                                                        </Typography>
                                                    </Stack>
                                                    : null
                                                }

                                                <Box sx={{ mb: 2 }}>
                                                    <div>
                                                        <button className='btn-main lead mb-5 mr15' disabled={!nextEnabled} onClick={handleNext}>
                                                            {!nextEnabled && index !== 1 ?
                                                                <>
                                                                    <i className="fa fa-circle-o-notch fa-spin me-2"></i>
                                                                    Working...
                                                                </>
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

export default memo(MyNftCollection);
