import React, { useEffect, useRef, useState } from 'react';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import { keyframes } from "@emotion/react";
import Reveal from 'react-awesome-reveal';
import {useParams} from "react-router-dom";
import {Form} from "react-bootstrap";
import config from '../../Assets/networks/rpc_config.json'
import { connectAccount } from '../../GlobalState/User'
import { fetchMemberInfo } from '../../GlobalState/Memberships'
import { fetchCronieInfo } from '../../GlobalState/Cronies'
import { ethers} from 'ethers'
import {useSelector, useDispatch} from 'react-redux'
import {toast} from "react-toastify";
import Countdown from 'react-countdown';
import { getAnalytics, logEvent } from '@firebase/analytics'
export const drops = config.drops;

const GlobalStyles = createGlobalStyle`
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
    const countdownRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'drop',
            drop_id: slug
        })
    }, []);

    useEffect(() => {
        dispatch(fetchMemberInfo());
        dispatch(fetchCronieInfo());
    }, [])

    // useEffect(() => {
    //   countdownRef.current.start();
    // },[]);

    // useLayoutEffect(() => {
    //   (async () => {
    //     const response = await fetch("https://us-central1-ebisusbay.cloudfunctions.net/dropLive");
    //     const data = await response.json();
    //     setStartTime(data.liveAt);
    //     setIsLive(data.isLive);
    //   })();
    // }, []);

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

    const [dropObject, setDropObject] = useState(null);

    useEffect(async() => {
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
            if (currentDrop.address !== "0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5" && currentDrop.address !== "0xD961956B319A10CBdF89409C0aE7059788A4DaBb") {
                let readContract = await new ethers.Contract(currentDrop.address, currentDrop.abi, readProvider);
                currentDrop = Object.assign({currentSupply: (await readContract.totalSupply()).toString()}, currentDrop);
                if(slug === 'cro-moon-collage'){
                    let bnCost = await readContract.cost();
                    console.log(`got cost ${bnCost}`)
                    let cost = ethers.utils.formatEther(bnCost);
                    currentDrop.memberCost = cost;
                    currentDrop.cost = cost;
                }
                const sTime = new Date(currentDrop.start);
                const now = new Date();
                if(sTime > now){
                    setIsLive(false);
                } else {
                    console.log(currentDrop.startTime);
                    console.log(`now: ${now}  sTime ${sTime}`)
                }
            }
        } catch(error) {
            console.log(error);
        }
        setLoading(false);
        setDropObject(currentDrop);
    }, [user]);


    useEffect(async() => {
        if (dropObject) {
            if (dropObject.address === "0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5") {
                setDropObject(Object.assign({currentSupply: membership.founders.count}, dropObject));
            }
            if (dropObject.address === "0xD961956B319A10CBdF89409C0aE7059788A4DaBb") {
                setDropObject(Object.assign({currentSupply: cronies.count}, dropObject));
            }
        }
    }, [membership, user, cronies])

    // useEffect(async() => {
    //     if(hasEnded()){
    //         console.log('ended');
    //     }else{
    //         console.log('not ended');
    //     }
    // }, [dropObject])
    //
    // function hasEnded() {
    //     const endDatePassed = Date.parse(drop.end) < new Date();
    //     const soldOut = dropObject?.currentSupply >= dropObject?.totalSupply;
    //     console.log(drop, dropObject);
    //     return endDatePassed || soldOut;
    // }

    const [isLive, setIsLive] = useState(true);
    const [startTime, setStartTime] = useState(1638565200000);
    const [loading, setLoading] = useState(true);

    const [minting, setMinting] = useState(false);
    const closeMinting = () => {
        setMinting(false);
    };
    const [error, setError] = React.useState({
        error: false,
        message: ""
    });

    const [referral, setReferral] = useState("");
    const handleChangeReferralCode = (event) => {
        const { value } = event.target;
        setReferral(value);
    }

    const [numToMint, setNumToMint] = useState(1);


    const mintNow = async() => {
        if(user.address){
            setMinting(true);
            const contract = dropObject.writeContract;
            try{
                const memberCost = ethers.utils.parseEther(dropObject.memberCost);
                const regCost = ethers.utils.parseEther(dropObject.cost);
                let cost;
                if(user.isMember){
                    cost = memberCost;
                } else {
                    cost = regCost;
                }
                const extra = {
                    'value' : cost.mul(numToMint)
                };
                if (dropObject.is1155) {
                    var response;
                    if (dropObject.title === "Founding Member") {
                        const ref32 = ethers.utils.formatBytes32String(referral);
                        response = await contract.mint(1, numToMint, ref32, extra);
                    } else {
                        // Cronie
                        console.log("here");
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
                        response = await contract.mint(numToMint, extra);
                    }
                    const receipt = await response.wait();
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
        let date = new Date(time * 1000);
        const fullDateString = date.toLocaleString('default', {timeZone: 'UTC'});
        const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
        let dateString = `${fullDateString.split(", ")[1]} ${date.getUTCDate()} ${month} ${date.getUTCFullYear()} UTC`
        return dateString
    }

    return (
        <div>
            <GlobalStyles/>
            <>
                <section className="jumbotron no-bg" style={{backgroundImage: `url(${'/img/background/7.jpg'})`}}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <div className="spacer-single"></div>
                                <div className="spacer-double"></div>
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
                                {isLive && drop.end &&
                                <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                                    <p className="lead col-white">
                                        Ends in: <Countdown date={drop.end}/>
                                    </p>
                                </Reveal>
                                }
                                {!isLive &&
                                <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                                    <p className="lead col-white">
                                        Starts in: <Countdown date={drop.start}/>
                                    </p>
                                </Reveal>
                                }

                                <div className="spacer-10"></div>
                                <Reveal className='onStep d-inline' keyframes={inline} delay={800} duration={900}
                                        triggerOnce>
                                    <span onClick={() => window.open("#", "_self")}
                                          className="btn-main inline lead">Explore</span>
                                    <div className="mb-sm-30"></div>
                                </Reveal>
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


                                <div className="d-flex flex-row">
                                    <div className="me-4">
                                        <h6 className="mb-1">Mint Price</h6>
                                        <h5>{drop.cost} CRO</h5>
                                    </div>
                                    {(drop.cost !== drop.memberCost) &&
                                    <div>
                                        <h6 className="mb-1">Founding Member Price</h6>
                                        <h5>{drop.memberCost} CRO</h5>
                                    </div>
                                    }
                                </div>

                                <div className="spacer-40"></div>

                                {drop.end &&
                                <div className="me-4">
                                    <h6 className="mb-1">Minting Ends</h6>
                                    <h3>{convertTime(drop.end)}</h3>
                                </div>
                                }
                                {isLive ?
                                    <>
                                        <div>
                                            <Form.Label>Quantity</Form.Label>
                                            <Form.Range value={numToMint} min="1" max="10"
                                                        onChange={e => setNumToMint(e.target.value)}/>
                                        </div>
                                        {dropObject?.referral ??
                                            <Form.Group className="mb-3" controlId="formReferralCode">
                                                <Form.Label>Referral Code</Form.Label>
                                                <Form.Control onChange={handleChangeReferralCode} type="text"
                                                              placeholder="Enter Referral Code"/>
                                                <Form.Text className="text-muted"/>
                                            </Form.Group>
                                        }
                                        <div className="d-flex flex-row mt-5">
                                            <button className='btn-main lead mb-5 mr15'
                                                    onClick={mintNow}>Mint {numToMint}</button>
                                        </div>
                                    </>
                                    :
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