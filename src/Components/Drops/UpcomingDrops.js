import React, {memo, useEffect, useState} from "react";
import { useDispatch } from 'react-redux';
import Slider from "react-slick";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from "../components/constants";
import CustomSlide from "../components/CustomSlide";
import config from '../../Assets/networks/rpc_config.json'
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {drops} from "./PastDrops";
export const collections = config.known_contracts;

const UpcomingDrops = () => {

  const dispatch = useDispatch();

  const [upcomingDrops, setUpcomingDrops] = useState([]);

  function arrangeCollections() {
      const nextDrops = drops.filter(d => !d.complete && d.published && d.start > Date.now());
      const dropCollections = nextDrops.map(d => {
          const collection = collections.find(c => {
              const collectionSlug = c.slug ?? c.metadata.slug;
              return collectionSlug && collectionSlug === d.slug
          });
          return {collection, drop: d};
      })
      setUpcomingDrops(dropCollections
          .filter(d => d.collection)
          .sort((a, b) => (a.drop.start > b.drop.start) ? 1 : -1)
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

          <Slider {...settings}
            prevArrow={<PrevArrow />}
            nextArrow={<NextArrow />}
          >

          { upcomingDrops && upcomingDrops.map((item, index) => (
              <CustomSlide
                  key={index}
                  index={index + 1}
                  avatar={item.drop.imgAvatar}
                  banner={item.collection.metadata.card}
                  title={item.drop.title}
                  subtitle={`${new Date(item.drop.start).toDateString()}`}
                  collectionId={item.drop.slug}
                  url={`/drops/${item.drop.slug}`}
                  verified={true}
              />
          ))}
        </Slider>
      </div>
  );
}

export default memo(UpcomingDrops);
