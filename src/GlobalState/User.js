import {createSlice} from '@reduxjs/toolkit'
import { Contract, ethers, BigNumber} from 'ethers'
import config from '../Assets/networks/rpc_config.json'
import Membership from '../Contracts/EbisusBayMembership.json'
import Cronies from '../Contracts/CronosToken.json'
import Market from '../Contracts/Marketplace.json'
import { ERC721, ERC1155 , Elon} from '../Contracts/Abis'
import Web3Modal from "web3modal";

import detectEthereumProvider from '@metamask/detect-provider'
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/browser';
import { knownContracts } from './Market'
import { DeFiWeb3Connector } from 'deficonnect'
import  WalletConnectProvider from '@deficonnect/web3-provider'
import cdcLogo from '../Assets/cdc_logo.svg'


const readProvider = new ethers.providers.JsonRpcProvider(config.read_rpc);
const gatewayTools = new IPFSGatewayTools();
const gateway = "https://mygateway.mypinata.cloud";
const listingsUri = `${config.api_base}listings?`;



const userSlice = createSlice({
    name : 'user',
    initialState : {
        provider: null,
        address : null,
        web3modal: null,
        connectingWallet: false,
        gettingContractData: true,
        balance : "Loading...",
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
        ebisuContract : null,
        correctChain : false,
        nfts: [],
        currentNft : null
    },
    reducers: {

        accountChanged(state, action){
            state.membershipContract = action.payload.membershipContract;
            state.croniesContract = action.payload.croniesContract;

            state.balance = action.payload.balance;
            state.code = action.payload.code;
            state.rewards = action.payload.rewards;
            state.isMember = action.payload.isMember;
            state.marketContract = action.payload.marketContract;
            state.marketBalance = action.payload.marketBalance;
            state.ebisuContract = action.payload.ebisuContract;
            state.gettingContractData = false;
        },

        onCorrectChain(state, action) {
            state.correctChain = action.payload.correctChain;
        },

        onProvider(state, action){
            state.provider = action.payload.provider;
            state.needsOnboard = action.payload.needsOnboard;
            state.membershipContract = action.payload.membershipContract;
            state.correctChain = action.payload.correctChain;
        },

        onBasicAccountData(state, action) {
            state.address = action.payload.address;
            state.provider = action.payload.provider;
            state.web3modal = action.payload.web3modal;
            state.correctChain = action.payload.correctChain;
            state.needsOnboard = action.payload.needsOnboard;
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
        onNftLoading(state, action){
            state.currentNft = null;
        },
        onNftLoaded(state, action){
            state.currentNft = action.payload.nft;
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
        },
        onLogout(state) {
            state.connectingWallet = false;
            const web3Modal = new Web3Modal({
                cacheProvider: false, // optional
                providerOptions: [] // required
            });
            web3Modal.clearCachedProvider();
            if (state.web3modal != null) {
                state.web3modal.clearCachedProvider();
            }
            state.web3modal = null;
            state.provider = null;
            localStorage.clear();
            state.address = "";
            state.balance = "Loading...";
            state.rewards = "Loading...";
            state.marketBalance = "Loading...";
            state.isMember = false;
        }

    }
});

export const {
    accountChanged,
    onProvider,
    fetchingNfts,
    onNfts,
    onNftLoading,
    onNftLoaded,
    connectingWallet,
    onCorrectChain,
    registeredCode,
    withdrewRewards,
    withdrewPayments,
    listingUpdate,
    transferedNFT,
    setIsMember,
    onBasicAccountData,
    onLogout,
    elonContract
} = userSlice.actions;
export const user = userSlice.reducer;

export const updateListed = (contract, id, listed) => async(dispatch) => {
    dispatch(listingUpdate({
        'contract' : contract,
        'id' : id,
        'listed' : listed
    }))
}


export const connectAccount = (firstRun=false) => async(dispatch) => {

    const providerOptions = {
        /*
        walletconnect: {
            package: WalletConnectProvider, // required
            options: {
                chainId: 25,
                rpc: {
                    25: "https://evm-cronos.crypto.org",
                },
                network: 'cronos',
                metadata: {
                    icons: ["https://ebisusbay.com/vector%20-%20face.svg"],
                    description: "Cronos NFT Marketplace"
                    }
                }
        },*/
        injected: {
            display: {
                logo: "https://github.com/MetaMask/brand-resources/raw/master/SVG/metamask-fox.svg",
                name: "MetaMask",
                description: "Connect with MetaMask in your browser"
            },
            package: null
            },
        "custom-defiwallet": {
            display: {
                logo: cdcLogo,
                name: "Crypto.com DeFi Wallet",
                description: "Connect with the CDC DeFi Wallet"
            },
            options: {},
            package: WalletConnectProvider,
            connector: async (ProviderPackage, options) =>  {
                const connector = new DeFiWeb3Connector({
                    supportedChainIds: [25],
                    rpc: {25: 'https://evm-cronos.crypto.org'},
                    pollingInterval: 15000,
                    metadata: {
                        icons: ['https://ebisusbay.com/vector%20-%20face.svg'],
                        description: "Cronos NFT Marketplace"
                    }
                });

                await connector.activate();
                let provider = await connector.getProvider();
                return provider;
            }
        }
    }

    if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER") == "\"custom-defiwallet\"") {
        localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
    }

    const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions // required
    });

    console.log(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER"));
    if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER") == null && firstRun) {
        return;
    }


    console.log("Opening a dialog", web3Modal);
    var web3provider;
    try {
        web3provider = await web3Modal.connect();
    } catch(e) {
        console.log("Could not get a wallet connection", e);
        return;
    }

    //dispatch(connectingWallet({'connecting' : true}));
    console.log(web3provider);
    try {
        var provider = new ethers.providers.Web3Provider(web3provider);

        let accounts = await web3provider.request({
            method: 'eth_accounts',
            params: [{chainId: cid}]
        });



        var address = accounts[0];
        var signer = provider.getSigner();
        var cid = await web3provider.request({
            method: "net_version",
        });


        //console.log(cid, rpc.chain_id);
        var correctChain = cid === Number(config.chain_id)
        if (!correctChain) {
            correctChain = cid === config.chain_id
        }
        //console.log(correctChain);
        await dispatch(onBasicAccountData({
            address: address,
            provider: provider,
            web3modal: web3Modal,
            needsOnboard: false,
            correctChain: correctChain
        }));


        web3provider.on('DeFiConnectorDeactivate', (error) => {
            console.log("HERE");
            dispatch(onLogout());
        });

        web3provider.on('disconnect', (error) => {
            dispatch(onLogout());
        });

        web3provider.on('accountsChanged', (accounts) => {
            dispatch(connectAccount());
        });

        web3provider.on('DeFiConnectorUpdate', (accounts) => {
            window.location.reload();
        });

        web3provider.on('chainChanged', (chainId) => {
            // Handle the new chain.
            // Correctly handling chain changes can be complicated.
            // We recommend reloading the page unless you have good reason not to.

            window.location.reload();
        });

        let mc;
        let cc;
        let code;
        let balance;
        let rewards;
        let ownedFounder = 0;
        let ownedVip = 0;
        let market;
        let sales;
        let ebisu;

        if(signer && correctChain){
            ebisu = new Contract(config.ebisu_contract, Elon, signer);
            mc = new Contract(config.membership_contract, Membership.abi, signer);
            mc.connect(signer);
            cc = new Contract(config.cronie_contract, Cronies.abi, signer);
            cc.connect(signer);
            const rawCode = await mc.codes(address);
            code = ethers.utils.parseBytes32String(rawCode);
            rewards = ethers.utils.formatEther(await mc.payments(address));
            ownedFounder = await mc.balanceOf(address, 1);
            ownedVip = await mc.balanceOf(address, 2);
            market = new Contract(config.market_contract, Market.abi, signer);
            sales = ethers.utils.formatEther(await market.payments(address));
            
        }


        await dispatch(accountChanged({
            address: address,
            provider: provider,
            web3modal: web3Modal,
            needsOnboard: false,
            correctChain: correctChain,
            membershipContract: mc,
            croniesContract: cc,
            code: code,
            balance: balance,
            rewards: rewards,
            isMember : ownedVip > 0 || ownedFounder > 0,
            marketContract: market,
            marketBalance :sales,
            ebisuContract : ebisu
        }))
    } catch (error) {
        console.log(error)
        console.log("Error connecting wallet!");
        await web3Modal.clearCachedProvider();
        dispatch(onLogout());
    }
    dispatch(connectingWallet({'connecting' : false}));

}

export const fetchNfts = (user) => async(dispatch) =>{

    if(user.address && user.provider){

        dispatch(fetchingNfts(true));
        const signer = user.provider.getSigner();
        const listingsReponse = await (await fetch(`${listingsUri}seller=${user.address}&state=0`)).json()
        const listings = listingsReponse.listings;

        await Promise.all(
            knownContracts.map(async (c, i) => {
                try{
                    if(c.multiToken){
                        const contract = new Contract(c.address, ERC1155, signer);
                        contract.connect(signer);
                        let count = await contract.balanceOf(user.address, c.id);
                        count = count.toNumber();
                        if(c.address === config.membership_contract && count > 0) {
                            dispatch(setIsMember(true));
                        }
                        if(count !== 0){
                            let uri = await contract.uri(c.id);
                            const listing = listings.find(e => ethers.BigNumber.from(e['nftId']).eq(c.id) && e['nftAddress'].toLowerCase() === c.address.toLowerCase());
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
                            const listing = listings.find(e => ethers.BigNumber.from(e['nftId']).eq(id) && e['nftAddress'].toLowerCase() === c.address.toLowerCase());
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
                                if(gatewayTools.containsCID(uri) && !uri.startsWith('ar')){
                                    try{
                                        uri = gatewayTools.convertToDesiredGateway(uri, gateway);
                                    }catch(error){
                                       // console.log(error);
                                    }
                                } else if(uri.startsWith('ar')){
                                    uri = `https://arweave.net/${uri.substring(5)}`;
                                } else {
                                    console.log(uri);
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
                                if(json.image.startsWith('ipfs')){
                                    image = `${gateway}/ipfs/${json.image.substring(7)}`;
                                } else if(gatewayTools.containsCID(json.image) && !json.image.startsWith('ar')){
                                    try {
                                        image = gatewayTools.convertToDesiredGateway(json.image, gateway);

                                    }catch(error){
                                        image = json.image;
                                    }
                                } else if(json.image.startsWith('ar')){
                                    if(typeof json.tooltip !== 'undefined'){
                                        image = `https://arweave.net/${json.tooltip.substring(5)}`;
                                    } else {
                                        image = `https://arweave.net/${json.image.substring(5)}`;
                                    }

                                }else {
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

export const getNftDetails = (state, collectionId, nftId) => async(dispatch) => {
    try {

        // const index = state.user.nfts.findIndex(e => (parseInt(e.id) === parseInt(nftId) && e.address === collectionId));
        // if (index > -1) {
        //     console.log('loading from user cache!');
        //     console.log(state.user.nfts[index]);
        //     dispatch(onNftLoaded({
        //         'nft' : state.user.nfts[index]
        //     }));
        //     return;
        // }

        let nft;
        try{
            const internalUri = `https://app.ebisusbay.com/files/${collectionId.toLowerCase()}/metadata/${nftId}.json`;
            const json = await (await fetch(internalUri)).json();
            dispatch(onNftLoaded({
                'nft' : {
                    ...json,
                    'properties' : (json.attributes) ? json.attributes : []
                }
            }));
            return;
        }catch(error){
            console.log(error);
        }

        if (collectionId === config.cronie_contract) {
            const contract = new Contract(collectionId, ERC721, readProvider);
            let uri = await contract.tokenURI(nftId);

            const json = Buffer.from(uri.split(',')[1], 'base64');
            const parsed = JSON.parse(json);
            const name = parsed.name;
            const image = dataURItoBlob(parsed.image, 'image/svg+xml');
            const desc = parsed.description;
            const properties = [];//(parsed.properties) ? parsed.properties : parsed.attributes;
            nft = {
                'name': name,
                'image': URL.createObjectURL(image),
                'description': desc,
                'properties': properties,
            }
        } else {
            const isMultiToken = knownContracts.findIndex(x => x.address === collectionId && x.multiToken) > -1;

            let uri;
            if (isMultiToken) {
                const contract = new Contract(collectionId, ERC1155, readProvider);
                uri = await contract.uri(nftId);
            } else {
                const contract = new Contract(collectionId, ERC721, readProvider);
                uri = await contract.tokenURI(nftId);
            }

            if(gatewayTools.containsCID(uri)){
                try{
                    uri = gatewayTools.convertToDesiredGateway(uri, gateway);
                }catch(error){
                    // console.log(error);
                }
            }
            let json

            if(uri.includes('unrevealed')){
                return null;
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
            const properties = (json.properties) ? json.properties : json.attributes;
            nft = {
                'name' : json.name,
                'image' : image,
                'description' : json.description,
                'properties' : properties ? properties : [],
            }
        }

        dispatch(onNftLoaded({
            'nft' : nft
        }))
    } catch (error) {
        console.log(error);
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
    } else {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer =  provider.getSigner();
        const cid =  await ethereum.request({
            method: "net_version",
        });

        const correctChain = cid === config.chain_id

        let mc;
        if(signer && correctChain){
            mc = new Contract(config.membership_contract, Membership.abi, signer);
        }
        const obj = {
            provider: provider,
            needsOnboard: false,
            membershipContract: mc,
            correctChain:correctChain
        };

        //dispatch(onProvider(obj))


        provider.on('accountsChanged', (accounts) => {

            dispatch(accountChanged({
                address: accounts[0]
            }))
            });

        provider.on('chainChanged', (chainId) => {
            // Handle the new chain.
            // Correctly handling chain changes can be complicated.
            // We recommend reloading the page unless you have good reason not to.

            window.location.reload();
        });

    }
}

export const chainConnect = (type) => async(dispatch) => {
    console.log(window.ethereum);
    if (window.ethereum) {
        const cid = ethers.utils.hexValue(BigNumber.from(config.chain_id));
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
                            chainName: config.name,
                            chainId: cid,
                            rpcUrls: [config.write_rpc],
                            blockExplorerUrls: null,
                            nativeCurrency: {
                                name: config.symbol,
                                symbol: config.symbol,
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
        const web3Provider = new WalletConnectProvider({
            rpc: {
              25: "https://evm-cronos.crypto.org"
            },
            chainId: 25,
          });
    }
}