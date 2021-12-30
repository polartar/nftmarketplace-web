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
const ListingCard = ({ listing, className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4', clockTop = true, height, onImgLoad }) => {

    return (
        <div className={className}>
            <Link className="linkPointer" to={`/listing/${listing.listingId}`}>
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
                    <div className="nft__item_info mb-2">
                        <span>
                            <h4>{listing.nft.name}</h4>
                        </span>
                        <div className="has_offers">
                            {ethers.utils.commify(listing.price)} CRO
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default memo(ListingCard);