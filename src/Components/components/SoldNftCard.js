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
  height: 100%;
`;

const SoldNftCard = ({
    nft,
    className = 'd-item p-3',
    width,
    onImgLoad
}) => {
    const history = useHistory();

    const navigateTo = (link) => {
        history.push(link);
    }

    const viewPurchaser = () => () => {
        history.push(`/seller/${nft.purchaser}`);
    }

    return (
        <div className={ className }>
            <div className="nft_sold__item d-flex flex-row gap-3" onClick={ () => navigateTo(`/listing/${ nft.listingId }`) }>
                <div style={ { height: `150px` } }>
                    <div className="h-100" style={ width ? { width: `${width}px` } : {} }>
                        <Outer>
                            <img onLoad={ onImgLoad }
                                 className="h-100"
                                 src={ nft.image } alt=""/>
                        </Outer>
                    </div>
                </div>
                <div className="nft__item_info mb-2">
                    <span>
                        <h4>{ nft.name }</h4>
                    </span>
                    <div className="has_offers">
                        sold for { ethers.utils.commify(nft.price) } CRO
                    </div>
                    <div className="has_offers">
                        { nft.saleTime }
                    </div>

                </div>
            </div>
        </div>
    );
};

export default memo(SoldNftCard);
