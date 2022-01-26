import React, {memo, useEffect, useState} from "react";
import { useDispatch } from 'react-redux';
import Slider from "react-slick";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from "./constants";
import CustomSlide from "./CustomSlide";
import config from '../../Assets/networks/rpc_config.json'
import { faArrowLeft, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
export const collections = config.known_contracts;

const HotCollections = () => {

  const dispatch = useDispatch();

  const [hotCollections, setHotCollections] = useState([]);

  function arrangeCollections() {
      const shortList = [
          'croskull',
          'lazy-horse',
          'cronos-monkey-business',
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

    const PrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div className={className} style={style} onClick={onClick} >
                <FontAwesomeIcon icon={faChevronLeft}/>
            </div>
        );
    }

    const NextArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div className={className} style={style} onClick={onClick} >
                <FontAwesomeIcon icon={faChevronRight}/>
            </div>
        );
    }

  return (
      <div className='nft'>

          <Slider {...settings}
            prevArrow={<PrevArrow />}
            nextArrow={<NextArrow />}
          >

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
