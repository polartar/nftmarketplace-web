import {createSlice} from '@reduxjs/toolkit'
import { Contract, ethers} from 'ethers'
import rpc from '../Assets/networks/rpc_config.json'
import { ERC721, ERC1155 } from '../Contracts/Abis'
import Market from '../Contracts/Marketplace.json'
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/browser';


const gatewayTools = new IPFSGatewayTools();
const gateway = "https://mygateway.mypinata.cloud";
const pagesize = 8;
const readProvider = new ethers.providers.JsonRpcProvider("https://rpc.nebkas.ro/");
const readMarket = new Contract(rpc.market_contract, Market.abi, readProvider);

const marketSlice = createSlice({
    name : 'market',
    initialState : {
        loadingPage : true,
        totalListed : 0,
        totalPages : 0,
        listings : [[]],
        response: null
    },
    reducers : {
        startLoading(state){
            state.loadingPage = true;
        },
        onNewPage(state, action){
            state.loadingPage = false;
            state.listings[action.payload.page] = action.payload.newPage;
        },
        onTotalListed(state, action){
            state.totalListed = action.payload.totalActive;
            state.listings = action.payload.listings;
            state.response = action.payload.response;
            state.totalPages = action.payload.totalPages;
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

const {
    startLoading,
    onNewPage,
    onTotalListed
} = marketSlice.actions;

export const market = marketSlice.reducer;

export const init = (state) => async(dispatch) => {
    if(state.market.totalListed == 0){
        const totalActive = await (await readMarket.totalActive()).toNumber();
        const pages = Math.ceil(totalActive / pagesize)
        const rawResponse = await readMarket.openListings(1, totalActive);

        const listingsResponse = rawResponse.map((val) => {
            return {
                'listingId' : val['listingId'],
                'nftId'     : val['nftId'],
                'seller'    : val['seller'],
                'nftAddress': val['nft'],
                'price'     :val['price'],
                'fee'       : val['fee'],
                'is1155'    : val['is1155']
            }
        
        });
        
        dispatch(onTotalListed({
            'totalActive' : totalActive,
            'totalPages' : pages,
            'listings' : new Array(pages),
            'response' : listingsResponse
        }))

    }
}

export const loadPage = (state, page) => async(dispatch) => {
    dispatch(startLoading())

    const index = (page - 1) * pagesize;
    let listings = [...state.market.response].splice(index, pagesize);

    let pageListing = [];
    for(let i = 0; i < listings.length; i++){
        let listing = listings[i];
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
                const properties = json.properties; 
                const nft = {
                    'name': name,
                    'image' : image,
                    'description' : description,
                    'properties' : properties,
                }
                pageListing.push({
                    ...listing,
                    'nft' : nft
                })
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
                    pageListing.push({
                        ...listing,
                        'nft' : nft
                    })
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
                        continue;
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
                        'name' : json.name,
                        'image' : image,
                        'description' : json.description,
                        'properties' : (json.properties) ? json.properties : json.attributes,
                    }
                    pageListing.push({
                        ...listing,
                        'nft' : nft
                    })
                }
            }
        }catch(error){
            console.log(error);
        }
    }
    dispatch(onNewPage({
        'page' : page,
        'newPage' : pageListing
    }));
}

// export const loadMarket = () => async(dispatch) => {

//     dispatch(loadingMarket());
//     const totalActive = await readMarket.totalActive();
//     dispatch(onTotalListed(totalActive))
//     if(totalActive > 0){
//         const listingsResponse = await readMarket.openListings(1,8)
//         const listings = listingsResponse.map((val) => {
//             return {
//                 'listingId' : val['listingId'],
//                 'nftId'     : val['nftId'],
//                 'seller'    : val['seller'],
//                 'nftAddress': val['nft'],
//                 'price'     :val['price'],
//                 'fee'       : val['fee'],
//                 'is1155'    : val['is1155']
//             }

//         })
//         let pageListing = [];
//         for(let i = 0; i < listings.length; i++){
//             let listing = listings[i];
//             try{
//                 if(listing.is1155){
//                     const contract = new Contract(listing.nftAddress, ERC1155, readProvider);
//                     let uri = await contract.uri(listing.nftId);
//                     if(gatewayTools.containsCID(uri)){
//                         try{
//                             uri = gatewayTools.convertToDesiredGateway(uri, gateway);
//                         }catch(error){
//                             //console.log(error);
//                         }
//                     } 
//                     const json = await (await fetch(uri)).json();
//                     const name = json.name;
//                     const image = gatewayTools.containsCID(json.image) ? gatewayTools.convertToDesiredGateway(json.image, gateway) : json.image;
//                     const description = json.description;
//                     const properties = json.properties; 
//                     const nft = {
//                         'name': name,
//                         'image' : image,
//                         'description' : description,
//                         'properties' : properties,
//                     }
//                     pageListing.push({
//                         ...listing,
//                         'nft' : nft
//                     })
//                 } else {
//                     const contract = new Contract(listing.nftAddress, ERC721, readProvider);
//                     let uri = await contract.tokenURI(listing.nftId);
//                     if(listing.nftAddress === rpc.cronie_contract){
//                         const json = Buffer.from(uri.split(',')[1], 'base64');
//                         const parsed = JSON.parse(json);
//                         const name = parsed.name;
//                         const image = dataURItoBlob(parsed.image, 'image/svg+xml');
//                         const desc = parsed.description;
//                         const properties = [];//(parsed.properties) ? parsed.properties : parsed.attributes;
//                         const nft = {
//                             'name' : name,
//                             'image' : URL.createObjectURL(image),
//                             'description' : desc,
//                             'properties' : properties,
//                         }
//                         pageListing.push({
//                             ...listing,
//                             'nft' : nft
//                         })
//                     } else {
//                         if(gatewayTools.containsCID(uri)){
//                             try{
//                                 uri = gatewayTools.convertToDesiredGateway(uri, gateway);                                        
//                             }catch(error){
//                                // console.log(error);
//                             }
//                         }
//                         let json
//                         if(uri.includes('unrevealed')){
//                             continue;
//                         } else{
//                             json = await (await fetch(uri)).json();
//                         }
//                         let image
//                         if(gatewayTools.containsCID(json.image)){
//                             try {
//                                 image = gatewayTools.convertToDesiredGateway(json.image, gateway);
                                
//                             }catch(error){
//                                 image = json.image;
//                             }
//                         } else {
//                             image = json.image;
//                         }
//                         const nft = {
//                             'name' : json.name,
//                             'image' : image,
//                             'description' : json.description,
//                             'properties' : (json.properties) ? json.properties : json.attributes,
//                         }
//                         pageListing.push({
//                             ...listing,
//                             'nft' : nft
//                         })
//                     }
//                 }
//             }catch(error){
//                 console.log(error);
//             }
//         }
//         dispatch(onNewPage({
//             'newPage' : pageListing
//         }));
//     } else{
//         dispatch(onNewPage({
//             'newPage' : []
//         }));
//     }
// }

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