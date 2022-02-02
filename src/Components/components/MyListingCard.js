import React, { memo } from 'react';
import styled from "styled-components";
import { useHistory  } from "react-router-dom";
import { ethers } from "ethers";
import {Button, Card} from "react-bootstrap";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import config from '../../Assets/networks/rpc_config.json';
import { toast } from "react-toastify";


const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  height: 100%;
`;

const MyListingCard = ({
    nft,
    className = 'col-sm-12 col-md-12 col-lg-6 d-item',
    width,
    onImgLoad,
    canCancel = false,
    canUpdate = false,
    onCancelButtonPressed,
    onUpdateButtonPressed,

}) => {
    const history = useHistory();

    const navigateTo = (link) => {
        console.log(canUpdate);
        history.push(link);
    }

    const viewListingDetails = () => {
        navigateTo(`/listing/${ nft.listingId }`);
    }

    const nftUrl = () => {
        return `/collection/${nft.address}/${nft.id}`;
    }

    const onCopyLinkButtonPressed = (url) => () =>{
        console.log(nft.rank);
        navigator.clipboard.writeText(url);
        toast.success('Copied!');
    }

    return (
        <>
        { (!nft.valid)?
        <Card style={{backgroundColor: "#ffadad"}}>
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={nft.image} className="img-fluid rounded-start" alt="" />
                </div>
                <Card.Body className="col-md-8">
                    <h5 className="card-title">{nft.name}</h5>
                    <p className="card-text">
                        Listing ID: {nft.listingId}<br></br>
                        Price: {nft.listingId} CRO<br></br>
                        {nft.rank &&
                            <>
                            Rank: {nft.rank} <br></br>
                            </>
                        }
                        Listing Time: {nft.listingTime}<br></br>
                        Valid: {nft.valid.toString().charAt(0).toUpperCase() + nft.valid.toString().slice(1)}<br></br>
                    </p>
                </Card.Body>
                <Card.Footer>
                <div className="justify-content-between" style={{color: "black"}}>
                {canUpdate &&
                    <Button className="mx-1" onClick={onUpdateButtonPressed} style={{cursor:'pointer', color: "black"}}>Update</Button>
                    }
                    {canCancel &&
                    <Button className="mx-1" onClick={onCancelButtonPressed} style={{cursor:'pointer', color: "black"}}>Cancel</Button>
                    }
                    <Button className="mx-1" onClick={onCopyLinkButtonPressed(new URL(nftUrl(), config.app_base))} style={{cursor:'pointer', color: "black"}}>
                        <FontAwesomeIcon icon={faLink}/>
                    </Button>
                    </div>
            </Card.Footer>
            </div>
        </Card>
        :
        <Card>
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={nft.image} className="img-fluid rounded-start" alt="" />
                </div>
                <Card.Body className="col-md-8">
                    <h5 className="card-title">{nft.name}</h5>
                    <p className="card-text">
                        Listing ID: {nft.listingId}<br></br>
                        Price: {nft.listingId} CRO<br></br>
                        {nft.rank &&
                            <>
                            Rank: {nft.rank} <br></br>
                            </>
                        }
                        Listing Time: {nft.listingTime}<br></br>
                        Valid: {nft.valid.toString().charAt(0).toUpperCase() + nft.valid.toString().slice(1)}<br></br>
                    </p>
                </Card.Body>
                <Card.Footer>
                <div className="justify-content-between" style={{color: "black"}}>
                {canUpdate &&
                    <Button className="mx-1" onClick={onUpdateButtonPressed} style={{cursor:'pointer', color: "black"}}>Update</Button>
                    }
                    {canCancel &&
                    <Button className="mx-1" onClick={onCancelButtonPressed} style={{cursor:'pointer', color: "black"}}>Cancel</Button>
                    }
                    <Button className="mx-1" onClick={onCopyLinkButtonPressed(new URL(nftUrl(), config.app_base))} style={{cursor:'pointer', color: "black"}}>
                        <FontAwesomeIcon icon={faLink}/>
                    </Button>
                    </div>
            </Card.Footer>
            </div>
        </Card>
        }
        </>
    );
};

export default memo(MyListingCard);
