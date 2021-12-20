import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import config from "../../Assets/networks/rpc_config.json";
import {getAllCollections} from "../../GlobalState/collectionsSlice";
import {useHistory} from "react-router-dom";
import {ethers} from "ethers";
import Blockies from "react-blockies";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background-color: #ff7814;
    border-bottom: solid 1px #ff7814;
    background-image: linear-gradient(to right, #ff690e, #ffb84e)
    -webkit-transform: translate3d(0,0,0);
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);;
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #ff7814;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;

const Collections = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const collections = useSelector((state) => {
        return state.collections.collections;
    });
    const sort = useSelector((state) => {
        return state.collections.sort;
    });

    const viewCollection = (collectionAddress) => () => {
        history.push(`/collection/${collectionAddress}`);
    }

    useEffect(async () => {
        dispatch(getAllCollections());
    }, []);

    const sortCollections = (key) => () => {
        let direction = 'asc';
        if (key === sort.key) {
            direction = sort.direction === 'asc' ? 'desc' : 'asc';
        }
        dispatch(getAllCollections(key, direction));
    };
    
    return (
        <div>
            <GlobalStyles/>
            <section className='jumbotron breadcumb no-bg'
                     style={{backgroundImage: `url(${'./img/background/subheader.png'})`}}>
                <div className='mainbreadcumb'>
                    <div className='container'>
                        <div className='row m-10-hor'>
                            <div className='col-12'>
                                <h1 className='text-center'>Collections</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <table className="table de-table table-rank">
                            <thead>
                            <tr>
                                <th scope="col" style={{cursor: 'pointer'}} onClick={sortCollections('name')}>Collection</th>
                                <th scope="col" style={{cursor: 'pointer'}} onClick={sortCollections('totalVolume')}>Volume</th>
                                <th scope="col" style={{cursor: 'pointer'}} onClick={sortCollections('numberOfSales')}>Sales</th>
                                <th scope="col" style={{cursor: 'pointer'}} onClick={sortCollections('floorPrice')}>Floor Price</th>
                                <th scope="col" style={{cursor: 'pointer'}} onClick={sortCollections('averageSalePrice')}>Avg. Price</th>
                                <th scope="col" style={{cursor: 'pointer'}} onClick={sortCollections('numberActive')}>Active Listings</th>
                            </tr>
                            <tr></tr>
                            </thead>
                            <tbody>
                            {collections && collections.map( (collection, index) => {
                                return (
                                <tr>
                                    <th scope="row">
                                        <div className="coll_list_pp">
                                            {collection.metadata?.avatar ?
                                                <img className="lazy" src={collection.metadata.avatar} alt=""/>
                                            :
                                                <Blockies seed={collection.collection.toLowerCase()} size={10} scale={5}/>
                                            }
                                        </div>
                                        <span style={{cursor: 'pointer'}} onClick={viewCollection(collection.collection)}>
                                            {collection?.name ?? 'Unknown'}
                                        </span>
                                    </th>
                                    <td>{ethers.utils.commify(Math.round(collection.totalVolume))} CRO</td>
                                    <td>{collection.numberOfSales}</td>
                                    <td>{ethers.utils.commify(Math.round(collection.floorPrice))} CRO</td>
                                    <td>{ethers.utils.commify(Math.round(collection.averageSalePrice))} CRO</td>
                                    <td>{collection.numberActive}</td>
                                </tr>
                            )})}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>


            <Footer />
        </div>
    );
};
export default Collections;