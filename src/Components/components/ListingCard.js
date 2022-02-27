import React, { memo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { croSkullRedPotionImage, croSkullRedPotionImageHack, isCroSkullRedPotion } from '../../hacks';

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
      <div className="card eb-nft__card h-100 shadow">
        <img
          src={croSkullRedPotionImageHack(listing.nftAddress, listing.nft.image)}
          className={`card-img-top ${imgClass}`}
          alt={listing.nft.name}
        />
        {listing.nft.rank &&
          <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{listing.nft.rank}</div>
        }
        <div className="card-body d-flex flex-column">
          <h6 className="card-title mt-auto">{listing.nft.name}</h6>
          <p className="card-text">{ethers.utils.commify(listing.price)} CRO</p>
        </div>
      </div>
    </Link>
  );
};

export default memo(ListingCard);
