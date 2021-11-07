import {createSlice} from '@reduxjs/toolkit'
import { Contract, ethers, BigNumber} from 'ethers'
import rpc from '../Assets/contracts/rpc_config.json'
import Membership from '../Assets/contracts/EbisusBayMembership.json'
import detectEthereumProvider from '@metamask/detect-provider'

const userSlice = createSlice({
    name : 'user',
    initialState : {
        provider: null,
        address : null,
        balance : "",
        code : "",
        rewards: "",
        cronies : [],
        founderCount : 0,
        vipCount : 0,
        needsOnboard: false,
        membershipContract: null,
        correctChain : false
    }, 
    reducers: {

        accountChanged(state, action){
            state.address = action.payload.address;
        },

        onProvider(state, action){
            state.provider = action.payload.provider;
            state.needsOnboard = action.payload.needsOnboard;
            state.membershipContract = action.payload.membershipContract;
            state.correctChain = action.payload.correctChain;
        },

    }
});

const {accountChanged, onProvider} = userSlice.actions;
export const user = userSlice.reducer;

export const fetchUserInfo = () => async(dispatch) => {

}

export const connectAccount = () => async(dispatch) => {
    if(window.ethereum){
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        console.log("got accounts " + accounts);
        dispatch(accountChanged({
            address: accounts[0]
        }))
    }
}

export const initProvider = () => async(dispatch) =>  {
    const ethereum = await detectEthereumProvider();
    console.log(ethereum);
    if(ethereum == null || ethereum !== window.ethereum){
        console.log('not metamask detected');
        dispatch(onProvider({
            provider: ethereum,
            needsOnboard: true
        }))
    } else{
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer =  provider.getSigner();
        const cid =  await ethereum.request({
            method: "net_version",
        });
        console.log("cid: " + cid);
        const correctChain = cid === rpc.chain_id
        console.log("signer: " + signer);
        let mc;
        if(signer && correctChain){
            mc = new Contract(rpc.membership_contract, Membership.abi, signer);
        }
        const obj = {
            provider: provider,
            needsOnboard: false,
            membershipContract: mc,
            correctChain:correctChain
        };

        dispatch(onProvider(obj))


        ethereum.on('accountsChanged', (accounts) => {
            console.log("onAccountsChanged " + accounts);
            dispatch(accountChanged({
                address: accounts[0]
            }))
          });

        ethereum.on('chainChanged', (chainId) => {
            // Handle the new chain.
            // Correctly handling chain changes can be complicated.
            // We recommend reloading the page unless you have good reason not to.
            console.log(chainId);
            window.location.reload();
        });
    }

}

export const chainConnect = () => async(dispatch) => {
    if(window.ethereum) {
        const cid = ethers.utils.hexValue(BigNumber.from(rpc.chain_id));
        try{
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: cid}]
            })
        } catch(error){
            // This error code indicates that the chain has not been added to MetaMask
            // if it is not, then install it into the user MetaMask
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                        {
                            chainName: rpc.name,
                            chainId: cid,
                            rpcUrls: [rpc.url],
                            blockExplorerUrls: [rpc.explorer],
                            nativeCurrency: {
                                name: rpc.symbol,
                                symbol: rpc.symbol,
                                decimals: 18
                            }
                        },
                        ],
                    });
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{chainId: cid}]
                    })
                } catch (addError) {
                    console.error(addError);
                    window.location.reload();
                }
            }
            console.log(error);
        }
    }
}