import React, { memo, useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import NftCard from './NftCard';
import TopFilterBar from "./TopFilterBar";
import { FilterOption } from "../Models/filter-option.model";
import { Form, Spinner } from "react-bootstrap";
import { collectionFilterOptions } from "./constants/filter-options";
import { MyNftPageActions } from "../../GlobalState/User";

const mapStateToProps = (state) => ({
    nfts: state.user.nfts,
    isLoading: state.user.fetchingNfts
});

const NftCardList = ({nfts = [], isLoading }) => {

    const EBISUSBAY_ADDRESS = '0x3F1590A5984C89e6d5831bFB76788F3517Cdf034';

    const dispatch = useDispatch();

    const [filteredNfts, setFilteredNfts] = useState([]);

    const [possibleCollectionOptions, setPossibleCollectionOptions] = useState(collectionFilterOptions);

    const [filterOption, setFilterOption] = useState(FilterOption.default());

    const [listedOnly, setListedOnly] = useState(false);

    useEffect(() => {
        console.log('new nft')
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

        const filteredNfts = nftsToFilter.filter(nft => {
            const isSameAddress = filterOption.getOptionValue === nft.address;

            //  Separate Founder and VIP collections in MyNFTs filter
            if (nft.address !== EBISUSBAY_ADDRESS) {
                return isSameAddress;
            }

            const hasId = !!nft.id;

            if (!hasId) {
                return isSameAddress;
            }

            const isSameId = filterOption.id === nft.id;

            return isSameId && isSameAddress;
        });

        const filteredAndListedNfts = filteredNfts.filter(nft => nft.listed);

        setFilteredNfts(listedOnly ? filteredAndListedNfts : filteredNfts);
    }, [filterOption, listedOnly]);

    return (
        <>
            <div className='row'>
                <div className='col-12 col-sm-6 col-lg-3'>
                    <TopFilterBar className='col-6'
                                  showFilter={true}
                                  showSort={false}
                                  filterOptions={[FilterOption.default(), ...possibleCollectionOptions]}
                                  defaultFilterValue={filterOption}
                                  filterPlaceHolder='Filter Collection...'
                                  onFilterChange={onFilterChange}
                                  filterValue={filterOption}
                    />
                </div>
                <div className='col-12 col-sm-6 col-md-4 m-0 text-nowrap d-flex align-items-center'>
                    <div className="items_filter">
                        <Form.Switch
                            className=""
                            label={'Only listed'}
                            checked={listedOnly}
                            onChange={() => setListedOnly(!listedOnly)}
                        />
                    </div>
                </div>
            </div>
            <div className='row'>

                <div className='card-group'>
                    {filteredNfts && filteredNfts.map( (nft, index) => (
                        <div className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2"
                             key={`${nft.address}-${nft.id}-${nft.listed}-${index}`}
                        >
                            <NftCard
                                nft={nft}
                                key={index}
                                canTransfer={true}
                                canSell={nft.listable && !nft.listed}
                                canCancel={nft.listed && nft.listingId}
                                canUpdate={nft.listable && nft.listed}
                                onTransferButtonPressed={() => dispatch(MyNftPageActions.ShowMyNftPageTransferDialog(nft))}
                                onSellButtonPressed={() => dispatch(MyNftPageActions.ShowMyNftPageListDialog(nft))}
                                onUpdateButtonPressed={() => dispatch(MyNftPageActions.ShowMyNftPageListDialog(nft))}
                                onCancelButtonPressed={() => dispatch(MyNftPageActions.ShowMyNftPageCancelDialog(nft))}
                                newTab={true}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="row">
                {!isLoading && nfts.length === 0 &&
                    <div className='row mt-4'>
                        <div className='col-lg-12 text-center'>
                            <span>Nothing to see here...</span>
                        </div>
                    </div>
                }
            </div>
            <div className="row">
                {isLoading &&
                    <div className='row mt-4'>
                        <div className='col-lg-12 text-center'>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    </div>
                }
            </div>
        </>
    );
};

export default connect(mapStateToProps)(memo(NftCardList));
