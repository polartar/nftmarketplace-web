import {createSlice} from '@reduxjs/toolkit'
import { Contract, ethers} from 'ethers'
import rpc from '../Assets/networks/rpc_config.json'
import Market from '../Contracts/Marketplace.json'

const readProvider = new ethers.providers.JsonRpcProvider(rpc.url);
const readMarket = new Contract(rpc.market_contract, Market.abi, readProvider);

const marketSlice = createSlice({
    name : 'market',
    initialState : {
        loadingPage : false,
        totalListed : 0,
        listings : []
    },
    reducers : {
        loadingMarket(state){
            state.loadingPage = true;
            state.listings = []
        },
        onNewPage(state, action){
            state.loadingPage = false;
            state.listings.push(...action.payload.newPage);
        },
        onTotalListed(state, action){
            state.totalListed = action.payload;
        }
    }
})

const {
    loadingMarket,
    onNewPage,
    onTotalListed
} = marketSlice.actions;

export const market = marketSlice.reducer;

export const loadMarket = () => async(dispatch) => {
    console.log('load market');
    dispatch(loadingMarket());
    const totalActive = await readMarket.totalActive();
    dispatch(onTotalListed(totalActive))
    if(totalActive > 0){
        const listings = await readMarket.openListings(1,totalActive)
        console.log(listings);
        dispatch(onNewPage({
            'newPage' : listings
        }));
    } else{
        dispatch(onNewPage({
            'newPage' : []
        }));
    }
}

