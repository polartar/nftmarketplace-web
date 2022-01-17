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


const SellerActionBar = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [executingStart, setExecutingStart] = useState(false);
    const [executingCancel, setExecutingCancel] = useState(false);
    const listing = useSelector((state) => state.auction.auction)

    const executeStartAuction = () => async () => {
        setExecutingStart(true);
        await runFunction(async (writeContract) => {
            console.log('starting auction...', listing.auctionId, listing.auctionHash);
            return (await writeContract.start(listing.auctionHash)).wait();
        })
        setExecutingStart(false);
    }

    const executeCancelAuction = () => async () => {
        setExecutingCancel(true);
        await runFunction(async (writeContract) => {
            console.log('cancelling auction...', listing.auctionId, listing.auctionHash);
            return (await writeContract.cancel(listing.auctionHash)).wait();
        })
        setExecutingCancel(false);
    }

    const executeIncreaseAuctionTime = (minutes) => async () => {
        await runFunction(async (writeContract) => {
            console.log(`adding ${minutes}m to the auction time...`, listing.auctionId, listing.auctionHash);
            return (await writeContract.updateRuntime(listing.auctionHash, minutes)).wait();
        })
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

    const hasEnded = new Date(listing.endsAt) < Date.now();
    const awaitingAcceptance = hasEnded
    return (
        <div className="mt-4">
            <h4>Seller Options</h4>
            <div className="d-flex flex-row justify-content-between">
                {user.address ?
                    <>
                        {listing.state === auctionState.NOT_STARTED &&
                        <button className='btn-main lead mb-5 mr15'
                                onClick={executeStartAuction()} disabled={executingStart}>
                            {executingStart ?
                                <>
                                    Starting
                                    <Spinner animation="border" role="status" size="sm" className="ms-1">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </>
                                :
                                <>
                                    Start Auction
                                </>
                            }
                        </button>
                        }
                        {listing.state === auctionState.ACTIVE &&
                        <>
                            <button className='btn-main lead mb-5 mr15'
                                    onClick={executeCancelAuction()} disabled={executingCancel}>
                                {executingCancel ?
                                    <>
                                        Cancelling
                                        <Spinner animation="border" role="status" size="sm" className="ms-1">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </>
                                    :
                                    <>
                                        Cancel
                                    </>
                                }
                            </button>
                            <button className='btn-main lead mb-5 mr15'
                                    onClick={executeIncreaseAuctionTime(5)}>Increase Time (5m)
                            </button>
                        </>
                        }
                        {listing.state === auctionState.ACTIVE && hasEnded &&
                        <button className='btn-main lead mb-5 mr15'>Accept Bid
                        </button>
                        }
                    </>
                    :
                    <>
                        <span>Connect wallet above to manage auction</span>
                    </>
                }
            </div>
        </div>
    )
};
export default SellerActionBar;