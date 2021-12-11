import React, { memo, useEffect } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from './constants';
import { useSelector, useDispatch } from 'react-redux';
import api from "../../core/api";

const SliderCarouselRedux = () => {

    const dispatch = useDispatch();
    // const nftsState = useSelector(selectors.nftShowcaseState);
    const nfts = [
        {
            link: '',
            title: 'Cronies',
            authorName: '',
            previewImage: '/mock_data/uploads/big_1_5e0d3a105a.jpg',
        },
        {
            link: '',
            title: 'Founding Member',
            authorName: '',
            previewImage: '/mock_data/uploads/big_1_5e0d3a105a.jpg',
        },
        {
            link: '',
            title: 'Elon\'s Adventures',
            authorName: '',
            previewImage: '/mock_data/uploads/big_1_5e0d3a105a.jpg',
        }
    ];
    
    useEffect(() => {
        // dispatch(fetchNftShowcase());
    }, [dispatch]);

    const navigateTo = (link) => {
        // navigate(link);
    }

    return (
        <div className='nft-big'>
          <Slider {...settings}>
          {nfts && nfts.map( (nft, index) => (
            <div onClick={() => navigateTo(nft.link)} className='itm' index={index+1} key={index}>
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
