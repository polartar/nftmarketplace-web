import {createSlice} from '@reduxjs/toolkit'
import { Contract, ethers, BigNumber} from 'ethers'
import rpc from '../Assets/networks/rpc_config.json'
import Membership from '../Contracts/EbisusBayMembership.json'
import Cronies from '../Contracts/CronosToken.json'
import { ERC721, ERC1155 } from '../Contracts/Abis'

import detectEthereumProvider from '@metamask/detect-provider'
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/browser';

const gatewayTools = new IPFSGatewayTools();
const gateway = "https://mygateway.mypinata.cloud";

const userSlice = createSlice({
    name : 'user',
    initialState : {
        provider: null,
        address : null,
        connectingWallet: false,
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
        correctChain : false,
        nfts: []
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

        onNfts(state, action){
            state.nfts = action.payload.nfts;
            state.fetchingNfts = false;
        },
        connectingWallet(state, action) {
            state.connectingWallet = action.connecting;
        }
    }
});

const {accountChanged, onProvider, fetchingNfts, onNfts, connectingWallet} = userSlice.actions;
export const user = userSlice.reducer;

export const connectAccount = () => async(dispatch) => {
    if(window.ethereum){
        dispatch(connectingWallet({'connecting' : true}));
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
        dispatch(connectingWallet({'connecting' : false}));
    }
}

const knownContracts = [
    {
        'name': 'vips',
        'onChain' : false,
        'address': '0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5',
        'multiToken' : true,
        'id' : 2
    },
    {
        'name': 'founders',
        'onChain' : false,
        'address': '0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5',
        'multiToken' : true,
        'id' : 1
    },
    {
        'name': 'cronies',
        'multiToken': false,
        'address' : '0xD961956B319A10CBdF89409C0aE7059788A4DaBb',
        'onChain' : true,
    }
]

export const fetchNfts = (user) => async(dispatch) =>{

    if(user.address && user.provider){
        var nfts = [];

        dispatch(fetchingNfts(true));
        await Promise.all(
            knownContracts.map(async (c, i) => {
                console.log('fetching ' + i);
                try{
                    const signer = user.provider.getSigner();
    
                    if(c.multiToken){
                        const contract = new Contract(c.address, ERC1155, signer);
                        contract.connect(signer);
                        const count = await contract.balanceOf(user.address, c.id);
                        const uri = await contract.uri(c.id);
                        const json = await (await fetch(gatewayTools.convertToDesiredGateway(uri, gateway))).json();
                        const a = Array.from({length : count}, (_, i) => {
                            const name = json.name;
                            const image = gatewayTools.convertToDesiredGateway(json.image, gateway);
                            const description = json.description;
                            const properties = json.properties; 
                            return {
                                'name': name,
                                'id' : c.id,
                                'image' : image,
                                'description' : description,
                                'properties' : properties,
                                'contract' : contract,
                                'address' : c.address,
                                'multiToken' : true
                            }
                        })
                        nfts.push(...a);
                    } else {
                        const contract = new Contract(c.address, ERC721, signer);
                        contract.connect(signer);
                        const count = await contract.balanceOf(user.address);
                        console.log('found ' + count);
                        for(let i = 0; i < count; i++){
                            const id = await contract.tokenOfOwnerByIndex(user.address, i);
                            const uri = await contract.tokenURI(id);
                            console.log(uri);
                            if(c.onChain){
                                const json = Buffer.from(uri.split(',')[1], 'base64');
                                const parsed = JSON.parse(json);
                                const name = parsed.name;
                                const image = dataURItoBlob(parsed.image, 'image/svg+xml');
                                const desc = parsed.description;
                                const properties = (parsed.properties) ? parsed.properties : parsed.attributes;
                                const nft = {
                                    'id' : id,
                                    'name' : name,
                                    'image' : URL.createObjectURL(image),
                                    'description' : desc,
                                    'properties' : properties,
                                    'contract' : contract,
                                    'address' : user.address,
                                    'multiToken' : false
                                }
                                console.log(nft);
                                nfts.push(nft);
                            } else {
                                //pull ipfs
                            }
                        }
                    }
                }catch(error){
                    console.log('error fetching ' + knownContracts[i].name);
                    console.log(error);
                }
    
            })
        )
        dispatch(onNfts({
            'nfts' : nfts
        }))
    }


}

function dataURItoBlob(dataURI, type) {

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

        const correctChain = cid === rpc.chain_id

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

            dispatch(accountChanged({
                address: accounts[0]
            }))
          });

        ethereum.on('chainChanged', (chainId) => {
            // Handle the new chain.
            // Correctly handling chain changes can be complicated.
            // We recommend reloading the page unless you have good reason not to.

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
                            blockExplorerUrls: null,
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