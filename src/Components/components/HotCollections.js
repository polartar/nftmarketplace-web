import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from "./constants";
import CustomSlide from "./CustomSlide";
import api from "../../core/api";
import card from "../../Assets/collections/crosmonauts/card.png";
import avatar from "../../Assets/collections/crosmonauts/avatar.png";

const HotCollections = () => {

  const dispatch = useDispatch();
  const hotCollections = [
      {
          authorAvatar: avatar,
          bannerUrl: card,
          name: 'Mad Meerkat',
          collectionId: '0x89dBC8Bd9a6037Cbd6EC66C4bF4189c9747B1C56',
          uniqueID: 123
      },
      {
          authorAvatar: avatar,
          bannerUrl: card,
          name: 'Cronos Chimp Club',
          collectionId: '0x562F021423D75A1636DB5bE1C4D99Bc005ccebFe',
          uniqueID: 123
      },
      {
          authorAvatar: avatar,
          bannerUrl: card,
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
              subtitle={"some subtitle"}
              collectionId={item.collectionId}
              url={`/collection/${item.collectionId}`}
            />
          ))}
        </Slider>
      </div>
  );
}

export default memo(HotCollections);
