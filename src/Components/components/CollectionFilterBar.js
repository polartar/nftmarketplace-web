import React, { memo, useCallback } from 'react';
import Select from 'react-select';
import {useDispatch, useSelector} from 'react-redux';
import { sort } from './constants/filters';
import { sortListings, resetListings } from "../../GlobalState/collectionSlice";

const CollectionFilterBar = () => {
    const dispatch = useDispatch();

    const sortOptions = useSelector((state) => {
        let sortOptions = sort;
        if(!state.collection.hasRank) {
            sortOptions = sort.filter((s) => s.key !== 'rank');
        }
        return sortOptions;
    });
    
    const handleSort = useCallback((option) => {
        dispatch(sortListings(option.key, option.direction));
    }, [dispatch]);

    const handleClear = useCallback(() => {
        dispatch(resetListings());
    }, [dispatch]);

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
        <div className='col-lg-12'>
            <div className="items_filter">
                <div className='dropdownSelect two'>
                    <Select
                        styles={customStyles}
                        placeholder={'Sort Listings...'}
                        options={[defaultSortValue,...sortOptions]}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.key}
                        onChange={handleSort}
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(CollectionFilterBar);