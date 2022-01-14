import React, { useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';
import { createGlobalStyle } from 'styled-components';
import { keyframes } from "@emotion/react";
import Reveal from 'react-awesome-reveal';
import {useParams} from "react-router-dom";
import {Form, Spinner} from "react-bootstrap";
import config from '../../Assets/networks/rpc_config.json'
import { connectAccount } from '../../GlobalState/User'
import { fetchMemberInfo } from '../../GlobalState/Memberships'
import { fetchCronieInfo } from '../../GlobalState/Cronies'
import { ethers} from 'ethers'
import {useSelector, useDispatch} from 'react-redux'
import {toast} from "react-toastify";
import Countdown from 'react-countdown';
import { getAnalytics, logEvent } from '@firebase/analytics'
import { createSuccessfulTransactionToastContent, getShortIdForView } from "../../utils";
import MintButton from "../Drop/MintButton";
import CrougarsWl from '../../Assets/crougars_wl.txt';
import {ERC721} from "../../Contracts/Abis";
export const drops = config.drops;

const GlobalStyles = createGlobalStyle`
.jumbotron.tint{
  background-color: rgba(0,0,0,0.6);
  background-blend-mode: multiply;
}
`;

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;
const inline = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
  .d-inline{
    display: inline-block;
   }
`;

const statuses = {
    UNSET: -1,
    NOT_STARTED: 0,
    LIVE: 1,
    EXPIRED: 2,
    SOLD_OUT: 3
}

const Drop = () => {
    const {slug} = useParams();

    const readProvider = new ethers.providers.JsonRpcProvider(config.read_rpc);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [minting, setMinting] = useState(false);
    const [referral, setReferral] = useState("");
    const [dropObject, setDropObject] = useState(null);
    const [status, setStatus] = useState(statuses.UNSET);
    const [numToMint, setNumToMint] = useState(1);

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'drop',
            drop_id: slug
        })
    }, []);

    useEffect(() => {
        dispatch(fetchMemberInfo());
        dispatch(fetchCronieInfo());
    }, []);

    const user = useSelector((state) => {
        return state.user;
    });

    const drop = useSelector((state) => {
        return drops.find(n => n.slug === slug);
    });

    const membership = useSelector((state)=>{
        return state.memberships;
    });

    const cronies = useSelector((state)=>{
        return state.cronies;
    });

    useEffect(async() => {
        setDropObject(drop);
        let currentDrop = drop;
        if (user.provider) {
            try {
                let writeContract = await new ethers.Contract(currentDrop.address, currentDrop.abi, user.provider.getSigner());
                currentDrop = Object.assign({writeContract: writeContract}, currentDrop);
            } catch(error) {
                console.log(error);
            }
        }
        try {
            if (!isFounderDrop(currentDrop.address) && !isCroniesDrop(currentDrop.address)) {
                let readContract = await new ethers.Contract(currentDrop.address, currentDrop.abi, readProvider);
                currentDrop = Object.assign({currentSupply: (await readContract.totalSupply()).toString()}, currentDrop);
            }
        } catch(error) {
            console.log(error);
        }
        calculateStatus(currentDrop);
        setLoading(false);
        setDropObject(currentDrop);
    }, [user]);

    useEffect(() => {
        if (dropObject) {
            if (isFounderDrop(dropObject.address)) {
                setDropObject(Object.assign({currentSupply: membership.founders.count}, dropObject));
            }
            if (isCroniesDrop(dropObject.address)) {
                setDropObject(Object.assign({currentSupply: cronies.count}, dropObject));
            }
        }
    }, [membership, user, cronies])

    // @todo refactor out
    const isCroniesDrop = (address) => {
        const croniesDrop = drops.find(d => d.slug === 'cronies');
        return croniesDrop.address === address;
    }
    // @todo refactor out
    const isFounderDrop = (address) => {
        const croniesDrop = drops.find(d => d.slug === 'founding-member');
        return croniesDrop.address === address;
    }

    const calculateStatus = (drop) => {
        const sTime = new Date(drop.start);
        const eTime = new Date(drop.end);
        const now = new Date();

        if (sTime > now) setStatus(statuses.NOT_STARTED);
        else if (drop.currentSupply >= drop.totalSupply &&
            !isCroniesDrop(drop.address) &&
            !isFounderDrop(drop.address)
        ) setStatus(statuses.SOLD_OUT)
        else if (!drop.end || eTime > now) setStatus(statuses.LIVE)
        else if (drop.end && eTime < now) setStatus(statuses.EXPIRED);
        else setStatus(statuses.NOT_STARTED);
    }

    const handleChangeReferralCode = (event) => {
        const { value } = event.target;
        setReferral(value);
    }

    const isEligibleForMemberPrice = async (user) => {
        if(user.isMember){
            return true;
        } else {
            if (drop.slug === 'crougars') {
                return crougarsEligibilityCheck(user);
            }
            return false;
        }
    }

    const crougarsEligibilityCheck = async (user) => {
        let isWhiteListed = false;
        try {
            await fetch(CrougarsWl)
                .then(r => r.text())
                .then(text => {
                    const addresses =  text
                        .replace(/['"]+/g, '')
                        .split(",\r\n");
                    isWhiteListed = addresses.map(a => a.toLowerCase()).includes(user.address.toLowerCase());
                })
        } catch (error) {
            console.log('Error while checking CROugars whitelist', error);
        }

        // If there was an error retrieving loot balance on wallet connect, then do a final attempt to retrieve it
        let lootBalance = user.lootBalance;
        if (!lootBalance && user.provider) {
            try {
                const lootContract = new ethers.Contract(config.known_tokens.loot.address, ERC721, user.provider.getSigner());
                lootBalance = ethers.utils.formatEther(await lootContract.balanceOf(user.address));
            } catch (error) {
                lootBalance = 0;
                console.log('Error while doing a final check for LOOT balance', error);
            }
        } else if (!user.provider) lootBalance = 0;

        return lootBalance >= 1000000 || isWhiteListed;
    }

    const mintNow = async() => {
        if(user.address){
            setMinting(true);
            const contract = dropObject.writeContract;
            try{
                const memberCost = ethers.utils.parseEther(dropObject.memberCost);
                const regCost = ethers.utils.parseEther(dropObject.cost);
                let cost;
                if(await isEligibleForMemberPrice(user)){
                    cost = memberCost;
                } else {
                    cost = regCost;
                }
                let finalCost = cost.mul(numToMint);
                let extra = {
                    'value' : finalCost
                };
                if (dropObject.is1155) {
                    var response;

                    if (dropObject.title === "Founding Member") {
                        console.log(referral);
                        if(referral){
                            finalCost = finalCost.sub(ethers.utils.parseEther('10.0').mul(numToMint));
                            extra = {
                                'value' : finalCost
                            };
                        };
                        const ref32 = ethers.utils.formatBytes32String(referral);
                        response = await contract.mint(1, numToMint, ref32, extra);
                    } else {
                        // Cronie

                        const gas = String(900015 * numToMint);
                        response = await contract.mint(numToMint, extra);
                    }
                } else {
                    let method;
                    for (const abiMethod of dropObject.abi) {
                        if (abiMethod.includes("mint")) method = abiMethod;
                    }
                    var response;
                    if (method.includes("address") && method.includes("uint256")) {
                        response = await contract.mint(user.address, numToMint, extra);
                    } else {
                        console.log(`contract ${contract}  num: ${numToMint}   extra ${extra}`)
                        response = await contract.mint(numToMint, extra);
                    }
                    const receipt = await response.wait();
                    toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
                    const anParam = {
                        currency : 'CRO',
                        value : ethers.utils.formatEther(finalCost),
                        quantity : numToMint,
                        items: [dropObject.title]
                    };
                    logEvent(getAnalytics(), 'purchase', anParam);
                }
            }catch(error){
                if(error.data){
                    console.log(error);
                    toast.error(error.data.message);
                } else if(error.message){
                    console.log(error);
                    toast.error(error.message);
                } else {
                    console.log(error);
                    toast.error("Unknown Error");
                }
            }finally{
                setMinting(false);
            }
        } else {
            dispatch(connectAccount());
        }
    };

    const convertTime = (time) => {
        let date = new Date(time);
        const fullDateString = date.toLocaleString('default', {timeZone: 'UTC'});
        const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
        let dateString = `${fullDateString.split(", ")[1]} ${date.getUTCDate()} ${month} ${date.getUTCFullYear()} UTC`
        return dateString
    }

    return (
        <div>
            <GlobalStyles/>
            <>
                <section className={`jumbotron breadcumb h-vh tint`} style={{backgroundImage: `url(${drop.imgBanner ? drop.imgBanner : '/img/background/Ebisus-bg-1_L.jpg'})`}}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <div className="spacer-single"></div>
                                <div className="spacer-double"></div>

                                {status === statuses.LIVE && drop.end &&
                                <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                                    <p className="lead col-white">
                                        Ends in: <Countdown date={drop.end}/>
                                    </p>
                                </Reveal>
                                }
                                {status === statuses.NOT_STARTED &&
                                <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                                    <h4 className="col-white">
                                        Starts in: <span className="text-uppercase color"><Countdown date={drop.start}/></span>
                                    </h4>
                                </Reveal>
                                }
                                <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                                    <h1 className="col-white">{drop.title}</h1>
                                </Reveal>
                                <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                                    <p className="lead col-white">{drop.subtitle}</p>
                                </Reveal>
                                {drop.foundersOnly &&
                                <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                                    <h1 className="col-white">{drop.title}</h1>
                                    {drop.foundersOnly &&
                                    <h3 className="col-white">Founding Member Presale</h3>
                                    }
                                </Reveal>
                                }
                                {status === statuses.LIVE &&
                                <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                                    <MintButton
                                        mintCallback={mintNow}
                                        numToMint={numToMint}
                                        title="Mint Now" />
                                </Reveal>
                                }
                                <div className="spacer-10"></div>
                            </div>
                        </div>
                    </div>
                </section>


                <section className='container no-bottom'>
                    <div className='row'>
                        <div className="col-md-12">
                            <div className="d_profile de-flex">
                                <div className="de-flex-col">
                                    <div className="profile_avatar">
                                        {drop.imgAvatar &&
                                            <img src={drop.imgAvatar} alt=""/>
                                        }
                                        <div className="profile_name">
                                            <h4>
                                                {drop.author.name}
                                                {drop.author.link &&
                                                <span className="profile_username">
                                                        <a href={drop.author.link} target="_blank">View Website</a>
                                                    </span>
                                                }
                                            </h4>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                <section className='container no-top'>
                    <div className='row mt-md-5 pt-md-4'>
                        <div className="col-md-6 text-center">
                            <img src={drop.imgNft} className="img-fluid img-rounded mb-sm-30" alt=""/>
                        </div>
                        <div className="col-md-6">
                            <div className="item_info">
                                <h2>{drop.title}</h2>
                                <div className="item_info_counts">
                                    <div
                                        className="item_info_type">{dropObject?.currentSupply}/{dropObject?.totalSupply} minted
                                    </div>
                                </div>
                                <p>{drop.description}</p>

                                {drop.disclaimer &&
                                    <p className="fw-bold text-center my-4" style={{color:'black'}}>{drop.disclaimer}</p>
                                }

                                <div className="d-flex flex-row">
                                    <div className="me-4">
                                        <h6 className="mb-1">Mint Price</h6>
                                        <h5>{dropObject?.cost} CRO</h5>
                                    </div>
                                    {(dropObject?.cost !== dropObject?.memberCost) &&
                                    <div>
                                        <h6 className="mb-1">Founding Member Price</h6>
                                        <h5>{dropObject?.memberCost} CRO</h5>
                                    </div>
                                    }
                                </div>

                                <div className="spacer-40"></div>

                                {drop.end &&
                                <div className="me-4">
                                    <h6 className="mb-1">
                                        {status === statuses.EXPIRED ?
                                            <>
                                                Minting Ended
                                            </>
                                            :
                                            <>
                                                Minting Ends
                                            </>
                                        }

                                    </h6>
                                    <h3>{convertTime(drop.end)}</h3>
                                </div>
                                }
                                {status === statuses.LIVE &&
                                    <>
                                        {drop.maxMintPerTx > 1 &&
                                            <div>
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Range value={numToMint} min="1" max={drop.maxMintPerTx}
                                                            onChange={e => setNumToMint(e.target.value)}/>
                                            </div>
                                        }
                                        {dropObject?.referral &&
                                            <Form.Group className="mb-3" controlId="formReferralCode">
                                                <Form.Label>Referral Code</Form.Label>
                                                <Form.Control onChange={handleChangeReferralCode} type="text"
                                                              placeholder="Enter Referral Code"/>
                                                <Form.Text className="text-muted"/>
                                            </Form.Group>
                                        }
                                        <div className="d-flex flex-row mt-5">
                                            <MintButton
                                                mintCallback={mintNow}
                                                maxMintPerTx={drop.maxMintPerTx}
                                                numToMint={numToMint} />
                                        </div>
                                    </>
                                }
                                {status === statuses.SOLD_OUT &&
                                <p className="mt-5">MINT HAS SOLD OUT</p>
                                }
                                {status === statuses.EXPIRED &&
                                    <p className="mt-5">MINT HAS ENDED</p>
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </>
            <Footer/>

        </div>
    );
};
export default Drop;
