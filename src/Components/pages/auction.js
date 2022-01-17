import React, { memo, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';
import {getAuctionDetails, auctionUpdated} from "../../GlobalState/auctionSlice";
import {
    caseInsensitiveCompare,
    createSuccessfulTransactionToastContent,
    humanize,
    shortAddress,
    timeSince
} from "../../utils";
import {useParams, Link} from "react-router-dom";
import {ethers} from "ethers";
import MetaMaskOnboarding from '@metamask/onboarding';
import { connectAccount, chainConnect } from '../../GlobalState/User'
import {Card, Form, Spinner} from "react-bootstrap"
import { toast } from 'react-toastify';
import Blockies from "react-blockies";
import config from "../../Assets/networks/rpc_config.json";
import AuctionContract from '../../Contracts/Auction.json'
import {auctionState} from "../../core/api/enums";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCircle, faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import LayeredIcon from "../components/LayeredIcon";
const knownContracts = config.known_contracts;

const GlobalStyles = createGlobalStyle`
`;

const VerifiedIcon = styled.span`
  font-size: 8px;
  color: #ffffff;
  background: $color;
  border-radius: 100%;
  -moz-border-radius: 100%;
  -webkit-border-radius: 100%;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
`;

const Auction = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const listing = useSelector((state) => state.auction.auction)
    const history = useSelector((state) =>
        state.listing.history
            .filter(i => i.state === 1)
            .sort((a, b) => (a.saleTime < b.saleTime) ? 1 : -1)
    )
    const bidHistory = useSelector((state) =>
        state.auction.bidHistory
            .filter(i => !i.withdrawn)
    )
    const powertraits = useSelector((state) => state.auction.powertraits)
    const isLoading = useSelector((state) => state.auction.loading)
    const user = useSelector((state) => state.user)

    const collectionMetadata = useSelector((state) => {
        return knownContracts.find(c => c.address.toLowerCase() === listing?.nftAddress.toLowerCase())?.metadata;
    });
    const collectionName = useSelector((state) => {
        return knownContracts.find(c => c.address.toLowerCase() === listing?.nftAddress.toLowerCase())?.name;
    });

    const [openCheckout, setOpenCheckout] = React.useState(false);
    const [buying, setBuying] = useState(false);

    useEffect(() => {
        dispatch(getAuctionDetails(id));
    }, [dispatch, id]);

    const fullImage = () => {
        if (listing.nft.original_image.startsWith('ipfs://')) {
            const link = listing.nft.original_image.split('://')[1];
            return `https://ipfs.io/ipfs/${link}`;
        }

        return listing.nft.original_image;
    }

    const [openMenu, setOpenMenu] = React.useState(0);
    const handleBtnClick = (index) => (element) => {
        var elements = document.querySelectorAll('.tab');
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove('active');
        }
        element.target.parentElement.classList.add("active");

        setOpenMenu(index);
    };

    const [bidAmount, setBidAmount] = useState(0);
    const [minimumBid, setMinimumBid] = useState(1);
    const [bidError, setBidError] = useState('');

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

        // // calculated total cost and compare to user balance
        // if(newBid > user.balance) {
        //     setBidError('Not enough balance to bid');
        // } else {
        //     setBidError('');
        // }
    }

    const showBidDialog = () => async () => {
        setOpenCheckout(true);
    }

    const executeBid = () => async () => {
        await runFunction(async (writeContract) => {
            let bid = ethers.utils.parseUnits(bidAmount.toString());
            console.log('placing bid...', listing.auctionId, listing.auctionHash, bid.toString());
            return await writeContract.bid(listing.auctionHash, {
                'value' : bid
            });
        })
    }

    const executeWithdrawBid = () => async () => {
        await runFunction(async (writeContract) => {
            console.log('withdrawing bid...', listing.auctionId, listing.auctionHash);
            return await writeContract.withdraw(listing.auctionHash);
        })
    }

    const executeStartAuction = () => async () => {
        await runFunction(async (writeContract) => {
            console.log('starting auction...', listing.auctionId, listing.auctionHash);
            return await writeContract.start(listing.auctionHash);
        })
    }

    const executeCancelAuction = () => async () => {
        await runFunction(async (writeContract) => {
            console.log('cancelling auction...', listing.auctionId, listing.auctionHash);
            return await writeContract.cancel(listing.auctionHash);
        })
    }

    const executeIncreaseAuctionTime = (minutes) => async () => {
        await runFunction(async (writeContract) => {
            console.log(`adding ${minutes}m to the auction time...`, listing.auctionId, listing.auctionHash);
            return await writeContract.updateRuntime(listing.auctionHash, minutes);
        })
    }

    const runFunction = async(fn) => {
        if(user.address){
            try{
                let writeContract = await new ethers.Contract(config.auction_contract, AuctionContract.abi, user.provider.getSigner());
                const receipt = (await fn(writeContract)).wait();
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

    const BuyerButtons = (props) => {
        const isHighestBidder = bidHistory[0] && caseInsensitiveCompare(user.address, bidHistory[0].bidder);
        return (
            <Card className="mb-4 border-1 shadow" style={{color: '#141619', borderColor: '#cdcfcf'}}>
                <Card.Body>
                    <div className="d-flex flex-row justify-content-between">
                        <div className="my-auto fw-bold" style={{color:'#000'}}>
                            {listing.state === auctionState.NOT_STARTED ?
                                <>
                                    Starting Bid:
                                </>
                                :
                                <>
                                    Current Bid:
                                </>
                            }
                            <span className="fs-3 ms-1">0.5 CRO</span>
                        </div>
                        {user.address ?
                            <>
                                {user.correctChain ?
                                    <>
                                        {listing.state === auctionState.ACTIVE && !isHighestBidder &&
                                            <button className="btn-main lead mr15"
                                                    onClick={showBidDialog()}>Place Bid
                                            </button>
                                        }
                                        {listing.state === auctionState.ACTIVE && isHighestBidder &&
                                            <button className='btn-main lead mr15'
                                                    onClick={executeWithdrawBid()}>Withdraw Bid
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
                    </div>
                </Card.Body>
            </Card>
        );
    };

    const SellerButtons = (props) => {
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
                                        onClick={executeStartAuction()}>Start Auction
                                </button>
                            }
                            {listing.state === auctionState.ACTIVE &&
                                <>
                                    <button className='btn-main lead mb-5 mr15'
                                            onClick={executeCancelAuction()}>Cancel
                                    </button>
                                    <button className='btn-main lead mb-5 mr15'
                                            onClick={executeIncreaseAuctionTime(5)}>Increase Time (5m)
                                    </button>
                                </>
                            }
                            {listing.state === auctionState.ACTIVE && hasEnded &&
                                <button className='btn-main lead mb-5 mr15'
                                        onClick={showBidDialog()}>Accept Bid
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

    return (
        <div>
            <GlobalStyles/>
            {isLoading ?
                <section className='container'>
                    <div className='row mt-4'>
                        <div className='col-lg-12 text-center'>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    </div>
                </section>
                :
                <section className='container'>
                    <div className='row mt-md-5 pt-md-4'>
                        <div className="col-md-6 text-center">
                            {listing &&
                                <>
                                    <img src={listing.nft.image} className="img-fluid img-rounded mb-sm-30" alt=""/>
                                    {listing.nft.original_image &&
                                        <div className="nft__item_action mt-2" style={{cursor: 'pointer'}}>
                                            <span onClick={() => window.open(fullImage(), "_blank")}>
                                                <span className='p-2'>View Full Image</span>
                                                <FontAwesomeIcon icon={faExternalLinkAlt} />
                                            </span>
                                        </div>
                                    }

                                    {caseInsensitiveCompare(user.address, listing.seller) &&
                                        <SellerButtons state={listing.state} />
                                    }
                                </>
                            }

                        </div>
                        <div className="col-md-6">
                            {listing &&
                            <div className="item_info">
                                <h2>{listing.nft.name}</h2>
                                <p>{listing.nft.description}</p>
                                <div className="row">
                                    <BuyerButtons />
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <h6>Seller</h6>
                                        <div className="item_author">
                                            <Link to={`/seller/${listing.seller}`}>
                                                <div className="author_list_pp">
                                                    <span>
                                                        <Blockies seed={listing.seller} size={10} scale={5}/>
                                                    </span>
                                                </div>
                                                <div className="author_list_info">
                                                    <span>{`${listing.seller.substring(0, 4)}...${listing.seller.substring(listing.seller.length-3, listing.seller.length)}`}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <h6>Collection</h6>
                                        <div className="item_author">
                                            <Link to={`/collection/${listing.nftAddress}`}>
                                                <div className="author_list_pp">
                                                    <span>
                                                            {collectionMetadata?.avatar ?
                                                                <img className="lazy" src={collectionMetadata.avatar} alt=""/>
                                                                :
                                                                <Blockies seed={listing.nftAddress} size={10} scale={5}/>
                                                            }
                                                            {collectionMetadata?.verified &&
                                                                <VerifiedIcon>
                                                                    <LayeredIcon
                                                                        icon={faCheck}
                                                                        bgIcon={faCircle}
                                                                    />
                                                                </VerifiedIcon>
                                                            }
                                                    </span>
                                                </div>
                                                <div className="author_list_info">
                                                    <span>{collectionName ?? "View Collection"}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    {(typeof listing.nft.rank !== 'undefined' && listing.nft.rank !== null) &&
                                        <div className="col">
                                            {collectionMetadata?.rarity ?
                                                <h6>{humanize(collectionMetadata.rarity)} Rank</h6>
                                                :
                                                <h6>Rarity Rank</h6>
                                            }
                                            <div className="item_author">
                                                <div className="author_list_info">
                                                    <span>{listing.nft.rank}</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>

                                <div className="spacer-40"></div>

                                <div className="de_tab">

                                    <ul className="de_nav">
                                        <li id='Mainbtn0' className="tab active"><span onClick={handleBtnClick(0)}>Details</span></li>
                                        {powertraits && powertraits.length > 0 &&
                                            <li id='Mainbtn1' className="tab">
                                                <span onClick={handleBtnClick(1)}>In-Game Attributes</span>
                                            </li>
                                        }
                                        <li id='Mainbtn2' className="tab"><span onClick={handleBtnClick(2)}>Bids</span></li>
                                        <li id='Mainbtn3' className="tab"><span onClick={handleBtnClick(3)}>History</span></li>
                                    </ul>

                                    <div className="de_tab_content">

                                        {openMenu === 0 &&
                                            <div className="tab-1 onStep fadeIn">
                                                {listing.nft.attributes && listing.nft.attributes.length > 0 ?
                                                    <>
                                                        <div className="d-block mb-3">
                                                            <div className="row mt-5 gx-3 gy-2">
                                                                {listing.nft.attributes.map((data, i) => {
                                                                    return (
                                                                        <div key={i} className="col-lg-4 col-md-6 col-sm-6">
                                                                            <div className="nft_attr">
                                                                                <h5>{humanize(data.trait_type)}</h5>
                                                                                <h4>{humanize(data.value)}</h4>
                                                                                {data.occurrence ? (
                                                                                        <span>{Math.round(data.occurrence * 100)}% have this trait</span>
                                                                                    )
                                                                                    :
                                                                                    data.percent && (
                                                                                        <span>{data.percent}% have this trait</span>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <span>No traits found for this item</span>
                                                    </>
                                                }
                                            </div>
                                        }
                                        {openMenu === 1 &&
                                            <div className="tab-2 onStep fadeIn">
                                                {powertraits && powertraits.length > 0 ?
                                                    <>
                                                        <div className="d-block mb-3">
                                                            <div className="row mt-5 gx-3 gy-2">
                                                                {powertraits.map((data, i) => {
                                                                    return (
                                                                        <div key={i} className="col-lg-4 col-md-6 col-sm-6">
                                                                            <div className="nft_attr">
                                                                                <h5>{data.trait_type}</h5>
                                                                                <h4>
                                                                                    {data.value > 0 ?
                                                                                        <>+ {data.value}</>
                                                                                    :
                                                                                        <>{data.value}</>
                                                                                    }
                                                                                </h4>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <span>No in-game attributes found for this item</span>
                                                    </>
                                                }
                                            </div>
                                        }
                                        {openMenu === 2 &&
                                            <div className="tab-3 onStep fadeIn">
                                            {bidHistory && bidHistory.length > 0 ?
                                                <>
                                                    {bidHistory.map((item, index) => (
                                                        <div className="p_list" key={index}>
                                                            <Link to={`/seller/${item.bidder}`}>
                                                                <div className="p_list_pp">
                                                                    <span>
                                                                        <span>
                                                                            <Blockies seed={item.bidder} size={10}
                                                                                      scale={5}/>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </Link>
                                                            <div className="p_list_info">
                                                                <b><Link to={`/seller/${item.bidder}`}>{shortAddress(item.bidder)}</Link></b> bid <b>{ethers.utils.commify(item.price)} CRO</b>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                                :
                                                <>
                                                    <span>No bids have been placed yet</span>
                                                </>
                                            }

                                        </div>
                                        }
                                        {openMenu === 3 &&
                                        <div className="tab-4 onStep fadeIn">
                                            {history && history.length > 0 ?
                                                <>
                                                    {history.map((item, index) => (
                                                        <div className="p_list" key={index}>
                                                            <Link to={`/seller/${item.purchaser}`}>
                                                                <div className="p_list_pp">
                                                                    <span>
                                                                        <span>
                                                                            <Blockies seed={item.purchaser} size={10}
                                                                                      scale={5}/>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </Link>
                                                            <div className="p_list_info">
                                                                <span>{timeSince(item.saleTime + "000")} ago</span>
                                                                Bought by <b><Link to={`/seller/${item.purchaser}`}>{shortAddress(item.purchaser)}</Link></b> for <b>{ethers.utils.commify(item.price)} CRO</b>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                                :
                                                <>
                                                    <span>No history found for this item</span>
                                                </>
                                            }

                                        </div>
                                        }

                                        {listing.state === auctionState.SOLD_OR_CANCELLED &&
                                            <div className="mt-5">
                                                AUCTION HAS BEEN SOLD
                                            </div>
                                        }
                                        {listing.state === auctionState.CANCELLED &&
                                            <div className="mt-5">
                                                AUCTION HAS BEEN CANCELLED
                                            </div>
                                        }
                                        {listing.state === auctionState.NOT_STARTED &&
                                            <div className="mt-5">
                                                AUCTION HAS NOT STARTED
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </section>
            }

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

        </div>
    );
}

export default memo(Auction);
