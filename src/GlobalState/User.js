import {createSlice} from '@reduxjs/toolkit'
import { Contract, ethers, BigNumber} from 'ethers'
import rpc from '../Assets/contracts/rpc_config.json'
import Membership from '../Assets/contracts/EbisusBayMembership.json'
import Cronies from '../Assets/contracts/CronosToken.json'
import detectEthereumProvider from '@metamask/detect-provider'

const userSlice = createSlice({
    name : 'user',
    initialState : {
        provider: null,
        address : null,
        balance : "",
        code : "",
        rewards: "",
        fetchingNfts: false,
        cronies : [],
        founderCount : 0,
        vipCount : 0,
        needsOnboard: false,
        membershipContract: null,
        croniesContract: null,
        correctChain : false
    }, 
    reducers: {

        accountChanged(state, action){
            state.address = action.payload.address;
            state.provider = action.payload.provider;
            state.needsOnboard = action.payload.needsOnboard;
            state.membershipContract = action.payload.membershipContract;
            state.croniesContract = action.payload.croniesContract;
            state.correctChain = action.payload.correctChain;
            state.balance = action.payload.balance;
            state.code = action.payload.code;
        },

        onProvider(state, action){
            state.provider = action.payload.provider;
            state.needsOnboard = action.payload.needsOnboard;
            state.membershipContract = action.payload.membershipContract;
            state.correctChain = action.payload.correctChain;
        },

        fetchingNfts(state, action){
            state.fetchingNfts = action.payload;
        },

        onCronies(state, action){
            state.cronies = action.payload.cronies;
            state.fetchingNfts = false;
        },

        onMemberships(state, action){
            state.founderCount = action.payload.founderCount;
            state.vipCount = action.payload.vipCount;
        }
    }
});

const {accountChanged, onProvider, fetchingNfts, onCronies, onMemberships} = userSlice.actions;
export const user = userSlice.reducer;

export const fetchUserInfo = () => async(dispatch) => {

}

export const connectAccount = () => async(dispatch) => {
    if(window.ethereum){
        const ethereum = await detectEthereumProvider();
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        })
        const address = accounts[0];

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const cid =  await ethereum.request({
            method: "net_version",
        });

        const correctChain = cid === rpc.chain_id

        let mc;
        let cc;
        let code;
        let balance;
        if(signer && correctChain){
            mc = new Contract(rpc.membership_contract, Membership.abi, signer);
            mc.connect(signer);
            cc = new Contract(rpc.cronie_contract, Cronies.abi, signer);
            cc.connect(signer);
            code = await mc.codes(address);
            balance = await signer.getBalance();
        }

        dispatch(accountChanged({
            address: address,
            provider: provider,
            needsOnboard: false,
            membershipContract: mc,
            croniesContract: cc,
            correctChain:correctChain,
            code: code,
            balance: balance
        }))

    }
}

export const fetchNfts = (user) => async(dispatch) =>{
    console.log('fetching nfts')
    if(user.membershipContract){
        try{
            const founderCount = await user.membershipContract.balanceOf(user.address, 1);
            const vipCount = await user.membershipContract.balanceOf(user.address, 2);
            dispatch(onMemberships({
                founderCount: founderCount,
                vipCount: vipCount
            }))
        }catch(error){
            console.log(error);
        }
    }
    if(user.croniesContract){
        try{
            dispatch(fetchingNfts(true));
            const cronieBalance = await user.croniesContract.balanceOf(user.address);
            var cronies = [];
            for(let i = 0; i < cronieBalance; i++){
                const id = await user.croniesContract.tokenOfOwnerByIndex(user.address, i);
                const dataUri = await user.croniesContract.tokenURI(id);
                const json = Buffer.from(dataUri.substring(29), 'base64');
                const parsed = JSON.parse(json);

                cronies.push({
                    id : id,
                    name: parsed.name,
                    image : dataURItoBlob(parsed.image, 'image/svg+xml')
                });
            }
            console.log('cronies: ' + cronies);
            dispatch(onCronies({
                cronies: cronies
            }));
        }catch(error){
            console.log(error);
        }
    }

}

function dataURItoBlob(dataURI, type) {
    console.log(dataURI);
    // convert base64 to raw binary data held in a string
    let byteString = atob(dataURI.split(',')[1]);
  
    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    // write the ArrayBuffer to a blob, and you're done
    let bb = new Blob([ab], { type: type });
    return bb;
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