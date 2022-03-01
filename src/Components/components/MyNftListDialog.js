import React, { memo, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  Box,
  CardMedia,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MyNftPageActions } from '../../GlobalState/User';

const ListDialogStepEnum = {
  WaitingForTransferApproval: 0,
  EnteringPrice: 1,
  ConfirmListing: 2,
};

Object.freeze(ListDialogStepEnum);

const mapStateToProps = (state) => ({
  walletAddress: state.user.address,
  marketContract: state.user.marketContract,
  myNftPageListDialog: state.user.myNftPageListDialog,
});

const MyNftListDialog = ({ walletAddress, marketContract, myNftPageListDialog }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function asyncFunc() {
      if (myNftPageListDialog) {
        await showListDialog();
      } else {
        setListDialogActiveStep(ListDialogStepEnum.WaitingForTransferApproval);
      }
    }
    asyncFunc();
  }, [myNftPageListDialog]);

  const [salePrice, setSalePrice] = useState(null);

  const onListingDialogPriceValueChange = (inputEvent) => {
    setSalePrice(inputEvent.target.value);
  };

  const listingSteps = [
    {
      label: 'Approve Transfer',
      description: `Ebisu's Bay needs approval to transfer your NFT on your behalf.`,
    },
    {
      label: 'Enter Price',
      description: `Enter the listing price in CRO.`,
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
    if (salePrice && salePrice.length > 0 && salePrice[0] !== '0') {
      setNextEnabled(true);
    } else {
      setNextEnabled(false);
    }
  }, [salePrice]);

  const showListDialog = async () => {
    try {
      const marketContractAddress = marketContract.address;

      const { contract, /*id, image, name,*/ address } = myNftPageListDialog;

      const fees = await marketContract.fee(walletAddress);
      const royalties = await marketContract.royalties(address);

      setFee((fees / 10000) * 100);
      setRoyalty((royalties[1] / 10000) * 100);

      const transferEnabled = await contract.isApprovedForAll(walletAddress, marketContractAddress);

      if (transferEnabled) {
        setListDialogActiveStep(ListDialogStepEnum.EnteringPrice);
      } else {
        setNextEnabled(true);
      }
    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        console.log(error);
        toast.error('Unknown Error');
      }
      setListDialogActiveStep(ListDialogStepEnum.WaitingForTransferApproval);
    }
  };

  const listDialogSetApprovalForAllStep = async () => {
    try {
      const marketContractAddress = marketContract.address;
      const { contract } = myNftPageListDialog;

      const tx = await contract.setApprovalForAll(marketContractAddress, true);
      await tx.wait();

      setNextEnabled(false);
      setListDialogActiveStep(ListDialogStepEnum.EnteringPrice);
    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        console.log(error);
        toast.error('Unknown Error');
      }
      setListDialogActiveStep(ListDialogStepEnum.WaitingForTransferApproval);
    }
  };

  const listDialogConfirmListingStep = async () => {
    const { contract } = myNftPageListDialog;

    const nftId = myNftPageListDialog.id;

    setNextEnabled(false);

    dispatch(
      MyNftPageActions.listingDialogConfirm({
        contractAddress: contract.address,
        nftId,
        salePrice,
        marketContract,
      })
    );
  };

  const cancelList = () => {
    //  TODO: Dialog should more generic
    dispatch(MyNftPageActions.hideMyNftPageListDialog());
    setListDialogActiveStep(ListDialogStepEnum.WaitingForTransferApproval);
    setNextEnabled(false);
    setSalePrice(null);
  };

  const handleNext = () => {
    if (listDialogActiveStep === ListDialogStepEnum.WaitingForTransferApproval) {
      listDialogSetApprovalForAllStep();
    } else if (listDialogActiveStep === ListDialogStepEnum.EnteringPrice) {
      setListDialogActiveStep(ListDialogStepEnum.ConfirmListing);
    } else if (listDialogActiveStep === ListDialogStepEnum.ConfirmListing) {
      listDialogConfirmListingStep();
    }
  };

  const getYouReceiveViewValue = () => {
    const youReceive = salePrice - (fee / 100) * salePrice - (royalty / 100) * salePrice;
    return ethers.utils.commify(youReceive.toFixed(2));
  };

  return (
    <>
      {myNftPageListDialog ? (
        <Dialog onClose={cancelList} open={!!myNftPageListDialog}>
          <DialogContent>
            <DialogTitle>List {myNftPageListDialog.name}</DialogTitle>
            <Grid container spacing={{ sm: 4 }} columns={2}>
              <Grid item xs={2} md={1} key="1">
                <Container>
                  <CardMedia component="img" src={myNftPageListDialog.image} width="150" />
                </Container>
              </Grid>
              <Grid item xs={1} key="2">
                <Stepper activeStep={listDialogActiveStep} orientation="vertical">
                  {listingSteps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel optional={index === 2 ? <Typography variant="caption">Last step</Typography> : null}>
                        {step.label}
                      </StepLabel>
                      <StepContent>
                        <Typography>{step.description}</Typography>
                        {index === 1 ? (
                          <Stack>
                            <TextField
                              sx={{ marginTop: '10px', marginBottom: '10px' }}
                              type="number"
                              label="Price"
                              variant="outlined"
                              onKeyDown={(e) => {
                                if (e.keyCode === 190 || e.keyCode === 110) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={onListingDialogPriceValueChange}
                            />
                            <Typography>
                              <strong>
                                {' '}
                                Buyer pays:{' '}
                                <span style={{ fontSize: '18px' }}>
                                  {salePrice ? ethers.utils.commify(salePrice) : 0}
                                </span>{' '}
                                CRO{' '}
                              </strong>
                            </Typography>
                            <Typography>Service Fee: {fee} %</Typography>
                            <Typography>Royalty Fee: {royalty} %</Typography>
                            <Typography>
                              <strong>
                                {' '}
                                You receive: <span style={{ fontSize: '18px' }}>
                                  {getYouReceiveViewValue()}
                                </span> CRO{' '}
                              </strong>
                            </Typography>
                          </Stack>
                        ) : null}

                        <Box sx={{ mb: 2 }}>
                          <div>
                            <button className="btn-main lead mb-5 mr15" disabled={!nextEnabled} onClick={handleNext}>
                              {!nextEnabled && index !== 1 ? (
                                <span className="d-flex align-items-center">
                                  <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                                  <span className="ps-2">Working...</span>
                                </span>
                              ) : (
                                <>{index === listingSteps.length - 1 ? 'Finish' : 'Continue'}</>
                              )}
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
      ) : null}
    </>
  );
};

export default connect(mapStateToProps)(memo(MyNftListDialog));
