import React, {memo, useEffect, useState} from "react";
import { useDispatch } from 'react-redux';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from "./constants";
import CustomSlide from "./CustomSlide";
import config from '../../Assets/networks/rpc_config.json'
export const collections = config.known_contracts;

const HotCollections = () => {

  const dispatch = useDispatch();

  const [hotCollections, setHotCollections] = useState([]);

  function arrangeCollections() {
      const shortList = [
          'crosmonauts',
          'petite-planets-gen2',
          'cronos-chimp-club',
          'mad-meerkats',
      ];

      const featuredCollections = [];
      shortList.forEach(function(val,index) {
          const collection = collections.find(c => c.metadata?.banner && c.metadata.slug === val);
          if (collection) featuredCollections.push(collection);
      });

      const otherCollections = collections
          .filter(c => c.metadata?.banner && !shortList.includes(c.metadata.slug))
          .sort((a, b) => (a.name > b.name) ? 1 : -1);

      const listableCollectios = [...featuredCollections, ...otherCollections].filter(c => c.listable);
      setHotCollections(listableCollectios);
  }

  useEffect(() => {
      arrangeCollections();
  }, [dispatch]);

  return (
      <div className='nft'>
        <Slider {...settings}>
          { hotCollections && hotCollections.map((item, index) => (
            <CustomSlide
              key={index}
              index={index + 1}
              avatar={item.metadata.avatar}
              banner={item.metadata.card}
              title={item.name}
              collectionId={item.address}
              url={`/collection/${item.address}`}
              verified={item.metadata.verified}
            />
          ))}
        </Slider>
      </div>
  );
}

export default memo(HotCollections);
