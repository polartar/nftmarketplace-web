import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import {getAllCollections} from "../../GlobalState/collectionsSlice";
import {useHistory} from "react-router-dom";
import {ethers} from "ethers";
import Blockies from "react-blockies";
import {Spinner} from "react-bootstrap";

const GlobalStyles = createGlobalStyle`
  .mobile-view-list-item {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    
    & > span:nth-child(2) {
      font-weight: 300;
    }
  }
`;

const Collections = () => {
    const mobileListBreakpoint = 1000;

    const dispatch = useDispatch();
    const history = useHistory();

    const [tableMobileView, setTableMobileView] = useState(window.innerWidth > mobileListBreakpoint);

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


    useEffect(() => {
        const onResize = ({ currentTarget }) => {
            const { innerWidth } = currentTarget;
            setTableMobileView(innerWidth > mobileListBreakpoint);
        };

        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);
    }, []);

    const sortCollections = (key) => () => {
        let direction = 'asc';
        if (key === sort.key) {
            direction = sort.direction === 'asc' ? 'desc' : 'asc';
        }
        dispatch(getAllCollections(key, direction));
    };

    //  collection helper pipes
    const collectionTotalVolumeValue = ({ totalVolume }) => `${ ethers.utils.commify(Math.round(totalVolume)) } CRO`;
    const collectionNumberOfSalesValue = ({ numberOfSales }) => numberOfSales;
    const collectionFloorPriceValue = ({ floorPrice }) => `${ethers.utils.commify(Math.round(floorPrice))} CRO`;
    const collectionAverageSalePriceValue = ({ averageSalePrice }) => `${ethers.utils.commify(Math.round(averageSalePrice))} CRO`;
    const collectionNumberActiveValue = ({ numberActive }) => numberActive;

    return (
        <div>
            <GlobalStyles/>
            <section className='jumbotron breadcumb no-bg'
                     style={{backgroundImage: `url(${'./img/background/subheader.jpg'})`}}>
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
                        <table className="table de-table table-rank"
                               data-mobile-responsive="true"
                        >
                            <thead>
                                <tr>
                                    <th scope="col" style={{cursor: 'pointer'}} onClick={sortCollections('name')}>Collection</th>
                                    { tableMobileView && <th scope="col" style={{cursor: 'pointer'}} onClick={sortCollections('totalVolume')}>Volume</th>}
                                    { tableMobileView && <th scope="col" style={{cursor: 'pointer'}} onClick={sortCollections('numberOfSales')}>Sales</th>}
                                    { tableMobileView && <th scope="col" style={{cursor: 'pointer'}} onClick={sortCollections('floorPrice')}>Floor Price</th>}
                                    { tableMobileView && <th scope="col" style={{cursor: 'pointer'}} onClick={sortCollections('averageSalePrice')}>Avg. Price</th>}
                                    { tableMobileView && <th scope="col" style={{cursor: 'pointer'}} onClick={sortCollections('numberActive')}>Active Listings</th>}
                                </tr>
                                <tr/>
                            </thead>
                            <tbody>
                            {collections && collections.map( (collection, index) => {
                                return (
                                <tr key={index}>
                                    <th scope="row" className='row gap-4 border-bottom-0'>
                                        <div className="col-12">
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
                                        </div>

                                        {!tableMobileView &&
                                            <div className="col-12 row gap-1">
                                                <div className='col-12 mobile-view-list-item' onClick={sortCollections('totalVolume')}>
                                                    <span>Volume</span>
                                                    <span>{collectionTotalVolumeValue(collection)}</span>
                                                </div>
                                                <div className='col-12 mobile-view-list-item' onClick={sortCollections('numberOfSales')}>
                                                    <span>Sales</span>
                                                    <span>{collectionNumberOfSalesValue(collection)}</span>
                                                </div>
                                                <div className='col-12 mobile-view-list-item' onClick={sortCollections('floorPrice')}>
                                                    <span>Floor Price</span>
                                                    <span>{collectionFloorPriceValue(collection)}</span>
                                                </div>
                                                <div className='col-12 mobile-view-list-item' onClick={sortCollections('averageSalePrice')}>
                                                    <span>Avg. Price</span>
                                                    <span>{collectionAverageSalePriceValue(collection)}</span>
                                                </div>
                                                <div className='col-12 mobile-view-list-item' onClick={sortCollections('numberActive')}>
                                                    <span>Active Listings</span>
                                                    <span>{collectionNumberActiveValue(collection)}</span>
                                                </div>
                                            </div>
                                        }
                                    </th>
                                    {tableMobileView && <td>{collectionTotalVolumeValue(collection)}</td>}
                                    {tableMobileView && <td>{collectionNumberOfSalesValue(collection)}</td>}
                                    {tableMobileView && <td>{collectionFloorPriceValue(collection)}</td>}
                                    {tableMobileView && <td>{collectionAverageSalePriceValue(collection)}</td>}
                                    {tableMobileView && <td>{collectionNumberActiveValue(collection)}</td>}
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
