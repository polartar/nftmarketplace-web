import {createSlice} from '@reduxjs/toolkit'
import { Contract, ethers} from 'ethers'
import rpc from '../Assets/networks/rpc_config.json'
import Membership from '../Contracts/EbisusBayMembership.json'

const readProvider = new ethers.providers.JsonRpcProvider(rpc.read_url);
const readMemberships = new Contract(rpc.membership_contract, Membership.abi, readProvider);

const memberSlice = createSlice({
    name: 'memberships',
    initialState: {
        founders : {
            id : 1,
            price : "",
            discount : "",
            count : 'Fetching...',
            max : 10000,
            maxMint : 10,
            fetching : true
        },
        vips : {
            id : 2,
            price : "",
            discount : "",
            count : 'Fetching...',
            max : 1000,
            maxMint : 10
        }
    },
    reducers: {
        foundersReceived(state, action) {
            state.founders = action.payload;
        },
        vipsReceived(state, action){
            state.vips = action.payload;
        }
    }
})

const { foundersReceived , vipsReceived} = memberSlice.actions;
export const memberships = memberSlice.reducer;

export const fetchMemberInfo = () => async(dispatch) => {
    const nc = await readMemberships.founderCount();
    const p = await readMemberships.founderPrice();
    const d = await readMemberships.founderReferralDiscount();

    dispatch(
        foundersReceived({
            id : 1,
            price : ethers.utils.formatEther(p),
            discount : ethers.utils.formatEther(d),
            count : nc.toNumber(),
            max : 10000,
            maxMint : 10,
            fetching: false
        })
    )
};

export const fetchVipInfo = () => async(dispatch) => {
    const nc = await readMemberships.vipCount();
    const p = await readMemberships.vipPrice();
    const d = await readMemberships.vipReferralDiscount();
    dispatch(
        vipsReceived({
            id : 2,
            price : ethers.utils.formatEther(p),
            discount : ethers.utils.formatEther(d),
            count : nc.toNumber(),
            max : 1000,
            maxMint : 10
        })
    )
};