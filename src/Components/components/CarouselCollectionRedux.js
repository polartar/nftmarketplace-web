import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from "./constants";
import CustomSlide from "./CustomSlide";
import api from "../../core/api";

const CarouselCollectionRedux = () => {

  const dispatch = useDispatch();
  const hotCollections = [
      {
          authorAvatar: '/mock_data/uploads/thumbnail_author_1_6f9ad9e11a.jpg',
          bannerUrl: '/mock_data/uploads/author_banner_1d2c434cf5.jpg',
          name: 'Mad Meerkat',
          collectionId: 10,
          uniqueID: 123
      },
      {
          authorAvatar: '/mock_data/uploads/thumbnail_author_1_6f9ad9e11a.jpg',
          bannerUrl: '/mock_data/uploads/author_banner_1d2c434cf5.jpg',
          name: 'Cronos Chimp Club',
          collectionId: 10,
          uniqueID: 123
      },
      {
          authorAvatar: '/mock_data/uploads/thumbnail_author_1_6f9ad9e11a.jpg',
          bannerUrl: '/mock_data/uploads/author_banner_1d2c434cf5.jpg',
          name: 'Crosmonauts',
          collectionId: 10,
          uniqueID: 123
      }
  ];

  useEffect(() => {
    // dispatch(fetchHotCollections());
}, [dispatch]);

  return (
      <div className='nft'>
        <Slider {...settings}>
          { hotCollections && hotCollections.map((item, index) => (
            <CustomSlide
              key={index}
              index={index + 1}
              avatar={item.authorAvatar}
              banner={item.bannerUrl}
              username={item.name}
              uniqueId={item.uniqueID}
              collectionId={item.collectionId}
            />
          ))}
        </Slider>
      </div>
  );
}

export default memo(CarouselCollectionRedux);
