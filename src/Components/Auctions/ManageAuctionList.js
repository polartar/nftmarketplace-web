import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {ethers} from "ethers";
import config from "../../Assets/networks/rpc_config.json";
import AuctionContract from "../../Contracts/Auction.json";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "../../utils";
import AuctionCard from "../components/AuctionCard";
import {sortAndFetchAuctions} from "../../core/api";
import Clock from "../components/Clock";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "../../GlobalState/User";

const ManageAuctionList = () => {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user)
    const [auctions, setAuctions] = useState([]);

    useEffect(async () => {
        const response = await sortAndFetchAuctions(0);
        setAuctions(response.auctions)
    }, []);

    const handleStartClick = (auction) => async () => {
        if(user.address) {
            let writeContract = await new ethers.Contract(config.auction_contract, AuctionContract.abi, user.provider.getSigner());
            console.log('starting auction...', auction);
            try {
                const tx = await writeContract.start(auction.auctionHash);
                const receipt = await tx.wait();
                toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
            } catch (error) {
                console.log(error);
            }
        } else {
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

    const handleCancelClick = (auction) => async () => {
        if(user.address) {
            let writeContract = await new ethers.Contract(config.auction_contract, AuctionContract.abi, user.provider.getSigner());
            console.log('cancelling auction...', auction);
            try {
                const tx = await writeContract.cancel(auction.auctionHash);
                const receipt = await tx.wait();
                toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
            } catch (error) {
                console.log(error);
            }
        } else {
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

    return (
        <div>
            <div className='card-group'>
                {auctions && auctions.map( (auction, index) => (
                    <div key={index} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                        <div className="card eb-nft__card h-100 shadow">
                            <img src={auction.nft.image} className={`card-img-top marketplace`} />
                            {auction.nft.rank ?
                                <div className="badge bg-rarity text-wrap mt-1 mx-1">
                                    Rank: #{auction.nft.rank}
                                </div>
                                :
                                <div className="badge bg-rarity-none text-wrap mt-1 mx-1">
                                    Rank: N/A
                                </div>
                            }
                            <div className="eb-de_countdown text-center">
                                Ends In: <Clock deadline={auction.endAt} />
                            </div>
                            <div className="card-body d-flex flex-column">
                                <h6 className="card-title mt-auto">{auction.nft.name}</h6>
                                <p className="card-text">
                                    {ethers.utils.commify(auction.highestBid)} CRO <br/>
                                    State: {auction.state}
                                </p>
                            </div>
                            <div className="card-footer d-flex justify-content-between">
                                <button className="btn-main lead mr15" onClick={handleStartClick(auction)}>Start</button>
                                <button className="btn-main lead mr15" onClick={handleCancelClick(auction)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ManageAuctionList;