import React, {useState} from 'react';
import { useSelector } from "react-redux";

import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import {ethers} from "ethers";
import config from "../../Assets/networks/rpc_config.json";
import AuctionContract from "../../Contracts/Auction.json";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, humanize} from "../../utils";
import CreateAuction from "../Auctions/CreateAuction";

const GlobalStyles = createGlobalStyle`
`;

const ManageAuctions = () => {
    const user = useSelector((state) => state.user)

    const [nftAddress, setNftAddress] = useState("");
    const [nftId, setNftId] = useState("");
    const [startingBid, setStartingBid] = useState("");
    const [openMenu, setOpenMenu] = React.useState(0);

    const handleBtnClick = (index) => (element) => {
        var elements = document.querySelectorAll('.tab');
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove('active');
        }
        element.target.parentElement.classList.add("active");

        setOpenMenu(index);
        console.log(openMenu, index);
    };

    async function onCreatePressed() {
        let bid = ethers.utils.parseUnits(startingBid);
        let writeContract = await new ethers.Contract(config.auction_contract, AuctionContract.abi, user.provider.getSigner());
        console.log('preparing contract...', nftAddress, nftId, bid);
        try {
            const tx = await writeContract.createAuction(nftAddress, nftId, bid);
            const receipt = await tx.wait();
            toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <GlobalStyles/>

            <section className='jumbotron breadcumb no-bg'
                     style={{backgroundImage: `url(${'/img/background/subheader.jpg'})`}}>
                <div className='mainbreadcumb'>
                    <div className='container'>
                        <div className='row m-10-hor'>
                            <div className='col-12 text-center'>
                                <h1>Auction Management</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container'>

                <div className="de_tab">

                    <ul className="de_nav">
                        <li id='Mainbtn0' className="tab active"><span onClick={handleBtnClick(0)}>Auctions</span></li>
                        <li id='Mainbtn1' className="tab"><span onClick={handleBtnClick(1)}>Create</span></li>
                    </ul>

                    <div className="de_tab_content">

                        {openMenu === 1 &&
                        <CreateAuction />
                        }
                    </div>
                </div>
            </section>

            <Footer/>
        </div>
    );
};
export default ManageAuctions;