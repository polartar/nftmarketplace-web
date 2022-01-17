import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import { createGlobalStyle } from 'styled-components';
import {ethers} from "ethers";
import config from "../../Assets/networks/rpc_config.json";
import AuctionContract from "../../Contracts/Auction.json";
import {toast} from "react-toastify";
import {caseInsensitiveCompare, createSuccessfulTransactionToastContent} from "../../utils";
import {ERC721} from "../../Contracts/Abis";
import {Card, Form, Spinner} from "react-bootstrap";
import {auctionState} from "../../core/api/enums";
import {getAuctionDetails} from "../../GlobalState/auctionSlice";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "../../GlobalState/User";


const BuyerActionBar = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const bidHistory = useSelector((state) => state.auction.bidHistory.filter(i => !i.withdrawn))
    const listing = useSelector((state) => state.auction.auction)

    const isHighestBidder = useSelector((state) => {
        return bidHistory[0] && caseInsensitiveCompare(user.address, bidHistory[0].bidder);
    });
    const [openCheckout, setOpenCheckout] = React.useState(false);

    const showBidDialog = () => async () => {
        setOpenCheckout(true);
    }

    const executeBid = () => async () => {
        setExecutingBid(true);
        await runFunction(async (writeContract) => {
            let bid = ethers.utils.parseUnits(bidAmount.toString());
            console.log('placing bid...', listing.auctionId, listing.auctionHash, bid.toString());
            return (await writeContract.bid(listing.auctionHash, {
                'value' : bid
            })).wait();
        })
        setExecutingBid(false);
    }

    const executeWithdrawBid = () => async () => {
        setExecutingWithdraw(true);
        await runFunction(async (writeContract) => {
            console.log('withdrawing bid...', listing.auctionId, listing.auctionHash);
            return (await writeContract.withdraw(listing.auctionHash)).wait();
        })
        setExecutingWithdraw(false);
    }

    const runFunction = async(fn) => {
        if(user.address){
            try{
                let writeContract = await new ethers.Contract(config.auction_contract, AuctionContract.abi, user.provider.getSigner());
                const receipt = await fn(writeContract)
                toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
                dispatch(getAuctionDetails(listing.id));
            }catch(error){
                if(error.data){
                    toast.error(error.data.message);
                } else if(error.message){
                    toast.error(error.message);
                } else {
                    console.log(error);
                    toast.error("Unknown Error");
                }
            }
        } else{
            if(user.needsOnboard){
                const onboarding = new MetaMaskOnboarding();
                onboarding.startOnboarding();
            } else if(!user.address){
                dispatch(connectAccount());
            } else if(!user.correctChain){
                dispatch(chainConnect());
            }
        }
    }

    const [bidAmount, setBidAmount] = useState(0);
    const [minimumBid, setMinimumBid] = useState(1);
    const [bidError, setBidError] = useState('');
    const [executingBid, setExecutingBid] = useState(false);
    const [executingWithdraw, setExecutingWithdraw] = useState(false);

    const handleChangeBidAmount = (event) => {
        const { value } = event.target;
        const newBid = parseFloat(value);
        setBidAmount(newBid);

        // test if bid is gte than current highest bid
        // const bidIncrement = auctionConfig.bid.increments.find(i => i.min >= listing.highestBid).increment;
        const bidIncrement = 5;
        const minBid = bidIncrement > 0 ? (listing.highestBid + bidIncrement) : (listing.highestBid + 1);
        if(newBid < minBid) {
            setBidError(`Bid must be at least ${minBid} CRO`);
        } else {
            setBidError(false);
        }
    }

    return (
        <>
            <Card className="mb-4 border-1 shadow" style={{color: '#141619', borderColor: '#cdcfcf'}}>
                <Card.Body>
                    <div className="d-flex flex-row justify-content-between">
                        <div className={`my-auto fw-bold ${listing.state !== auctionState.ACTIVE ? 'mx-auto' : ''}`} style={{color:'#000'}}>
                            {listing.state === auctionState.NOT_STARTED &&
                            <>Starting Bid: <span className="fs-3 ms-1">{ethers.utils.commify(listing.highestBid)} CRO</span></>
                            }
                            {listing.state === auctionState.ACTIVE &&
                            <>Current Bid: <span className="fs-3 ms-1">{ethers.utils.commify(listing.highestBid)} CRO</span></>
                            }
                            {listing.state === auctionState.SOLD &&
                            <>AUCTION HAS BEEN SOLD</>
                            }
                            {listing.state === auctionState.CANCELLED &&
                            <>AUCTION HAS BEEN CANCELLED</>
                            }
                        </div>
                        {listing.state === auctionState.ACTIVE &&
                        <>
                            {user.address ?
                                <>
                                    {user.correctChain ?
                                        <>
                                            {listing.state === auctionState.ACTIVE && !isHighestBidder &&
                                            <button className="btn-main lead mr15"
                                                    onClick={showBidDialog()} disabled={executingBid}>
                                                {executingBid ?
                                                    <>
                                                        Placing Bid...
                                                        <Spinner animation="border" role="status" size="sm" className="ms-1">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </Spinner>
                                                    </>
                                                    :
                                                    <>
                                                        Place Bid
                                                    </>
                                                }
                                            </button>
                                            }
                                            {listing.state === auctionState.ACTIVE && isHighestBidder &&
                                            <button className='btn-main lead mr15'
                                                    onClick={executeWithdrawBid()} disabled={executingWithdraw}>
                                                {executingWithdraw ?
                                                    <>
                                                        Withdrawing
                                                        <Spinner animation="border" role="status" size="sm" className="ms-1">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </Spinner>
                                                    </>
                                                    :
                                                    <>
                                                        Withdraw Bid
                                                    </>
                                                }
                                            </button>
                                            }
                                        </>
                                        :
                                        <>
                                            <span className="my-auto">Switch network to bid</span>
                                        </>
                                    }
                                </>
                                :
                                <>
                                    <span className="my-auto">Connect wallet above to place bid</span>
                                </>
                            }
                        </>
                        }
                    </div>
                </Card.Body>
            </Card>
            { openCheckout && user &&
                <div className='checkout'>
                    <div className='maincheckout'>
                        <button className='btn-close' onClick={() => setOpenCheckout(false)}>x</button>
                        <div className='heading'>
                            <h3>Place Bid</h3>
                        </div>
                        <p>Your bid must be at least {listing.highestBid + minimumBid} CRO</p>
                        <div className='heading mt-3'>
                            <p>Your bid (CRO)</p>
                            <div className='subtotal'>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Enter Bid"
                                    onChange={handleChangeBidAmount}
                                />
                            </div>
                        </div>
                        {bidError &&
                        <div
                            className='error'
                            style={{
                                color: 'red',
                                marginLeft: '5px',
                            }}
                        >
                            {bidError}
                        </div>
                        }
                        <button className='btn-main lead mb-5' onClick={executeBid()} disabled={!!bidError}>Confirm Bid</button>
                    </div>
                </div>
            }
        </>
    );
};
export default BuyerActionBar;