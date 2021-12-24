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
const NftCard = ({
    nft,
    className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4',
    height,
    onImgLoad,
    canTransfer = false,
    canSell = false,
    canCancel = false,
    canUpdate = false,
    onTransferButtonPressed,
    onSellButtonPressed,
    onCancelButtonPressed,
    onUpdateButtonPressed,
    newTab = false,
}) => {
    const history = useHistory();

    const navigateTo = (link) => {
        if (newTab) {
            window.open(link, "_blank");
        } else {
            history.push(link);
        }
    }

    const nftUrl = () => {
        if (nft.listed) {
            return `/listing/${nft.listingId}`;
        }

        return `/collection/${nft.address}/${nft.id}`;
    }

    return (
        <div className={className} style={{cursor: 'pointer'}} onClick={() => navigateTo(nftUrl())}>
            <div className="nft__item m-0">

                <div className="nft__item_wrap" style={{height: `${height}px`, marginTop: '0'}}>
                    <Outer>
                        <span>
                            <img onLoad={onImgLoad} src={nft.image} className="lazy nft__item_preview" alt=""/>
                        </span>
                    </Outer>
                </div>
                <div className="nft__item_info">
                    <span>
                        {nft.count && nft.count > 0 ?
                            <h4>{nft.name} (x{nft.count})</h4>
                            :
                            <h4>{nft.name}</h4>
                        }
                    </span>
                        <div className="has_offers">
                            {nft.listed ?
                                <>
                                    {ethers.utils.commify(nft.price)} CRO
                                </>
                                :
                                <>
                                    &nbsp;
                                </>
                            }
                        </div>
                    <div className="nft__item_action mb-2">
                        {canTransfer &&
                        <span className="mx-1" onClick={onTransferButtonPressed}>Transfer</span>
                        }
                        {canSell &&
                        <span className="mx-1" onClick={onSellButtonPressed}>Sell</span>
                        }
                        {canCancel &&
                        <span className="mx-1" onClick={onCancelButtonPressed}>Cancel</span>
                        }
                        {canUpdate &&
                        <span className="mx-1" onClick={onUpdateButtonPressed}>Update</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(NftCard);