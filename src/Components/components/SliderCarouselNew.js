import React, { Component } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Clock from "./Clock";
import { createGlobalStyle } from 'styled-components';
import config from "../../Assets/networks/rpc_config.json";
import {humanize} from "../../utils";
import Blockies from "react-blockies";
export const drops = config.drops;

const GlobalStyles = createGlobalStyle`
  .nft-big .slick-prev::before{
    left: 0;
    line-height: 40px;
  }
  .nft-big .slick-next::before {
    right: 0;
    line-height: 40px;
  }
  .nft-big .slick-prev, .nft-big .slick-next{
    border: 1px solid #ccc;
    box-shadow: 5px 5px 30px 0px rgba(0, 0, 0, 0.2);
    width: 50px;
    height: 50px;
  }
`;

class CustomSlide extends Component {
  render() {
    const { index, ...props } = this.props;
    return (
      <div {...props}></div>
    );

      
  }
}

export default class Responsive extends Component {

  constructor(props) {
      super(props);
      this.state = { deadline: "January, 10, 2022", deadline1: "February, 10, 2022", deadline2: "February, 1, 2022", height: 0 };
    }

  render() {
    var settings = {
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


    return (
        <div className='nft-big'>
          <GlobalStyles />
          <Slider {...settings}>
              { drops && drops.reverse().map((drop, index) => (
                  <CustomSlide className='itm' index={index}>
                      <div className="nft__item_lg">
                          <div className="row align-items-center">
                              <div className="col-lg-6">
                                  <img src={drop.imgPreview} className="img-fluid mx-auto" alt=""/>
                              </div>
                              <div className="col-lg-6">
                                  <div className="d-desc">
                                      <h2>{drop.title}</h2>
                                      <div className="d-author">
                                          <div className="author_list_pp">
                                              {drop.imgAvatar ?
                                                  <img className="lazy" src={drop.imgAvatar} alt=""/>
                                                  :
                                                  <Blockies seed={drop.slug} size={10} scale={5}/>
                                              }
                                              <i className="fa fa-check"></i>
                                          </div>
                                          <div className="author_list_info">
                                              <div className='title'>{drop.author.name}</div>
                                              <div className='subtitle'>
                                                  {drop.author.link &&
                                                  <span className="profile_username">
                                                        <a href={drop.author.link} target="_blank">View Website</a>
                                                    </span>
                                                  }
                                              </div>
                                          </div>
                                      </div>
                                      <div className="d-attr">
                                          <div className='col'>
                                              <span className="d-title">Mint Price</span>
                                              <h3>{humanize(drop.cost)} CRO</h3>
                                              <h5>Members: {humanize(drop.memberCost)} CRO</h5>
                                          </div>
                                          <div className="line"></div>
                                          <div className='col'>
                                            {new Date(drop.start) < Date.now() ?
                                                <>
                                                  {drop.end != null ?
                                                        <>
                                                          {new Date(drop.end) < Date.now() ?
                                                              <>
                                                                <div className="de_countdown">
                                                                  ENDED
                                                                </div>
                                                              </>
                                                              :
                                                              <>
                                                                <span className="d-title">Drop ends in</span>
                                                                <div className="de_countdown">
                                                                  <Clock deadline={drop.end}/>
                                                                </div>
                                                                <h5>{new Date(drop.end).toDateString()}, {new Date(drop.end).toTimeString()}</h5>
                                                              </>
                                                          }
                                                        </>
                                                        :
                                                        <>
                                                          <span className="d-title">Drop ends in</span>
                                                          <h3>Drop is Live!</h3>
                                                        </>
                                                  }
                                                </>
                                              :
                                                <>
                                                  <span className="d-title">Drop starts in</span>
                                                  <div className="de_countdown">
                                                    <Clock deadline={drop.start} />
                                                  </div>
                                                  <h5>{new Date(drop.start).toDateString()}, {new Date(drop.start).toTimeString()}</h5>
                                                </>
                                            }

                                          </div>
                                      </div>
                                      <div className="spacer-10"></div>
                                      <div className="d-buttons">
                                          <span className="btn-main" onClick={()=> window.open(`/drops/${drop.slug}`, "_self")}>View Drop</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </CustomSlide>
              ))}

          </Slider>
        </div>
    );
  }
}
