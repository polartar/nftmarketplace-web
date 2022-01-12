import React, {useEffect, useState} from 'react';
import { useSelector } from "react-redux";

import {ethers} from "ethers";
import config from "../../Assets/networks/rpc_config.json";
import AuctionContract from "../../Contracts/Auction.json";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "../../utils";
import AuctionCard from "../components/AuctionCard";

const ManageAuctionList = () => {
    const user = useSelector((state) => state.user)

    useEffect(() => {

    });

    return (
        <div>
            <div className='card-group'>
                {listings && listings.map( (listing, index) => (
                    <div key={index} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                        <AuctionCard
                            listing={listing}
                            imgClass="marketplace"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ManageAuctionList;