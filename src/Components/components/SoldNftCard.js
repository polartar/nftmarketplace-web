import React, { memo } from 'react';
import styled from "styled-components";
import { useHistory  } from "react-router-dom";
import { ethers } from "ethers";
import Blockies from "react-blockies";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

const SoldNftCard = ({
    nft,
    className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4',
    height,
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
            <div className="nft__item m-0">
                <div className="nft__item_wrap" style={ { height: `${ height }px` } }>
                    <Outer>
                        <span>
                            <img onLoad={ onImgLoad } src={ nft.image } className="lazy nft__item_preview" alt=""/>
                        </span>
                    </Outer>
                </div>
                <div className="nft__item_info mb-2">
                    <span onClick={ () => navigateTo(`/listing/${ nft.listingId }`) }>
                        <h4>{ nft.name }</h4>
                    </span>
                    <div className="has_offers">
                        sold for { ethers.utils.commify(nft.fee) } CRO
                    </div>

                    <div className="mt-3 mr40">
                        <h6 style={{fontSize: '12px'}}>Buyer</h6>
                        <div className="item_author d-flex gap-2 mt-3">
                            <div className="author_list_pp position-relative m-0">
                                            <span onClick={ viewPurchaser() }>
                                                <Blockies seed={ nft.purchaser } size={ 10 } scale={ 5 }/>
                                            </span>
                            </div>
                            <div className="author_list_info d-flex align-items-center">
                                <span>{ `${ nft.purchaser.substring(0, 4) }...${ nft.purchaser.substring(nft.purchaser.length - 3, nft.purchaser.length) }` }</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default memo(SoldNftCard);
