import React, { memo, useCallback } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { sort } from './constants/filters';
import { filterListings, sortListings, resetListings, knownContracts } from "../../GlobalState/marketplaceSlice";
import {useHistory} from "react-router-dom";

const TopFilterBar = ({showFilter = true, showSort = true}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const handleCategory = useCallback((option) => {
        dispatch(filterListings('collection', option.address));
    }, [dispatch]);
    
    const handleSort = useCallback((option) => {
        dispatch(sortListings(option.key, option.direction));
    }, [dispatch]);

    const handleClear = useCallback(() => {
        dispatch(resetListings());
    }, [dispatch]);

    const defaultFilterValue = {
        name: 'All',
        address: null
    };

    const defaultSortValue = {
        key: null,
        label: 'None'
    };

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
            {showFilter && (
                <div className='dropdownSelect one'>
                    <Select
                        styles={customStyles}
                        placeholder={'Filter Collection...'}
                        options={[defaultFilterValue, ...knownContracts.sort((a, b) => a.name > b.name ? 1 : -1)]}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.address}
                        onChange={handleCategory}
                    />
                </div>
            )}
            {showSort && (
                <div className='dropdownSelect two'>
                    <Select
                        styles={customStyles}
                        placeholder={'Sort Listings...'}
                        options={[defaultSortValue,...sort]}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.key}
                        onChange={handleSort}
                    />
                </div>
            )}
            <span  className="btn-main">View Marketplace</span>

        </div>
    );
}

export default memo(TopFilterBar);