import React, { memo } from 'react';
import {Accordion, Form} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {humanize} from "../../utils";
import {filterListingsByTrait} from "../../GlobalState/collectionSlice";

const PowertraitsFilter = ({address}) => {
    const dispatch = useDispatch();

    const collectionStats = useSelector((state) => state.collection.stats);
    const collectionCachedTraitsFilter = useSelector((state) => state.collection.cachedPowertraitsFilter);

    const viewPowertraitsList = () => {
        if (!collectionStats || !collectionStats.powertraits) {
            return [];
        }

        return Object.entries(collectionStats.powertraits);
    }

    const viewSelectedAttributesCount = () => {
        const cachedTraitsFilter = collectionCachedTraitsFilter[address] || {};
        return Object.values(cachedTraitsFilter)
            .map(traitCategoryValue => Object.values(traitCategoryValue).filter(x => x === true).length)
            .reduce((prev, curr) => prev + curr, 0);
    };

    const traitStatName = (name, stats) => {
        let ret = humanize(name);
        if (stats && stats.count > 0) {
            ret = ret.concat(` (${stats.count})`);
        }

        return ret;
    }

    const viewGetDefaultCheckValue = (traitCategory, id) => {
        const cachedTraitsFilter = collectionCachedTraitsFilter[address] || {};

        if (!cachedTraitsFilter || !cachedTraitsFilter[traitCategory]) {
            return false;
        }

        return cachedTraitsFilter[traitCategory][id] || false;
    };

    const clearAttributeFilters = () => {
        const inputs = document.querySelectorAll(".powertrait-checkbox input[type=checkbox]");
        for (const item of inputs) {
            item.checked = false;
        }
        dispatch(filterListingsByTrait({
            powertraits: {},
            address
        }))
    }

    const handleCheck = (event, traitCategory) => {
        const { id, checked } = event.target;

        const cachedTraitsFilter = collectionCachedTraitsFilter[address] || {};

        dispatch(filterListingsByTrait({
            powertraits: {
                ...cachedTraitsFilter,
                [traitCategory]: {
                    ...cachedTraitsFilter[traitCategory] || {},
                    [id]: checked
                }
            },
            address
        }))
    }

    return (
        <>
            <div className="d-flex justify-content-between align-middle mb-4">
                <h3 className="d-inline-block" style={{marginBottom:0}}>In-Game Attributes { viewSelectedAttributesCount() ? `(${viewSelectedAttributesCount()} selected)` : '' }</h3>
                {viewSelectedAttributesCount() > 0 &&
                <div className="d-inline-block fst-italic my-auto"
                     style={{fontSize: '0.8em', cursor: 'pointer'}}
                     onClick={clearAttributeFilters}>Clear</div>
                }
            </div>
            <Accordion>
                {viewPowertraitsList().map(([traitCategoryName, traitCategoryValues], key) => (
                    <Accordion.Item eventKey={key} key={key}>
                        <Accordion.Header>{traitCategoryName}</Accordion.Header>
                        <Accordion.Body>
                            {Object.entries(traitCategoryValues).filter(t => t[1].count > 0).sort((a, b) => (a[0] > b[0]) ? 1 : -1).map((stats) => (
                                <div key={`${traitCategoryName}-${stats[0]}`}>
                                    <Form.Check
                                        type="checkbox"
                                        id={stats[0]}
                                        className="powertrait-checkbox"
                                        label={traitStatName(stats[0], stats[1])}
                                        defaultChecked={viewGetDefaultCheckValue(traitCategoryName, stats[0])}
                                        value={viewGetDefaultCheckValue(traitCategoryName, stats[0])}
                                        onChange={(t) => handleCheck(t, traitCategoryName)}
                                    />
                                </div>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </>
    );
};

export default memo(PowertraitsFilter);