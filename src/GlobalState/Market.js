import {createSlice} from '@reduxjs/toolkit'
import { Contract, ethers} from 'ethers'
import config from '../Assets/networks/rpc_config.json'
import { ERC721, ERC1155 } from '../Contracts/Abis'
import Market from '../Contracts/Marketplace.json'
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/browser';


const gatewayTools = new IPFSGatewayTools();
const gateway = "https://mygateway.mypinata.cloud";
const pagesize = 8;
const listingsUri = `${config.api_base}listings?`;
const readProvider = new ethers.providers.JsonRpcProvider(config.read_rpc);
const readMarket = new Contract(config.market_contract, Market.abi, readProvider);

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
        console.log(rawResponse);
        const pages = rawResponse.totalPages;
        const listingsResponse = rawResponse.listings.map((e) => {
            // const nft = {
            //     'name' : e.name,
            //     'image' : e.image,
            //     'description' : e.description,
            //     'properties' : (e.properties) ? e.properties : []
            // }
            return {
                ...e,
                'listingId': ethers.BigNumber.from(e.listingId),
                'price' : ethers.utils.parseEther(String(e.price)),
                // 'nft' : nft
            }
        }); //backend hasn't fetched metadata for this listing

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
        // const nft = {
        //     'name' : e.name,
        //     'image' : e.image,
        //     'description' : e.description,
        //     'properties' : (e.properties) ? e.properties : []
        // }
        return {
            ...e,
            'listingId': ethers.BigNumber.from(e.listingId),
            'price' : ethers.utils.parseEther(String(e.price)),
            // 'nft' : nft
        }
    });
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
            if(listing.nftAddress === config.cronie_contract){
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
    console.log(uri);
    const rawResponse = await (await fetch(uri)).json();
    return rawResponse;
}

export const knownContracts = config.known_contracts;