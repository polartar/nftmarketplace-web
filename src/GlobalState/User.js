import {createSlice} from '@reduxjs/toolkit'
import { Contract, ethers, BigNumber} from 'ethers'
import rpc from '../Assets/networks/rpc_config.json'
import Membership from '../Contracts/EbisusBayMembership.json'
import Cronies from '../Contracts/CronosToken.json'
import Market from '../Contracts/Marketplace.json'
import { ERC721, ERC1155 } from '../Contracts/Abis'
import WalletConnectProvider from "@walletconnect/web3-provider";

import detectEthereumProvider from '@metamask/detect-provider'
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/browser';


const readProvider = new ethers.providers.JsonRpcProvider("https://rpc.nebkas.ro/");
const gatewayTools = new IPFSGatewayTools();
const gateway = "https://mygateway.mypinata.cloud";


const userSlice = createSlice({
    name : 'user',
    initialState : {
        provider: null,
        address : null,
        connectingWallet: false,
        balance : "0",
        code : "",
        rewards: "Loading...",
        marketBalance : "Loading...",
        isMember : false,
        fetchingNfts: false,
        cronies : [],
        founderCount : 0,
        vipCount : 0,
        needsOnboard: false,
        membershipContract: null,
        croniesContract: null,
        marketContract: null,
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
            state.rewards = action.payload.rewards;
            state.isMember = action.payload.isMember;
            state.marketContract = action.payload.marketContract;
            state.marketBalance = action.payload.marketBalance;
        },

        onProvider(state, action){
            state.provider = action.payload.provider;
            state.needsOnboard = action.payload.needsOnboard;
            state.membershipContract = action.payload.membershipContract;
            state.correctChain = action.payload.correctChain;
        },

        fetchingNfts(state, action){
            state.fetchingNfts = action.payload;
            if(action.payload){
                state.nfts = []
            }
        },

        onNfts(state, action){
            state.nfts.push(...action.payload.nfts);
            state.fetchingNfts = false;
        },
        listingUpdate(state, action){
            console.log('id: ' + action.payload.id +   '   contract: ' + action.payload.contract);
            const index = state.nfts.findIndex(e => (e.contract.address.toLowerCase() === action.payload.contract.toLowerCase() && e.id === action.payload.id));
            console.log('found index: ' + index);
            if(index > 0) {
                try{
                    state.nfts[index].listed = action.payload.listed;
                }catch(error){
                    console.log(error);
                }
                
            }
        },
        connectingWallet(state, action) {
            state.connectingWallet = action.payload.connecting;
        },
        registeredCode(state, action){
            state.code = action.payload;
        },
        withdrewRewards(state){
            state.rewards = '0.0';
        },
        withdrewPayments(state){
            state.marketBalance = '0.0'
        },
        transferedNFT(state, action){
            //todo
        },
        setIsMember(state, action){
            state.isMember = action.payload;
        }

    }
});

export const {
    accountChanged, 
    onProvider, 
    fetchingNfts,
    onNfts, 
    connectingWallet, 
    registeredCode,
    withdrewRewards,
    withdrewPayments,
    listingUpdate,
    transferedNFT,
    setIsMember} = userSlice.actions;
export const user = userSlice.reducer;

export const updateListed = (contract, id, listed) => async(dispatch) => {
    dispatch(listingUpdate({
        'contract' : contract,
        'id' : id,
        'listed' : listed
    }))
}

export const connectAccount = () => async(dispatch) => {

    var accounts, provider, signer, cid, web3Provider, correctChain, signer, address;

    //TODO: CHOOSE OPTION
    if (true) {
        web3Provider = new WalletConnectProvider({
            rpc: {
              25: "https://evm-cronos.crypto.org"
            },
            chainId: 25,
          });

        try {
            accounts = await web3Provider.enable();
        } catch (error) {
            console.log(error);
            return;
        }
        address = accounts[0];

        provider = new ethers.providers.Web3Provider(web3Provider);
        signer = provider.getSigner();

        cid = await web3Provider.request({
            method: "net_version",
        });

        correctChain = cid === rpc.chain_id

        web3Provider.on('disconnect', (id) => {
            dispatch(accountChanged({
                address: "",
                provider: null,
            }))
        });

    } else {
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
    }

        let mc;
        let cc;
        let code;
        let balance;
        let rewards;
        let ownedFounder = 0;
        let ownedVip = 0;
        let market;
        let sales;

        if(signer && correctChain){
            mc = new Contract(rpc.membership_contract, Membership.abi, signer);
            mc.connect(signer);
            cc = new Contract(rpc.cronie_contract, Cronies.abi, signer);
            cc.connect(signer);
            const rawCode = await mc.codes(address);
            code = ethers.utils.parseBytes32String(rawCode);
            rewards = ethers.utils.formatEther(await mc.payments(address));
            ownedFounder = await mc.balanceOf(address, 1);
            ownedVip = await mc.balanceOf(address, 2);
            market = new Contract(rpc.market_contract, Market.abi, signer);
            sales = ethers.utils.formatEther(await market.payments(address));
        }

        await dispatch(accountChanged({
            address: address,
            provider: provider,
            needsOnboard: false,
            membershipContract: mc,
            croniesContract: cc,
            correctChain:correctChain,
            code: code,
            balance: balance,
            rewards: rewards,
            isMember : ownedVip > 0 || ownedFounder > 0,
            marketContract: market,
            marketBalance :sales
        }))
        dispatch(connectingWallet({'connecting' : false}));
}

const knownContracts = [
    {
        'name': 'vips',
        'onChain' : false,
        'address': '0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5',
        'multiToken' : true,
        'id' : 2,
        'listable' : true
    },
    {
        'name': 'founders',
        'onChain' : false,
        'address': '0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5',
        'multiToken' : true,
        'id' : 1,
        'listable' : false
    },
    {
        'name': 'cronies',
        'multiToken': false,
        'address' : '0xD961956B319A10CBdF89409C0aE7059788A4DaBb',
        'onChain' : true,
        'listable' : true
    },
    {
        'name' : 'CronosChimp',
        'multiToken': false,
        'address' : '0x562f021423d75a1636db5be1c4d99bc005ccebfe',
        'onChain' : false,
        'listable' : false
    },
    {
        'name' : 'cro punks',
        'multiToken': false,
        'address' : '0xaec3adc72e453ecb6009aa48e0ac967941b30c4e',
        'onChain' : false,
        'listable' : true
    },
    {
        'name' : 'crocrows',
        'multiToken': false,
        'address' : '0xe4ab77ed89528d90e6bcf0e1ac99c58da24e79d5',
        'onChain' : false,
        'listable' : true
    },
    {
        'name' : 'cronos punks',
        'multiToken': false,
        'address' : '0x16134B610f15338B96D8DF52EE63553dD2B013A2',
        'onChain' : false,
        'listable' : true
    },
    {
        'name' : 'crocodiles',
        'multiToken': false,
        'address' : '0x18b73D1f9e2d97057deC3f8D6ea9e30FCADB54D7',
        'onChain' : false,
        'listable' : true
    },
    {
        'name' : 'planets',
        'multiToken': false,
        'address' : '0xEdb2Eb556765F258a827f75Ad5a4d9AEe9eA7118',
        'onChain' : false,
        'listable' : true
    },
    {
        'name' : 'drakes',
        'multiToken': false,
        'address' : '0xbed280E63B3292a5faFEC896F9a0256d12552170',
        'onChain' : false,
        'listable' : true
    },
    {
        'name' : 'SupBirds',
        'multiToken': false,
        'address' : '0x48879b93AbCE2B69F9792584f8891BCe30C1BF28',
        'onChain' : false,
        'listable' : true
    },
    {
        'name' : 'Crownos',
        'multiToken': false,
        'address' : '0x704f0990CE1997ED5110e7415cc7aBE090006C1e',
        'onChain' : false,
        'listable' : true
    },{
        'name' : 'Crypto Collage Collection',
        'multiToken' :  false,
        'address' : '0x64274Fce5bd057E6416f57A5EdC8a3195E153022',
        'onChain' : false,
        'listable' : true
    },{
        'name' : 'ppgm',
         'multiToken' : false,
         'address' : '0xCaa648e8f8fE3D4705BC3D9B0d4d1068509f1014',
         'onChain' : false,
         'listable' : true
    }, {
        'name' : 'day1',
        'multiToken' : false,
        'address' : '0xf711e40d09BF4709c32eb967243872700fe80CC7',
        'onChain' : false,
        'listable' : true
    }
]


export const fetchNfts = (user) => async(dispatch) =>{

    if(user.address && user.provider){

        dispatch(fetchingNfts(true));
        const signer = user.provider.getSigner();
        const market = new Contract(rpc.market_contract, Market.abi, readProvider);
        market.connect(signer);
        let activeListings = await market.totalActive();// market.totalActiveListingsUser(user.address);
        activeListings = activeListings.toNumber();

        let listings = [];
        if(activeListings > 0){
            // listings = await market.openForUser(user.address, 1, activeListings);
            listings = await market.openListings(1, activeListings);
            listings = listings.filter(e => e['seller'].toLowerCase() === user.address.toLowerCase());
            console.log(listings);
        }
        await Promise.all(
            knownContracts.map(async (c, i) => {
                try{
                    if(c.multiToken){
                        const contract = new Contract(c.address, ERC1155, signer);
                        contract.connect(signer);
                        let count = await contract.balanceOf(user.address, c.id);
                        count = count.toNumber();
                        if(c.address === rpc.membership_contract && count > 0) {
                            dispatch(setIsMember(true));
                        }
                        if(count !== 0){
                            let uri = await contract.uri(c.id);
                            const listing = listings.find(e => e['nftId'].eq(c.id) && e['nft'].toLowerCase() === c.address.toLowerCase());
                            if(gatewayTools.containsCID(uri)){
                                try{
                                    uri = gatewayTools.convertToDesiredGateway(uri, gateway);
                                }catch(error){
                                    //console.log(error);
                                }
                            } 
                            const json = await (await fetch(uri)).json();
                            // const a = Array.from({length : count}, (_, i) => {
                            //     const name = json.name;
                            //     const image = gatewayTools.containsCID(json.image) ? gatewayTools.convertToDesiredGateway(json.image, gateway) : json.image;
                            //     const description = json.description;
                            //     const properties = json.properties; 
                            //     return {
                            //         'name': name,
                            //         'id' : c.id,
                            //         'image' : image,
                            //         'description' : description,
                            //         'properties' : properties,
                            //         'contract' : contract,
                            //         'address' : c.address,
                            //         'multiToken' : true,
                            //         'listable' : c.listable,
                            //         'listed' : false
                            //     }
                            // })
                            const name = json.name;
                            const image = gatewayTools.containsCID(json.image) ? gatewayTools.convertToDesiredGateway(json.image, gateway) : json.image;
                            const description = json.description;
                            const properties = json.properties; 
                            const nft = {
                                'name': name,
                                'id' : c.id,
                                'image' : image,
                                'count' : count,
                                'description' : description,
                                'properties' : properties,
                                'contract' : contract,
                                'address' : c.address,
                                'multiToken' : true,
                                'listable' : c.listable,
                                'listed' : listing != null,
                                'listingId' : (listing) ? listing['listingId'] : null
                            }
    
                            dispatch(onNfts({
                                'nfts' : [nft]
                            }))
                        }
              
                    } else {
                        var nfts = [];
                        const contract = new Contract(c.address, ERC721, signer);
                        const readContract = new Contract(c.address, ERC721, readProvider);
                        contract.connect(signer);
                        const count = await contract.balanceOf(user.address);
                        for(let i = 0; i < count; i++){
                            const id = await readContract.tokenOfOwnerByIndex(user.address, i);                            
                            const listing = listings.find(e => e['nftId'].eq(id) && e['nft'].toLowerCase() === c.address.toLowerCase());
                            let uri = await readContract.tokenURI(id);
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
                                    'address' : c.address,
                                    'multiToken' : false,
                                    'listable' : c.listable,
                                    'listed' : listing != null,
                                    'listingId' : (listing) ? listing['listingId'] : null
                                }
                                nfts.push(nft);
                            } else {
                                if(gatewayTools.containsCID(uri)){
                                    try{
                                        uri = gatewayTools.convertToDesiredGateway(uri, gateway);                                        
                                    }catch(error){
                                       // console.log(error);
                                    }
                                }
                                let json
                                if(uri.includes('unrevealed')){
                                    json = {
                                        'id' : id,
                                         'name' : c.name + ' ' + id,
                                         'description' : 'Unrevealed!',
                                         'image' : "",
                                         'contract' : contract,
                                         'address' : c.address,
                                         'multiToken' : false,
                                         'properties' : [],
                                         'listable' : c.listable,
                                         'listed' : listing != null,
                                         'listingId' : (listing) ? listing['listingId'] : null
                                    }
                                } else{
                                    json = await (await fetch(uri)).json();
                                }
                                let image
                                if(gatewayTools.containsCID(json.image)){
                                    try {
                                        image = gatewayTools.convertToDesiredGateway(json.image, gateway);
                                        
                                    }catch(error){
                                        image = json.image;
                                    }
                                } else {
                                    image = json.image;
                                }

                                const nft = {
                                    'id' : id,
                                    'name' : json.name,
                                    'image' : image,
                                    'description' : json.description,
                                    'properties' : (json.properties) ? json.properties : json.attributes,
                                    'contract' : contract,
                                    'address' : c.address,
                                    'multiToken' : false,
                                    'listable' : c.listable,
                                    'listed' : listing != null,
                                    'listingId' : (listing) ? listing['listingId'] : null
                                }
                                nfts.push(nft);
                            }
                        }
                        dispatch(onNfts({
                            'nfts' : nfts
                        }))
                    }
                }catch(error){
                    console.log('error fetching ' + knownContracts[i].name);
                    console.log(error);
                }
    
            })
        )

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

    const web3Provider = new WalletConnectProvider({
        rpc: {
          25: "https://evm-cronos.crypto.org"
        },
        chainId: 25,
      });

    var provider, signer, cid, outerProvider;

    if(ethereum == null || ethereum !== window.ethereum){
        if (web3Provider != null) {
            provider = new ethers.providers.Web3Provider(web3Provider);
            outerProvider = web3Provider;
        } 
    } else {
        provider = new ethers.providers.Web3Provider(ethereum);
        outerProvider = ethereum;
    }

    signer = provider.getSigner();

    cid = await outerProvider.request({
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


    outerProvider.on('accountsChanged', (accounts) => {

        dispatch(accountChanged({
            address: accounts[0]
        }))
        });

    outerProvider.on('chainChanged', (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.

        window.location.reload();
    });

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
    } else {
        console.log("ChainConnect");
        let cid = 25;
        const web3Provider = new WalletConnectProvider({
            rpc: {
              25: "https://evm-cronos.crypto.org"
            },
            chainId: 25,
          });
        await web3Provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: cid}]
        });
    }
}