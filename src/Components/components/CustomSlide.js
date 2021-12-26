import React, { memo } from "react";
import Blockies from 'react-blockies';

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
                  <i className="fa fa-check"></i>
                  }
              </span>
          </div>
          <div className="nft_coll_info">
              <span onClick={()=> window.open(url, "_self")}><h4>{ title }</h4></span>
              <span>{ subtitle }</span>
          </div>
      </div>
    </div>
  )
}

export default memo(CustomSlide);