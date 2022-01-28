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
import {
    createSuccessfulTransactionToastContent, isCrognomesDrop,
    isCroniesDrop,
    isFounderDrop,
    newlineText
} from "../../utils";
import MintButton from "../Drop/MintButton";
import {dropState as statuses} from "../../core/api/enums";
import ReactPlayer from 'react-player'
import nft from "./nft";
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

    const [abi, setAbi] = useState(null);
    const [maxMintPerAddress, setMaxMintPerAddress] = useState(0);
    const [maxMintPerTx, setMaxMintPerTx] = useState(0);
    const [maxSupply, setMaxSupply] = useState(0);
    const [memberCost, setMemberCost] = useState(0);
    const [regularCost, setRegularCost] = useState(0);
    const [whitelistCost, setWhitelistCost] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [canMintQuantity, setCanMintQuantity] = useState(0);

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
        await retrieveDropInfo();
    }, [user, membership, cronies]);

    const retrieveDropInfo = async () => {
        setDropObject(drop);
        calculateStatus(drop);
        let currentDrop = drop;

        // Don't do any contract stuff if the drop does not have an address
        if (!drop.address) {
            currentDrop = Object.assign({currentSupply: 0}, currentDrop);
            setDropObject(currentDrop);
            return;
        }

        // Use the new contract format if applicable
        let abi = currentDrop.abi;
        if (isOnNewContract(abi)) {
            const abiJson = require(`../../Assets/abis/${currentDrop.abi}`);
            abi = abiJson.abi;
        }
        setAbi(abi);

        if (user.provider) {
            try {
                let writeContract = await new ethers.Contract(currentDrop.address, abi, user.provider.getSigner());
                currentDrop = Object.assign({writeContract: writeContract}, currentDrop);
            } catch(error) {
                console.log(error);
            }
        }
        try {
            if (isFounderDrop(currentDrop.address)) {
                currentDrop = Object.assign({currentSupply: membership.founders.count}, currentDrop);
            }
            else if (isCroniesDrop(currentDrop.address)) {
                currentDrop = Object.assign({currentSupply: cronies.count}, currentDrop);
            }
            else if (isCrognomesDrop(currentDrop.address)) {
                let readContract = await new ethers.Contract(currentDrop.address, abi, readProvider);
                const supply = await readContract.totalSupply();
                const offsetSupply = supply.add(901);
                currentDrop = Object.assign({currentSupply: offsetSupply.toString()}, currentDrop);
            }
            else {
                if (isOnNewContract(currentDrop.abi)) {
                    let readContract = await new ethers.Contract(currentDrop.address, abi, readProvider);
                    const infos = await readContract.getInfos();
                    const canMint = user.address ? await readContract.canMint(user.address) : 0;
                    setMaxMintPerAddress(infos.maxMintPerAddress);
                    setMaxMintPerTx(infos.maxMintPerTx);
                    setMaxSupply(infos.maxSupply);
                    setMemberCost(ethers.utils.formatEther(infos.memberCost));
                    setRegularCost(ethers.utils.formatEther(infos.regularCost));
                    setTotalSupply(infos.totalSupply);
                    setWhitelistCost(ethers.utils.formatEther(infos.whitelistCost));
                    setCanMintQuantity(canMint);
                } else {
                    let readContract = await new ethers.Contract(currentDrop.address, abi, readProvider);
                    const currentSupply = await readContract.totalSupply();
                    setMaxMintPerAddress(currentDrop.maxMintPerAddress ?? 100);
                    setMaxMintPerTx(currentDrop.maxMintPerTx);
                    setMaxSupply(currentDrop.totalSupply);
                    setMemberCost(currentDrop.memberCost);
                    setRegularCost(currentDrop.cost);
                    setTotalSupply(currentSupply);
                    setWhitelistCost(currentSupply.whitelistCost);
                    setCanMintQuantity(currentDrop.maxMintPerTx);
                }
            }
        } catch(error) {
            console.log(error);
        }
        setLoading(false);
        setDropObject(currentDrop);
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

    const calculateCost = async (user) => {
        if (isOnNewContract(dropObject.abi)) {
            let readContract = await new ethers.Contract(dropObject.address, abi, readProvider);
            return await readContract.cost(user.address);
        }

        const memberCost = ethers.utils.parseEther(dropObject.memberCost);
        const regCost = ethers.utils.parseEther(dropObject.cost);
        if(user.isMember){
            return memberCost;
        } else {
            return regCost;
        }
    }

    const isOnNewContract = (dropAbi) => {
        return typeof dropAbi === 'string';
    }

    const mintNow = async() => {
        if(user.address){
            setMinting(true);
            const contract = dropObject.writeContract;
            try{
                const cost = await calculateCost(user);
                let finalCost = cost.mul(numToMint);
                let extra = {
                    'value' : finalCost
                };

                var response;
                if (dropObject.is1155) {

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
                    if (isOnNewContract(dropObject.abi)) {
                        response = await contract.mint(numToMint, extra);
                    } else {
                        let method;
                        for (const abiMethod of abi) {
                            if (abiMethod.includes("mint")) method = abiMethod;
                        }
                        if (method.includes("address") && method.includes("uint256")) {
                            response = await contract.mint(user.address, numToMint, extra);
                        } else {
                            console.log(`contract ${contract}  num: ${numToMint}   extra ${extra}`)
                            response = await contract.mint(numToMint, extra);
                        }
                    }
                    const receipt = await response.wait();
                    toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

                    {
                        const dropObjectAnalytics = {
                            address: dropObject.address,
                            id: dropObject.id,
                            title: dropObject.title,
                            slug: dropObject.slug,
                            author_name: dropObject.author.name,
                            author_link: dropObject.author.link,
                            maxMintPerTx: dropObject.maxMintPerTx,
                            totalSupply: dropObject.totalSupply,
                            cost: dropObject.cost,
                            memberCost: dropObject.memberCost,
                            foundersOnly: dropObject.foundersOnly,
                        }

                        const purchaseAnalyticParams = {
                            currency : 'CRO',
                            value: ethers.utils.formatEther(finalCost),
                            transaction_id: receipt.transactionHash,
                            quantity : numToMint,
                            items: [dropObjectAnalytics]
                        };

                        logEvent(getAnalytics(), 'purchase', purchaseAnalyticParams);
                    }

                    await retrieveDropInfo();
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
    const vidRef = useRef(null);
    const handlePlayVideo = () => {
        vidRef.current.play();
    }
    return (
        <div>
            <GlobalStyles/>
            <>
                <section className={`jumbotron breadcumb h-vh tint`} style={{backgroundImage: `url(${drop.imgBanner ? drop.imgBanner : '/img/background/Ebisus-bg-1_L.jpg'})`}}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className={`col-lg-6 ${drop.mediaPosition === 'left' ? 'order-1' : 'order-2'}`}>
                                <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                                    <ReactPlayer
                                        url={drop.video}
                                        controls={true}
                                        width='100%'
                                        height='100%'
                                    />
                                </Reveal>
                            </div>
                            <div className={`col-lg-6 ${drop.mediaPosition === 'left' ? 'order-2' : 'order-1'}`}>
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
                                        className="item_info_type">{totalSupply.toString()}/{maxSupply.toString()} minted
                                    </div>
                                </div>
                                <div>{newlineText(drop.description)}</div>

                                {drop.disclaimer &&
                                    <p className="fw-bold text-center my-4" style={{color:'black'}}>{drop.disclaimer}</p>
                                }

                                <div className="d-flex flex-row">
                                    <div className="me-4">
                                        <h6 className="mb-1">Mint Price</h6>
                                        <h5>{regularCost} CRO</h5>
                                    </div>
                                    {(memberCost && regularCost !== memberCost) &&
                                        <div>
                                            <h6 className="mb-1">Founding Member Price</h6>
                                            <h5>{memberCost} CRO</h5>
                                        </div>
                                    }
                                    {(whitelistCost && memberCost !== whitelistCost) &&
                                    <div>
                                        <h6 className="mb-1">Whitelist Price</h6>
                                        <h5>{whitelistCost} CRO</h5>
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
                                {status === statuses.LIVE && !drop.complete &&
                                    <>
                                        {canMintQuantity > 1 &&
                                            <div>
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Range value={numToMint} min="1" max={canMintQuantity}
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
                                        {canMintQuantity > 0 &&
                                            <div className="d-flex flex-row mt-5">
                                                <button className='btn-main lead mb-5 mr15' onClick={mintNow} disabled={minting}>
                                                    {minting ?
                                                        <>
                                                            Minting...
                                                            <Spinner animation="border" role="status" size="sm" className="ms-1">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </Spinner>
                                                        </>
                                                        :
                                                        <>
                                                            {canMintQuantity > 1 ?
                                                                <>Mint {numToMint}</>
                                                                :
                                                                <>Mint</>
                                                            }
                                                        </>
                                                    }
                                                </button>
                                            </div>
                                        }
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
