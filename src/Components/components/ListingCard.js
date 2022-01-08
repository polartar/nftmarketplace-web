import React, { memo } from 'react';
import styled from "styled-components";
import { Link  } from "react-router-dom";
import { ethers } from "ethers";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

//react functional component
const ListingCard = ({ listing, imgClass = 'marketplace' }) => {

    return (
        <Link className="linkPointer" to={`/listing/${listing.listingId}`}>
            <div className="card eb-nft__card h-100">
                <Outer>
                    <img src={listing.nft.image} className={`card-img-top ${imgClass}`} />
                </Outer>
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title mt-auto">{listing.nft.name}</h5>
                    <p className="card-text">{ethers.utils.commify(listing.price)} CRO</p>
                </div>
            </div>
        </Link>
    );
};

export default memo(ListingCard);