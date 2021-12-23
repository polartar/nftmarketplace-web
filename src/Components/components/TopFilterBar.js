import React, { memo, useCallback } from 'react';
import Select from 'react-select';
import {useDispatch, useSelector} from 'react-redux';
import { sort } from './constants/filters';
import { filterListings, sortListings, resetListings, knownContracts } from "../../GlobalState/marketplaceSlice";

const TopFilterBar = ({ showFilter = true, showSort = true, cacheName = null }) => {
    const dispatch = useDispatch();

    const marketplace = useSelector((state) => {
        return state.marketplace;
    });

    const sortOptions = useSelector((state) => {
        let sortOptions = sort;
        if(!state.marketplace.hasRank) {
            sortOptions = sort.filter((s) => s.key !== 'rank');
        }
        return sortOptions;
    });

    const handleCategory = useCallback((option) => {
        dispatch(filterListings({
            type: 'collection',
            address: option.address,
            label: option.name
        }, cacheName));
    }, [dispatch]);

    const handleSort = useCallback((option) => {
        dispatch(sortListings({
            type: option.key,
            direction: option.direction,
            label: option.label
        }, cacheName));
    }, [dispatch]);

    const handleClear = useCallback(() => {
        dispatch(resetListings());
    }, [dispatch]);

    const defaultFilterValue = {
        name: 'All',
        address: null
    };

    const defaultSortValue = {
        label: 'None',
        value: null,
    };

    const selectDefaultFilterValue = () => {
        const cached = marketplace.cachedFilter[cacheName];

        if (cached) {
            return {
                name: cached.label,
                address: cached.address
            }
        }

        return defaultFilterValue;
    }

    const selectDefaultSortValue = () => {
        const cached = marketplace.cachedSort[cacheName];
        if (cached) {
            return {
                label: cached.label,
                value: cached.value
            }
        }

        return defaultSortValue;
    }

    const customStyles = {
        option: (base, state) => ({
            ...base,
            background: "#fff",
            color: "#333",
            borderRadius: state.isFocused ? "0" : 0,
            "&:hover": {
                background: "#eee",
            }
        }),
        menu: base => ({
            ...base,
            borderRadius: 0,
            marginTop: 0
        }),
        menuList: base => ({
            ...base,
            padding: 0
        }),
        control: (base, state) => ({
            ...base,
            padding: 2
        })
    };

    return (
        <div className="items_filter">
            { showFilter && (
                <div className='dropdownSelect one'>
                    <Select
                        styles={customStyles}
                        placeholder={'Filter Collection...'}
                        options={[defaultFilterValue, ...knownContracts.sort((a, b) => a.name > b.name ? 1 : -1)]}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.address}
                        defaultValue={selectDefaultFilterValue()}
                        onChange={handleCategory}
                    />
                </div>
            )}
            {showSort && (
                <div className='dropdownSelect two'>
                    <Select
                        styles={customStyles}
                        placeholder={'Sort Listings...'}
                        options={[defaultSortValue,...sortOptions]}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.key}
                        defaultValue={selectDefaultSortValue()}
                        onChange={handleSort}
                    />
                </div>
            )}
        </div>
    );
};

export default memo(TopFilterBar);
