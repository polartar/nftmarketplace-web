import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import Footer from '../components/Footer';
import { createGlobalStyle } from 'styled-components';
import TopFilterBar from '../components/TopFilterBar';
import MyNftCollection from "../components/MyNftCollection";
import {Redirect} from "react-router-dom";
import { fetchNfts } from "../../GlobalState/User";
import { getAnalytics, logEvent } from "@firebase/analytics";
import { collectionFilterOptions } from "../components/constants/filter-options";
import { FilterOption } from "../Models/filter-option.model";
import { Form } from "react-bootstrap";

const GlobalStyles = createGlobalStyle`
`;

const MyNfts = () => {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);

    const isLoading = useSelector((state) => state.user.fetchingNfts);

    const nfts = useSelector((state) => user.nfts);

    const [filteredNfts, setFilteredNfts] = useState([]);

    const [possibleCollectionOptions, setPossibleCollectionOptions] = useState(collectionFilterOptions);

    const [filterOption, setFilterOption] = useState(FilterOption.default());

    const [listedOnly, setListedOnly] = useState(false);

    const walletAddress = useSelector((state) => state.user.address)

    useEffect(() => {
        //  reset filter when new nft arrives.
        setFilterOption(FilterOption.default());
        setListedOnly(false);

        //  get possible collections based on nfts.
        const possibleCollections = collectionFilterOptions.filter(collection => {
            const hasFromCollection = !!nfts.find(x => x.address === collection.address);
            return hasFromCollection;
        });

        setPossibleCollectionOptions(possibleCollections);
    }, [nfts]);

    const onFilterChange = useCallback((filterOption) => {
        setFilterOption(filterOption);
    }, [dispatch]);

    useEffect(() => {
        const nftsToFilter = listedOnly ? nfts.filter(nft => nft.listed) : nfts;

        if (filterOption.getOptionValue === null) {
            setFilteredNfts(nftsToFilter);
            return;
        }

        const filteredNfts = nftsToFilter.filter(nft => filterOption.getOptionValue === nft.address);

        const filteredAndListedNfts = filteredNfts.filter(nft => nft.listed);

        setFilteredNfts(listedOnly ? filteredAndListedNfts : filteredNfts);
    }, [filterOption, listedOnly]);


    useEffect(() => {
        dispatch(fetchNfts(user.address, user.provider, user.nftsInitialized));
    }, []);

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'my_nfts'
        })
    }, []);

    const Content = () => (
        <>
            <GlobalStyles/>

            <section className='jumbotron breadcumb no-bg'
                     style={{backgroundImage: `url(${'/img/background/subheader.jpg'})`}}>
                <div className='mainbreadcumb'>
                    <div className='container'>
                        <div className='row m-10-hor'>
                            <div className='col-12 text-center'>
                                <h1>My NFTs</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container'>
                <div className='row'>
                    <div className='col-12 col-sm-6 col-lg-3'>
                        <TopFilterBar className='col-6'
                                      showFilter={true}
                                      showSort={false}
                                      filterOptions={[FilterOption.default(), ...possibleCollectionOptions]}
                                      defaultFilterValue={filterOption}
                                      filterPlaceHolder='Filter Collection...'
                                      onFilterChange={onFilterChange}
                        />
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 m-0 text-nowrap d-flex align-items-center'>
                        <div className="items_filter">
                            <Form.Switch
                                className=""
                                label={'Only listed'}
                                defaultChecked={listedOnly}
                                onChange={() => setListedOnly(!listedOnly)}
                            />
                        </div>
                    </div>
                </div>
                <MyNftCollection
                    walletAddress={walletAddress}
                    nfts={filteredNfts}
                    isLoading={isLoading}
                    user={user}
                />
            </section>

            <Footer/>
        </>
    );


    return (
        <div>
            {(walletAddress)?
                <Content/>
                :
                <Redirect to='/marketplace'/>
            }
        </div>
    );
};
export default MyNfts;
