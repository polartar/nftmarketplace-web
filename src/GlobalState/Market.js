import {createSlice} from '@reduxjs/toolkit'
import { Contract, ethers} from 'ethers'
import rpc from '../Assets/networks/rpc_config.json'
import { ERC721, ERC1155 } from '../Contracts/Abis'
import Market from '../Contracts/Marketplace.json'
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/browser';
import { circularProgressClasses } from '@mui/material'


const gatewayTools = new IPFSGatewayTools();
const gateway = "https://mygateway.mypinata.cloud";
const pagesize = 8;
const listingsUri = "https://api.ebisusbay.com/listings?";
const readProvider = new ethers.providers.JsonRpcProvider("https://rpc.nebkas.ro/");
const readMarket = new Contract(rpc.market_contract, Market.abi, readProvider);

export const SortOrders = ['Listing ID', 'Price', 'Token ID']

const marketSlice = createSlice({
    name : 'market',
    initialState : {
        loadingPage : true,
        // totalListed : 0,
        totalPages : 0,
        listings : [[]],
        type: 'all',
        address: null,
        sortOrder : SortOrders[0],
        curPage : 1,
        // response: null,
        currentListing : null
    },
    reducers : {
        startLoading(state){
            state.loadingPage = true;
        },
        clearSet(state){
            state.listings = [[]];
            // state.totalListed = 0;
            state.loadingPage = true;
        },
        onNewPage(state, action){
            state.loadingPage = false;
            state.curPage = action.payload.page;
            state.listings[action.payload.page] = action.payload.newPage;
        },
        onTotalListed(state, action){
            // state.totalListed = action.payload.totalActive;
            state.listings = action.payload.listings;
            state.response = action.payload.response;
            state.totalPages = action.payload.totalPages;
            state.type = action.payload.type;
            state.address = action.payload.address;
        },
        onListingLoaded(state, action) {
            state.currentListing = action.payload;
            state.loadingPage = false;
        },
        onSort(state, action){
            if(action.payload.response !== null){
                state.listings = [[]]
                state.response = action.payload.response;
                state.curPage = 1;
                state.totalPages = state.response.totalPages; 
                state.listings[state.page] = state.response.listings;
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

        const rawResponse = await sortAndFetch('Listing ID', 1, type, address);
        const pages = rawResponse.totalPages;
        const listingsResponse = rawResponse.listings.map((e) => {
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
        }).filter(e => typeof e.name !== 'undefined'); //backend hasn't fetched metadata for this listing

        // if(type === 'collection'){
        //     listingsResponse = listingsResponse.filter((e) => e.nftAddress.toLowerCase() === address.toLowerCase());
        // } else if(type === 'seller'){
        //     listingsResponse = listingsResponse.filter((e) => e.seller.toLowerCase() === address.toLowerCase());
        // }
        // const pages = Math.ceil(listingsResponse.length / pagesize);
        // listingsResponse = sortByType(listingsResponse, state.market.sortOrder);
        const listings = new Array(pages);
        listings[1] = listingsResponse
        
        dispatch(onTotalListed({
            'type' : type,
            'totalPages' : pages,
            'listings' : new Array(pages),
            'address': address,
            // 'response' : listingsResponse
        }))
}

/**
 * 
                'name': name,
                'image' : image,
                'description' : description,
                'properties' : (properties) ? properties : [],
 */

export const loadPage = (page, type, address, order) => async(dispatch) => {
    ///TODO show loaded
    //dispatch(startLoading())
    const rawResponse = await sortAndFetch(order, page, type, address);
    const listingsResponse =  rawResponse.listings.map((e) => {
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
    }).filter(e => typeof e.name !== 'undefined');
    // const index = (page - 1) * pagesize;
    // let listings = [...state.market.response].splice(index, pagesize);
    dispatch(onNewPage({
        'page' : page,
        'newPage' : listingsResponse,
    }));
}

export const requestSort = (order, type, address) => async(dispatch) => {
    let response = await sortAndFetch(order, 1, type, address);
    dispatch(onSort({
        'response' : response,
        'order': order
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

async function sortAndFetch(order, page, type, address){
    let filter;
    if(order === SortOrders[0]){
        if(type !== 'all') {
            filter = `&${type}=${address}&sortBy=listingId&direction=asc`
        } else {
            filter = `&sortBy=listingId&direction=desc`
        }
    } else if (order === SortOrders[1]){
        if (type !== 'all'){
            filter = `&${type}=${address}&sortBy=price&direction=asc`
        } else {
            filter = `&sortBy=price&direction=asc`
        }
    } else {   
        if (type !== 'all'){
            filter = `&${type}=${address}&sortBy=tokenId&direction=asc`
        } else {
            filter = `&sortBy=tokenId&direction=asc`
        }
    }
    const uri = `${listingsUri}state=0&page=${page}&pageSize=${pagesize}${filter}`;
    const rawResponse = await (await fetch(uri)).json();
    return rawResponse;
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
    }, {
        "name" : "Crosmonauts",
        "multiToken" : false,
        "address" : "0xDFab622fC4E5CE1420F83cf38E52312f33849a0A",
        "onChain" : false,
        "listable" : true
    }, {
        "name" : "Pingoo Black Friday Ticket",
        "multiToken" : false,
        "address" : "0x948E8c6E0c9035f7372a10e10f9f71cC81341053",
        "onChain" : false,
        "listable" : false
    },{
        "name" : "Mad Meerkat",
        "multiToken" : false,
        "address" : "0x89dBC8Bd9a6037Cbd6EC66C4bF4189c9747B1C56",
        "onChain" : false,
        "listable" : false
    },{
        "name" : "Elon's Adventure",
        "multiToken" : false,
        "address" : "0x3Bf0a68a03fE82A5D21445f3a2306bB012dd50D9",
        "onChain" : false,
        "listable" : false
    },{
        "name" : "GameArtNFT ",
        "multiToken" : false,
        "address" : "0x6213e64dc1c3c9C56E23516b4853bb36674f6272",
        "onChain" : false,
        "listable" : true
    },{
        "name" : "SneakyPenguinsClub",
        "multiToken" : false,
        "address" : "0xb9f31aC76D21e529e41B4dB61af3ab7E2ec026D5",
        "onChain" : false,
        "listable" : true
    },
    
]