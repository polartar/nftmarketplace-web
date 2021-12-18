import React, { memo, useEffect } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from './constants';
import { useSelector, useDispatch } from 'react-redux';
import api from "../../core/api";
import {useHistory} from "react-router-dom";

const SliderCarouselRedux = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    // const nftsState = useSelector(selectors.nftShowcaseState);
    const nfts = [
        {
            id: 'cronies',
            title: 'Cronies',
            authorName: '',
            previewImage: '/mock_data/uploads/cronies.ee119c86-sm.webp',
        },
        {
            id: 'founding-member',
            title: 'Founding Member',
            authorName: '',
            previewImage: '/mock_data/uploads/founding_member.c0c01c5e-sm.png',
        },
        {
            id: 'elons-adventure',
            title: 'Elon\'s Adventures',
            authorName: '',
            previewImage: '/mock_data/uploads/elons_adventures_card.f38d2512-sm.gif',
        }
    ];
    
    useEffect(() => {
        // dispatch(fetchNftShowcase());
    }, [dispatch]);

    const navigateTo = (link) => {
        history.push(link);
    }

    return (
        <div className='nft-big'>
          <Slider {...settings}>
          {nfts && nfts.map( (nft, index) => (
            <div onClick={() => navigateTo(`/drops/${nft.id}`)} className='itm' index={index+1} key={index}>
              <div className="nft_pic">                            
                  <span>
                      <span className="nft_pic_info">
                          <span className="nft_pic_title">{nft.title}</span>
                          <span className="nft_pic_by">{nft.authorName}</span>
                      </span>
                  </span>
                  <div className="nft_pic_wrap">
                      <img src={nft.previewImage} className="lazy img-fluid" alt=""/>
                  </div>
              </div>
            </div>
          ))}
          </Slider>
        </div>
    );
}

export default memo(SliderCarouselRedux);
