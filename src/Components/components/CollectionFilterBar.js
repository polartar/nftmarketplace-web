import React, { memo, useCallback } from 'react';
import Select from 'react-select';
import {useDispatch, useSelector} from 'react-redux';
import { sort } from './constants/filters';
import { sortListings, resetListings, searchListings } from "../../GlobalState/collectionSlice";
import {Form} from "react-bootstrap";

const CollectionFilterBar = ({cacheName = null}) => {
    const dispatch = useDispatch();

    const collection = useSelector((state) => state.collection)

    const sortOptions = useSelector((state) => {
        let sortOptions = sort;
        if(!state.collection.hasRank) {
            sortOptions = sort.filter((s) => s.key !== 'rank');
        }
        return sortOptions;
    });
    
    const handleSort = useCallback((option) => {
        dispatch(sortListings({
            type: option.key,
            direction: option.direction,
            label: option.label
        }, cacheName));
    }, [dispatch]);

    const handleSearch = debounce((event) => {
        const { value } = event.target;
        dispatch(searchListings(value));
    }, 300);

    const handleClear = useCallback(() => {
        dispatch(resetListings());
    }, [dispatch]);

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

    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const defaultSortValue = {
        key: null,
        label: 'None'
    };

    const selectDefaultSortValue = () => {
        const cached = collection.cachedSort[cacheName];
        if (cached) {
            return {
                label: cached.label,
                key: cached.direction
            }
        }

        return defaultSortValue;
    }

    return (
        <>
            <div className='col-lg-9'>
                <div className="items_filter" style={{marginBottom: 0, marginTop: 0}}>
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
                </div>
            </div>
            <div className='col-lg-3'>
                <Form.Control type="text" placeholder="Search" onChange={handleSearch}/>
            </div>
        </>
    );
}

export default memo(CollectionFilterBar);
