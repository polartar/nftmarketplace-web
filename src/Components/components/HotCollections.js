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

  useEffect(() => {
      let slugs = [
          'cronos-chimp-club',
          'crosmonauts',
          'mad-meerkats'
      ];
      let featuredCollections = collections.filter(c => c.metadata && slugs.includes(c.metadata.slug));
      setHotCollections(featuredCollections);
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
              subtitle={"some subtitle"}
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
