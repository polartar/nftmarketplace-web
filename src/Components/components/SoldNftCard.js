import React, { memo } from 'react';
import styled from "styled-components";
import { useHistory  } from "react-router-dom";

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

    return (
        <div className={className}>
            <div className="nft__item m-0">
                <div className="nft__item_wrap" style={{height: `${height}px`}}>
                    <Outer>
                        <span>
                            <img onLoad={onImgLoad} src={nft.image} className="lazy nft__item_preview" alt=""/>
                        </span>
                    </Outer>
                </div>
                <div className="nft__item_info">
                    <span onClick={() => navigateTo(`/collection/${nft.address}/${nft.id}`)}>
                        {nft.count && nft.count > 0 ?
                            <h4>{nft.name} (x{nft.count})</h4>
                            :
                            <h4>{nft.name}</h4>
                        }
                    </span>
                    <div className="nft__item_action mb-2">

                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(SoldNftCard);
