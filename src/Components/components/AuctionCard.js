import React, { memo } from 'react';
import styled from "styled-components";
import { Link  } from "react-router-dom";
import { ethers } from "ethers";
import Clock from "./Clock";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

//react functional component
const AuctionCard = ({ listing, imgClass = 'marketplace' }) => {

    return (
        <Link className="linkPointer" to={`/auctions/${listing.auctionId}`}>
            <div className="card eb-nft__card h-100 shadow">
                <img src={listing.nft.image} className={`card-img-top ${imgClass}`} />
                {listing.nft.rank ?
                    <div className="badge bg-rarity text-wrap mt-1 mx-1">
                        Rank: #{listing.nft.rank}
                    </div>
                    :
                    <div className="badge bg-rarity-none text-wrap mt-1 mx-1">
                        Rank: N/A
                    </div>
                }
                <div className="eb-de_countdown text-center">
                    Ends In: <Clock deadline={listing.endAt} />
                </div>
                <div className="card-body d-flex flex-column">
                    <h6 className="card-title mt-auto">{listing.nft.name}</h6>
                </div>
            </div>
        </Link>
    );
};

export default memo(AuctionCard);