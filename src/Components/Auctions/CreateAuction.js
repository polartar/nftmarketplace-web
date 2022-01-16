import React, {useState} from 'react';
import { useSelector } from "react-redux";

import { createGlobalStyle } from 'styled-components';
import {ethers} from "ethers";
import config from "../../Assets/networks/rpc_config.json";
import AuctionContract from "../../Contracts/Auction.json";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "../../utils";

const GlobalStyles = createGlobalStyle`
`;

const CreateAuction = () => {
    const user = useSelector((state) => state.user)

    const [nftAddress, setNftAddress] = useState("");
    const [nftId, setNftId] = useState("");
    const [startingBid, setStartingBid] = useState("");

    async function onCreatePressed() {
        let bid = ethers.utils.parseUnits(startingBid);
        let writeContract = await new ethers.Contract(config.auction_contract, AuctionContract.abi, user.provider.getSigner());
        console.log('writing...', nftAddress, nftId, bid);
        try {
            const tx = await writeContract.createAuction(nftAddress, nftId, bid);
            const receipt = await tx.wait();
            toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        } catch (error) {
            if(error.data){
                toast.error(error.data.message);
            } else if(error.message){
                toast.error(error.message);
            } else {
                console.log(error);
                toast.error("Unknown Error");
            }
        }
    }

    return (
        <div>
            <div className='row'>
                <div className='col-lg-12'>
                    <h1>Create an Auction</h1>
                </div>
            </div>
            <div>

                <form>
                    <h2>Contract Address: </h2>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="e.g. 0x3D483b8b288c53a123f1e9DAf29ec2B5Ab18e528"
                        onChange={(event) => setNftAddress(event.target.value)}
                    />
                    <h2>NFT ID: </h2>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="e.g. 1"
                        onChange={(event) => setNftId(event.target.value)}
                    />
                    <h2>Starting Bid (CRO): </h2>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="e.g. 10 CRO"
                        onChange={(event) => setStartingBid(event.target.value)}
                    />
                </form>
                <br />
                <button id="mintButton" className="btn-main" onClick={onCreatePressed}>
                    Create
                </button>
            </div>
        </div>
    );
};
export default CreateAuction;