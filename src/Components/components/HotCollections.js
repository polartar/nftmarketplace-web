import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from "./constants";
import CustomSlide from "./CustomSlide";
import api from "../../core/api";

const HotCollections = () => {

  const dispatch = useDispatch();
  const hotCollections = [
      {
          authorAvatar: '/mock_data/uploads/thumbnail_author_1_6f9ad9e11a.jpg',
          bannerUrl: '/mock_data/banners/meerkat_bg.jpg',
          name: 'Mad Meerkat',
          collectionId: '0x89dBC8Bd9a6037Cbd6EC66C4bF4189c9747B1C56',
          uniqueID: 123
      },
      {
          authorAvatar: '/mock_data/uploads/thumbnail_author_1_6f9ad9e11a.jpg',
          bannerUrl: '/mock_data/banners/ccc_bg.png',
          name: 'Cronos Chimp Club',
          collectionId: '0x562F021423D75A1636DB5bE1C4D99Bc005ccebFe',
          uniqueID: 123
      },
      {
          authorAvatar: '/mock_data/uploads/thumbnail_author_1_6f9ad9e11a.jpg',
          bannerUrl: '/mock_data/banners/author_banner_1d2c434cf5.jpg',
          name: 'Crosmonauts',
          collectionId: '0xDFab622fC4E5CE1420F83cf38E52312f33849a0A',
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
              title={item.name}
              subtitle={item.uniqueID}
              collectionId={item.collectionId}
              url={`/collections/${item.collectionId}`}
            />
          ))}
        </Slider>
      </div>
  );
}

export default memo(HotCollections);
