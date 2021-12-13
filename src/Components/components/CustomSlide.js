import React, { memo } from "react";
import Blockies from 'react-blockies';

const CustomSlide = ({ index, avatar, banner, username, uniqueId, collectionId }) => {
  return (
    <div className='itm' index={index}>
      <div className="nft_coll">
          <div className="nft_wrap">
              <span><img src={banner} className="lazy img-fluid" alt=""/></span>
          </div>
          <div className="nft_coll_pp">
              <span onClick={()=> window.open("/collection/" + collectionId, "_self")}>
                <Blockies size={10} scale={6}/>
              </span>
          </div>
          <div className="nft_coll_info">
              <span onClick={()=> window.open("/collection/" + collectionId, "_self")}><h4>{ username }</h4></span>
              <span>{ uniqueId }</span>
          </div>
      </div>
    </div>
  )
}

export default memo(CustomSlide);