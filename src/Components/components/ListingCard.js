import React, { memo } from 'react';
import styled from "styled-components";
import { useHistory  } from "react-router-dom";
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
const ListingCard = ({ listing, className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4', clockTop = true, height, onImgLoad }) => {
    const history = useHistory();

    const navigateTo = (link) => {
        history.push(link);
    }

    return (
        <div className={className}>
            <div className="nft__item m-0">
                <div>
                    <h4>Listing #{listing.listingId}</h4>
                </div>
                <div className="nft__item_wrap" style={{height: `${height}px`}}>
                    <Outer>
                        <span>
                            <img onLoad={onImgLoad} src={listing.nft.image} className="lazy nft__item_preview" alt=""/>
                        </span>
                    </Outer>
                </div>
                <div className="nft__item_info">
                    <span onClick={() => navigateTo(`/listing/${listing.listingId}`)}>
                        <h4>{listing.nft.name}</h4>
                    </span>
                    <div className="has_offers">
                        {ethers.utils.commify(listing.price)} CRO
                    </div>
                    <div className="nft__item_action mb-2">
                        <span onClick={() => navigateTo(`/listing/${listing.listingId}`)}>Details</span>
                    </div>
                </div> 
            </div>
        </div>             
    );
};

export default memo(ListingCard);