import React, { memo } from "react";
import Blockies from 'react-blockies';
 import { faCheck , faCircle } from "@fortawesome/free-solid-svg-icons";
import LayeredIcon from "./LayeredIcon";
import styled from "styled-components";

const VerifiedIcon = styled.span`
  font-size: 10px;
  color: #ffffff;
  background: $color;
  border-radius: 100%;
  -moz-border-radius: 100%;
  -webkit-border-radius: 100%;
  position: absolute;
  bottom: 2px;
  right: 2px;
`;

const CustomSlide = ({ index, avatar, banner, title, subtitle, collectionId, url, verified }) => {
  return (
    <div className='itm' index={index}>
      <div className="nft_coll">
          <div className="nft_wrap">
              <span><img src={banner} className="lazy img-fluid" alt=""/></span>
          </div>
          <div className="nft_coll_pp">
              <span onClick={()=> window.open(url, "_self")}>
                  {avatar ?
                      <img className="lazy" src={avatar} alt=""/>
                      :
                      <Blockies seed={collectionId} size={10} scale={6}/>
                  }
                  {verified &&
                      <VerifiedIcon>
                          <LayeredIcon
                              icon={faCheck}
                              bgIcon={faCircle}
                              shrink={7}
                          />
                      </VerifiedIcon>
                  }
              </span>
          </div>
          <div className="nft_coll_info">
              {url ?
                  <span onClick={()=> window.open(url, "_self")}><h4>{ title }</h4></span>
                  :
                  <h4>{ title }</h4>
              }
              <span>{ subtitle }</span>
          </div>
      </div>
    </div>
  )
}

export default memo(CustomSlide);
