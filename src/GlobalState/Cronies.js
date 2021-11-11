import {createSlice} from '@reduxjs/toolkit'
import { Contract, ethers} from 'ethers'
import rpc from '../Assets/networks/rpc_config.json'
import Cronies from '../Contracts/CronosToken.json'

const readProvider = new ethers.providers.JsonRpcProvider(rpc.url);
const readCronies = new Contract(rpc.cronie_contract, Cronies.abi, readProvider);

const cronieSlice = createSlice({
    name: 'cronies',
    initialState: {
        price : "100",
        maxMint : "5",
        discount: "0",
        count : 0,
        max : 'Open Edition'
    },
    reducers: {
        croniesReceived(state, action){
            state.count = action.payload.count;
        }
    }
})

const {croniesReceived} = cronieSlice.actions;
export const cronies = cronieSlice.reducer;

export const fetchCronieInfo = () => async(dispatch) => {
    const c = await readCronies.totalSupply()
    dispatch(croniesReceived({
            count: c.toNumber(),
    }))
}
