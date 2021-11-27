import {createSlice} from '@reduxjs/toolkit'
import { Contract, ethers} from 'ethers'
import rpc from '../Assets/networks/rpc_config.json'
import { ERC721, ERC1155 } from '../Contracts/Abis'
import Market from '../Contracts/Marketplace.json'
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/browser';


const gatewayTools = new IPFSGatewayTools();
const gateway = "https://mygateway.mypinata.cloud";
const pagesize = 8;
const listingsUri = "https://api.ebisusbay.com/activeListings";
const readProvider = new ethers.providers.JsonRpcProvider("https://rpc.nebkas.ro/");
const readMarket = new Contract(rpc.market_contract, Market.abi, readProvider);

export const SortOrders = ['Time', 'Price', 'Id']

const marketSlice = createSlice({
    name : 'market',
    initialState : {
        loadingPage : true,
        totalListed : 0,
        totalPages : 0,
        listings : [[]],
        type: 'all',
        sortOrder : SortOrders[0],
        curPage : 1,
        response: null,
        currentListing : null
    },
    reducers : {
        startLoading(state){
            state.loadingPage = true;
        },
        clearSet(state){
            state.listings = [[]];
            state.totalListed = 0;
            state.loadingPage = true;
        },
        onNewPage(state, action){
            state.loadingPage = false;
            state.curPage = action.payload.page;
            state.listings[action.payload.page] = action.payload.newPage;
        },
        onTotalListed(state, action){
            state.totalListed = action.payload.totalActive;
            state.listings = action.payload.listings;
            state.response = action.payload.response;
            state.totalPages = action.payload.totalPages;
            state.type = action.payload.type;
        },
        onListingLoaded(state, action) {
            state.currentListing = action.payload;
            state.loadingPage = false;
        },
        onSort(state, action){
            if(state.response !== null){
                state.listings = [[]]
                state.response = sortByType(state.response, action.payload.order);
                const index = (state.curPage - 1) * pagesize;
                state.listings[index] = [...state.response].splice(index, pagesize);
            }
            state.sortOrder = action.payload.order;
        },
        onPage(state, action){
            state.curPage = action.payload;
        }
    }
})

/*
    struct Listing {
        uint256 listingId;
        uint256 nftId;
        address seller;
        address nft;
        uint256 price;
        uint256 fee;
        State state;
        address purchaser;
        bool is1155;
    }
/*/

export const {
    startLoading,
    onNewPage,
    onTotalListed,
    clearSet,
    onListingLoaded,
    onSort,
    onPage
} = marketSlice.actions;

export const market = marketSlice.reducer;

export const init = (state, type, address) => async(dispatch) => {
    
        dispatch(clearSet());

        let listingsResponse = await (await (await (await fetch(listingsUri)).json()).map((e) => {
            const nft = {
                'name' : e.name,
                'image' : e.image,
                'description' : e.description,
                'properties' : (e.properties) ? e.properties : []
            }
            return {
                ...e,
                'listingId': ethers.BigNumber.from(e.listingId),
                'price' : ethers.utils.parseEther(String(e.price)),
                'nft' : nft
            }
        })).filter(e => typeof e.name !== 'undefined');

        if(type === 'collection'){
            listingsResponse = listingsResponse.filter((e) => e.nftAddress.toLowerCase() === address.toLowerCase());
        } else if(type === 'seller'){
            listingsResponse = listingsResponse.filter((e) => e.seller.toLowerCase() === address.toLowerCase());
        }
        const pages = Math.ceil(listingsResponse.length / pagesize);
        listingsResponse = sortByType(listingsResponse, state.market.sortOrder);
        
        
        dispatch(onTotalListed({
            'type' : type,
            'totalActive' : listingsResponse.length,
            'totalPages' : pages,
            'listings' : new Array(pages),
            'response' : listingsResponse
        }))

}

/**
 * 
                'name': name,
                'image' : image,
                'description' : description,
                'properties' : (properties) ? properties : [],
 */

export const loadPage = (state, page) => async(dispatch) => {
    dispatch(startLoading())

    const index = (page - 1) * pagesize;
    let listings = [...state.market.response].splice(index, pagesize);

    dispatch(onNewPage({
        'page' : page,
        'newPage' : listings
    }));
}

export const requestSort = (order, curPage) => async(dispatch) => {
    dispatch(onSort({
        'order' : order
    }))
}

export const getListing = (state, id) => async(dispatch) => {
    const curListing = state.market.currentListing;
    if(curListing !== null && curListing.nftId === id){
        return;
    }
    dispatch(startLoading());
    try{
        const rawListing = await readMarket.listings(id);
        const listing = {
            'listingId' : rawListing['listingId'],
            'nftId'     : rawListing['nftId'],
            'seller'    : rawListing['seller'],
            'nftAddress': rawListing['nft'],
            'price'     : rawListing['price'],
            'fee'       : rawListing['fee'],
            'is1155'    : rawListing['is1155'],
            'state'     : rawListing['state'],
            'purchaser' : rawListing['purchaser']
        }

        const nft = await getNft(listing);

        dispatch(onListingLoaded({
            ...listing,
            'nft' : nft
        }))
    }catch(error){
        console.log(error)
    }
}

const getNft = async (listing) => {
    try{
        if(listing.is1155){
            const contract = new Contract(listing.nftAddress, ERC1155, readProvider);
            let uri = await contract.uri(listing.nftId);
            if(gatewayTools.containsCID(uri)){
                try{
                    uri = gatewayTools.convertToDesiredGateway(uri, gateway);
                }catch(error){
                    //console.log(error);
                }
            } 
            const json = await (await fetch(uri)).json();
            const name = json.name;
            const image = gatewayTools.containsCID(json.image) ? gatewayTools.convertToDesiredGateway(json.image, gateway) : json.image;
            const description = json.description;
            let properties = json.properties; 
            if(properties === null || typeof properties === 'undefined'){
                properties = [];
            }
            const nft = {
                'name': name,
                'image' : image,
                'description' : description,
                'properties' : properties
            }
            return nft;
        } else {
            const contract = new Contract(listing.nftAddress, ERC721, readProvider);
            let uri = await contract.tokenURI(listing.nftId);
            if(listing.nftAddress === rpc.cronie_contract){
                const json = Buffer.from(uri.split(',')[1], 'base64');
                const parsed = JSON.parse(json);
                const name = parsed.name;
                const image = dataURItoBlob(parsed.image, 'image/svg+xml');
                const desc = parsed.description;
                const properties = [];//(parsed.properties) ? parsed.properties : parsed.attributes;
                const nft = {
                    'name' : name,
                    'image' : URL.createObjectURL(image),
                    'description' : desc,
                    'properties' : properties,
                }
                return nft;
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
                const nft = {
                    'name' : json.name,
                    'image' : image,
                    'description' : json.description,
                    'properties' : properties ? properties : [],
                }
                return nft;
            }
        }
    }catch(error){
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

function sortByType(listings, order){
    if(order === SortOrders[0]){
        return listings.sort((a,b) => b.listingId.sub(a.listingId));
    } else if(order === SortOrders[1]){
        return listings.sort((a,b) => a.price.sub(b.price));
    } else{   
        return listings.sort((a,b) => a.nftId - b.nftId);
    }
}

export const knownContracts = [
    {
        'name': 'EbisusBay VIP',
        'onChain' : false,
        'address': '0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5',
        'multiToken' : true,
        'id' : 2,
        'listable' : true
    },
    {
        'name': 'EbisusBay Founder',
        'onChain' : false,
        'address': '0x8d9232Ebc4f06B7b8005CCff0ca401675ceb25F5',
        'multiToken' : true,
        'id' : 1,
        'listable' : false
    },
    {
        'name': 'Cronies',
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
        'name' : 'CroPunks - Punks on Cronos',
        'multiToken': false,
        'address' : '0xaec3adc72e453ecb6009aa48e0ac967941b30c4e',
        'onChain' : false,
        'listable' : true
    },
    {
        'name' : 'CRO CROW',
        'multiToken': false,
        'address' : '0xe4ab77ed89528d90e6bcf0e1ac99c58da24e79d5',
        'onChain' : false,
        'listable' : true
    },
    {
        'name' : 'Cronos Punk',
        'multiToken': false,
        'address' : '0x16134B610f15338B96D8DF52EE63553dD2B013A2',
        'onChain' : false,
        'listable' : true
    },
    {
        'name' : 'CROCOSNFT',
        'multiToken': false,
        'address' : '0x18b73D1f9e2d97057deC3f8D6ea9e30FCADB54D7',
        'onChain' : false,
        'listable' : true
    },
    {
        'name' : 'PetitePlanetsNFT',
        'multiToken': false,
        'address' : '0xEdb2Eb556765F258a827f75Ad5a4d9AEe9eA7118',
        'onChain' : false,
        'listable' : true
    },
    {
        'name' : 'CRODrakes',
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
        'listable' : false
    },{
        'name' : 'Crypto Collage Collection',
        'multiToken' :  false,
        'address' : '0x64274Fce5bd057E6416f57A5EdC8a3195E153022',
        'onChain' : false,
        'listable' : true
    },{
        'name' : 'Petite Planets Gen 1 Governor Medals',
         'multiToken' : false,
         'address' : '0xCaa648e8f8fE3D4705BC3D9B0d4d1068509f1014',
         'onChain' : false,
         'listable' : true
    }, {
        'name' : 'Day One Supporter',
        'multiToken' : false,
        'address' : '0xf711e40d09BF4709c32eb967243872700fe80CC7',
        'onChain' : false,
        'listable' : true
    },{
        'name' : "Cronostars",
        'multiToken' : false,
        'address' : '0x03741A724d0E15F8FD052DAa56633a69090D20a3',
        'onChain' : false,
        'listable' :true
    },{
        "name" : "CROPhones",
        "multiToken" : false,
        "address" : "0x8D075e99EAE789B41b6ac8003c9bfacFb42dFf72",
        "onChain" : false,
        "listable" : true
    }, {
        "name" : "CronosEyezNFT",
        "multiToken" : false,
        "address" : "0xCE5caC89E25DBCCD590090994919a5Ef53bBD6C0",
        "onChain" : false,
        "listable" : true
    }, {
        "name" : "CROstmas Gnome",
        "multiToken" : false,
        "address" : "0xE8D59fB0259F440F5f17cE29975F98D728614f18",
        "onChain" : false,
        "listable" : true
    }, {
        "name" : "Croslothty",
        "multiToken" : false,
        "address" : "0x94fCEDf4e07f1c3906195FA76852675590886Aaa",
        "onChain" : false,
        "listable" : true
    }
    
]