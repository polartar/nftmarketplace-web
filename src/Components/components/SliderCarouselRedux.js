import React, {memo} from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from './constants';
import {useHistory} from "react-router-dom";
import config from '../../Assets/networks/rpc_config.json';
export const drops = config.drops;

const SliderCarouselRedux = () => {
    const history = useHistory();

    const navigateTo = (link) => {
        history.push(link);
    }

    return (
        <div className='nft-big'>
          <Slider {...settings}>
          {drops && drops.reverse().map( (drop, index) => (
            <div onClick={() => navigateTo(`/drops/${drop.slug}`)} className='itm' index={index+1} key={index}>
              <div className="nft_pic">                            
                  <span>
                      <span className="nft_pic_info">
                          <span className="nft_pic_title">{drop.title}</span>
                          <span className="nft_pic_by">{drop.author.name}</span>
                      </span>
                  </span>
                  <div className="nft_pic_wrap">
                      <img src={drop.imgPreview} className="lazy img-fluid" alt=""/>
                  </div>
              </div>
            </div>
          ))}
          </Slider>
        </div>
    );
}

export default memo(SliderCarouselRedux);
