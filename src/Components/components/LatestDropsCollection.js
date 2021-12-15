import React, { memo, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from "./constants";
import CustomSlide from "./CustomSlide";

const LatestDropsCollection = () => {

  const dispatch = useDispatch();

    const drops = useSelector((state) => {
        return state.initState.nftCard;
    });

  const hotCollections = [
      {
          authorAvatar: '/mock_data/uploads/thumbnail_author_1_6f9ad9e11a.jpg',
          bannerUrl: '/mock_data/banners/author_banner_1d2c434cf5.jpg',
          name: drops[4].title,
          collectionId: drops[4].address,
          uniqueID: drops[4].id,
          status: 'LIVE'
      },
      {
          authorAvatar: '/mock_data/uploads/thumbnail_author_1_6f9ad9e11a.jpg',
          bannerUrl: '/mock_data/banners/author_banner_1d2c434cf5.jpg',
          name: drops[3].title,
          collectionId: drops[3].address,
          uniqueID: drops[3].id,
          status: 'LIVE'
      },
      {
          authorAvatar: '/mock_data/uploads/thumbnail_author_1_6f9ad9e11a.jpg',
          bannerUrl: '/mock_data/banners/author_banner_1d2c434cf5.jpg',
          name: drops[2].title,
          collectionId: drops[2].address,
          uniqueID: drops[2].id,
          status: 'LIVE'
      },
      {
          authorAvatar: '/mock_data/uploads/thumbnail_author_1_6f9ad9e11a.jpg',
          bannerUrl: '/mock_data/banners/author_banner_1d2c434cf5.jpg',
          name: drops[1].title,
          collectionId: drops[1].address,
          uniqueID: drops[1].id,
          status: 'LIVE'
      },
      {
          authorAvatar: '/mock_data/uploads/thumbnail_author_1_6f9ad9e11a.jpg',
          bannerUrl: '/mock_data/banners/author_banner_1d2c434cf5.jpg',
          name: drops[0].title,
          collectionId: drops[0].address,
          uniqueID: drops[0].id,
          status: 'LIVE'
      },
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
              subtitle={item.status}
              collectionId={item.collectionId}
              url={`/drops/${item.uniqueID}`}
            />
          ))}
        </Slider>
      </div>
  );
}

export default memo(LatestDropsCollection);
