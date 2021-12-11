import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NftCard from './NftCard';
import { fetchNfts } from "../../GlobalState/userSlice";

const MyNftCollection = ({ showLoadMore = true, walletAddress = null}) => {

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user)
    const currentUserWallet = useSelector((state) => state.wallet)
    const nfts = useSelector((state) => currentUser.nfts)

    const [height, setHeight] = useState(0);

    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }

    const canLoadMore = useSelector((state) => {
        return state.user.curPage < state.user.totalPages;
    });

    useEffect(() => {
        dispatch(fetchNfts(currentUserWallet.address, currentUserWallet.provider));
    }, [dispatch]);

    // //will run when component unmounted
    // useEffect(() => {
    //     return () => {
    //         dispatch(clearFilter());
    //         dispatch(clearNfts());
    //     }
    // },[dispatch]);

    const loadMore = () => {
        dispatch(fetchNfts());
    }

    return (
        <div className='row'>

            {nfts && nfts.map( (nft, index) => (
                <NftCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} />
            ))}
            { showLoadMore && canLoadMore &&
                <div className='col-lg-12'>
                    <div className="spacer-single"></div>
                    <span onClick={loadMore} className="btn-main lead m-auto">Load More</span>
                </div>
            }
        </div>              
    );
};

export default memo(MyNftCollection);