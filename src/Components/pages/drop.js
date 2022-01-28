import React, { useEffect, useRef, useState } from 'react';
import { ethers, constants } from 'ethers'
import {useSelector, useDispatch} from 'react-redux'
import {toast} from "react-toastify";
import Countdown from 'react-countdown';
import { getAnalytics, logEvent } from '@firebase/analytics'
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
import {
    createSuccessfulTransactionToastContent, isCrognomesDrop,
    isCroniesDrop,
    isFounderDrop,
    newlineText
} from "../../utils";
import MintButton from "../Drop/MintButton";
import {dropState as statuses} from "../../core/api/enums";
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
    const [mintingERC20, setMintingERC20] = useState(false);
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

    useEffect(() => {
        const init = async () => {
            setDropObject(drop);
            let currentDrop = drop;
            if (!drop.address) {
                currentDrop = Object.assign({currentSupply: 0}, currentDrop);
                setDropObject(currentDrop);
                return;
            }

            if (user.provider) {
                try {
                    let writeContract = await new ethers.Contract(currentDrop.address, currentDrop.abi, user.provider.getSigner());
                    currentDrop = Object.assign({writeContract: writeContract}, currentDrop);
                    
                    if (currentDrop.erc20Address) {
                        const erc20Contract = await new ethers.Contract(dropObject.erc20Address, dropObject.erc20Abi, user.provider.getSigner());
                        const erc20ReadContract = await new ethers.Contract(dropObject.erc20Address, dropObject.erc20Abi, readProvider);
                        currentDrop = {
                            ...currentDrop,
                            erc20Contract,
                            erc20ReadContract
                        }
                    }
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
                    let readContract = await new ethers.Contract(currentDrop.address, currentDrop.abi, readProvider);
                    const supply = await readContract.totalSupply();
                    const offsetSupply = supply.add(901);
                    currentDrop = Object.assign({currentSupply: offsetSupply.toString()}, currentDrop);
                }
                else {
                    let readContract = await new ethers.Contract(currentDrop.address, currentDrop.abi, readProvider);
                    currentDrop = Object.assign({currentSupply: (await readContract.totalSupply()).toString()}, currentDrop);
                }
            } catch(error) {
                console.log(error);
            }
            setLoading(false);
            calculateStatus(currentDrop);
            setDropObject(currentDrop);
        }
        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, membership, cronies]);

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
        return user.isMember;
    }

    const mintNow = async(isErc20 = false) => {
        if(user.address){
            if (!dropObject.writeContract) {
                return;
            }
            if (isErc20 === true) {
                setMintingERC20(true);
            } else {
                setMinting(true);
            }
            const contract = dropObject.writeContract;
            try{
                const memberCost = ethers.utils.parseEther(isErc20 === true ? dropObject.erc20MemberCost : dropObject.memberCost);
                const regCost = ethers.utils.parseEther(isErc20 === true ? dropObject.erc20Cost : dropObject.cost);
                let cost;
                if (dropObject.abi.join().includes("isReducedTime()")) {
                    const readContract = await new ethers.Contract(dropObject.address, dropObject.abi, readProvider);
                    const isReduced = await readContract.isReducedTime();
                    cost = isReduced ? memberCost : regCost;
                } else if(await isEligibleForMemberPrice(user)){
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
                        if (abiMethod.includes("mint") && !abiMethod.includes("view")) method = abiMethod;
                    }

                    if(isErc20 === true) {
                        const allowance = await dropObject.erc20ReadContract.allowance(user.address, dropObject.address);
                        if (allowance.sub(finalCost) < 0) {
                            await dropObject.erc20Contract.approve(dropObject.address, constants.MaxUint256);
                        }                        
                    }                    
                    if (method.includes("address") && method.includes("uint256")) {
                        if (isErc20 === true) {
                            response = await contract.mintWithLoot(user.address, numToMint);
                        } else {
                            response = await contract.mint(user.address, numToMint, extra);
                        }                        
                    } else {
                        console.log(`contract ${contract}  num: ${numToMint}   extra ${extra}`)
                        if (isErc20 === true) {
                            response = await contract.mintWithLoot(numToMint);
                        } else {
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
                if (isErc20 === true) {
                    setMintingERC20(false);
                } else {
                    setMinting(false);
                }
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
                                <div>{newlineText(drop.description)}</div>

                                {drop.disclaimer &&
                                    <p className="fw-bold text-center my-4" style={{color:'black'}}>{drop.disclaimer}</p>
                                }

                                <div className="d-flex flex-row">
                                    <div className="me-4">
                                        <h6 className="mb-1">Mint Price</h6>
                                        <h5>{dropObject?.cost} CRO</h5>
                                        {
                                            dropObject?.erc20Cost && dropObject?.erc20Unit && 
                                                <h5>{`${dropObject?.erc20Cost} ${dropObject?.erc20Unit}`}</h5>
                                        }
                                    </div>
                                    {
                                        ((dropObject?.cost !== dropObject?.memberCost) || (dropObject?.erc20Cost !== dropObject?.erc20MemberCost)) &&
                                            <div>
                                                <h6 className="mb-1">Founding Member Price</h6>
                                                {
                                                    (dropObject?.cost !== dropObject?.memberCost) && 
                                                        <h5>{dropObject?.memberCost} CRO</h5>
                                                }
                                                {
                                                    (dropObject?.erc20Cost !== dropObject?.erc20MemberCost) &&
                                                        <h5>{`${dropObject?.erc20MemberCost} ${dropObject?.erc20Unit}`}</h5>
                                                }
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
                                                        {drop.maxMintPerTx && drop.maxMintPerTx > 1 ?
                                                            <>Mint {numToMint}</>
                                                            :
                                                            <>Mint</>
                                                        }
                                                    </>
                                                }
                                            </button>
                                            {
                                                drop.erc20Unit && 
                                                    <button className='btn-main lead mb-5 mr15 mx-1' onClick={() => mintNow(true)} disabled={mintingERC20}>
                                                        {
                                                            mintingERC20 ?
                                                            <>
                                                                Minting...
                                                                <Spinner animation="border" role="status" size="sm" className="ms-1">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </Spinner>
                                                            </>
                                                            :
                                                            <>
                                                                {drop.maxMintPerTx && drop.maxMintPerTx > 1 ?
                                                                    <>Mint {numToMint} with {drop.erc20Unit}</>
                                                                    :
                                                                    <>Mint with {drop.erc20Unit}</>
                                                                }
                                                            </>
                                                        }
                                                    </button>
                                            }
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
