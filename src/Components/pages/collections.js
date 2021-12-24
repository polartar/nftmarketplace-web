import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import config from "../../Assets/networks/rpc_config.json";
import {getAllCollections} from "../../GlobalState/collectionsSlice";
import {useHistory} from "react-router-dom";
import {ethers} from "ethers";
import Blockies from "react-blockies";
import {Spinner} from "react-bootstrap";

const GlobalStyles = createGlobalStyle`
`;

const Collections = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const isLoading = useSelector((state) => state.collections.loading)
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

            <section className='container no-top'>
                {isLoading &&
                    <div className='row mt-4'>
                        <div className='col-lg-12 text-center'>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    </div>
                }
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
                                        <div className="coll_list_pp" style={{cursor: 'pointer'}} onClick={viewCollection(collection.collection)}>
                                            {collection.metadata?.avatar ?
                                                <img className="lazy" src={collection.metadata.avatar} alt="" />
                                            :
                                                <Blockies seed={collection.collection.toLowerCase()} size={10} scale={5} />
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