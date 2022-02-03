import React, {memo, useEffect, useState} from "react";
import { useDispatch } from 'react-redux';
import Slider from "react-slick";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from "./constants";
import CustomSlide from "../components/CustomSlide";
import config from '../../Assets/networks/rpc_config.json'
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
export const drops = config.drops;
export const collections = config.known_contracts;

const carouselSetings = {
    ...settings,
    slidesToShow: 3,
    slidesToScroll: 3,
}

const CurrentDrops = () => {

  const dispatch = useDispatch();

  const [currentDrops, setCurrentDrops] = useState([]);

  function arrangeCollections() {
      const liveDrops = drops
          .filter(d => !d.complete && d.published && d.start < Date.now());
      const dropCollections = liveDrops.map(d => {
          const collection = collections.find(c => {
              const collectionSlug = c.slug ?? c.metadata.slug;
              return collectionSlug && collectionSlug === d.slug
          });
          return {collection, drop: d};
      })
      setCurrentDrops(dropCollections
          .filter(d => d.collection)
          .sort((a, b) => (a.drop.start < b.drop.start) ? 1 : -1)
      );
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

          <Slider {...carouselSetings}
            prevArrow={<PrevArrow />}
            nextArrow={<NextArrow />}
          >

          { currentDrops && currentDrops.map((item, index) => (
              <CustomSlide
                  key={index}
                  index={index + 1}
                  avatar={item.drop.imgAvatar}
                  banner={item.collection.metadata.card}
                  title={item.drop.title}
                  subtitle={item.drop.author.name}
                  collectionId={item.drop.slug}
                  url={`/drops/${item.drop.slug}`}
                  verified={true}
              />
          ))}
        </Slider>
      </div>
  );
}

export default memo(CurrentDrops);
