import React, { memo } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import config from '../../Assets/networks/rpc_config.json';
import {useHistory} from "react-router-dom";
import {createGlobalStyle} from "styled-components";
export const drops = config.drops;

const GlobalStyles = createGlobalStyle`
  .nft_pic_wrap img {
    max-height: 700px;
  }
  @media only screen and (max-width: 1024px) {
    .nft_pic_wrap img{
      max-height: 450px;
    }
  }
`;

const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    adaptiveHeight: 300,
    centerPadding: '100px',
    responsive: [
        {
            breakpoint: 1900,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true
            }
        },
        {
            breakpoint: 1600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true
            }
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true
            }
        }
    ]
};

const HomeCarousel = () => {
    const history = useHistory();

    const navigateTo = (link) => {
        history.push(link);
    }

  return (
      <div>

          <GlobalStyles/>
          <div className='nft-home-carousel'>
              <Slider {...settings}>
                  {drops && drops.map( (drop, index) => (
                      <div onClick={() => navigateTo(`/drops/${drop.slug}`)} className='itm' index={index+1} key={index}>
                          <div className="nft_pic">
                              <span>
                                  <span className="nft_pic_info">
                                      <span className="nft_pic_title">{drop.title}</span>
                                      <span className="nft_pic_by">{drop.author.username}</span>
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
      </div>
  );
}

export default memo(HomeCarousel);
