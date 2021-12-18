import { Contract, ethers } from "ethers";
import config from "../Assets/networks/rpc_config.json";
import Market from "../Contracts/Marketplace.json";
import { ERC1155, ERC721 } from '../Contracts/Abis'
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/browser';
import { dataURItoBlob } from "../Store/utils";
import moment from "moment";

const gatewayTools = new IPFSGatewayTools();
const gateway = "https://mygateway.mypinata.cloud";
const readProvider = new ethers.providers.JsonRpcProvider(config.read_rpc);
const readMarket = new Contract(config.market_contract, Market.abi, readProvider);
const knownContracts = config.known_contracts;

const api = {
    baseUrl: config.api_base,
    listings:  '/listings',
    collections: '/collections',
    marketData: '/marketdata',
}

export default api;

// export const ebisusApi = createApi({
//     reducerPath: 'ebisusApi',
//     baseQuery: fetchBaseQuery({  baseUrl: 'https://api.ebisusbay.com' }),
//     endpoints: (builder) => ({
//         fetchListings: builder.query
//     })
// });

export async function sortAndFetchListings(page, sort, filterType, filterAddress) {
    let pagesize = 12;

    let query = {
        state: 0,
        page: page,
        pageSize: pagesize,
        sortBy: 'tokenId',
        direction: 'asc'
    };
    if (filterAddress != null) query[filterType] = filterAddress;
    if (sort != null && sort.type != null) {
        const sortProps = {
            sortBy: sort.type,
            direction: sort.direction
        };
        query = {...query, ...sortProps}
    }
    const queryString = new URLSearchParams(query);

    const url = new URL(api.listings, `${api.baseUrl}`);
    const uri = `${url}?${queryString}`;
    return await (await fetch(uri)).json();
}

export async function getListing(listingId) {
    try{
        const uri = `${api.baseUrl}${api.listings}?listingId=${listingId}`;
        var rawListing = await (await fetch(uri)).json();

        rawListing = rawListing['listings'][0];
        const listing = {
            'listingId'   : rawListing['listingId'],
            'nftId'       : rawListing['nftId'],
            'seller'      : rawListing['seller'],
            'nftAddress'  : rawListing['nftAddress'],
            'price'       : rawListing['price'],
            'fee'         : rawListing['fee'],
            'is1155'      : rawListing['is1155'],
            'state'       : rawListing['state'],
            'purchaser'   : rawListing['purchaser'],
            'listingTime' : rawListing['listingTime'],
            'saleTime'    : rawListing['saleTime'],
            'endingTime'  : rawListing['endingTime'],
            'royalty'     : rawListing['royalty'],
            'nft'         : rawListing['nft']
        }
        return listing;

    }catch(error){
        console.log(error)
    }
}

export async function getMarketMetadata() {
    const uri = `${api.baseUrl}${api.marketData}`;

    return await (await fetch(uri)).json();
}

export async function getCollectionMetadata(contractAddress, sort, filter) {
    let query = {
        sortBy: 'totalVolume',
        direction: 'desc'
    };
    if (filter != null) query[filter.type] = filter.value;
    if (sort != null && sort.type != null) {
        const sortProps = {
            sortBy: sort.type,
            direction: sort.direction
        };
        query = {...query, ...sortProps}
    }
    if (contractAddress != null) query['collection'] = contractAddress;

    const queryString = new URLSearchParams(query);

    const uri = `${api.baseUrl}${api.collections}?${queryString}`;
    return await (await fetch(uri)).json();
}

export async function getNftsForAddress(walletAddress, walletProvider, onNftLoaded) {
    if(walletAddress && walletProvider){

        const signer = walletProvider.getSigner();
        const listingsReponse = await (await fetch(`${api.baseUrl}${api.listings}?seller=${walletAddress}&state=0`)).json()
        const listings = listingsReponse.listings;

        let response = {
            nfts: [],
            isMember: false
        };

        await Promise.all(
            knownContracts.map(async (c, i) => {
                try{
                    if(c.multiToken){
                        const contract = new Contract(c.address, ERC1155, signer);
                        contract.connect(signer);
                        let count = await contract.balanceOf(walletAddress, c.id);
                        count = count.toNumber();
                        if(c.address === config.membership_contract && count > 0) {
                            response.isMember = true;
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

                            onNftLoaded([nft]);
                        }

                    } else {
                        var nfts = [];
                        const contract = new Contract(c.address, ERC721, signer);
                        const readContract = new Contract(c.address, ERC721, readProvider);
                        contract.connect(signer);
                        const count = await contract.balanceOf(walletAddress);
                        for(let i = 0; i < count; i++){
                            const id = await readContract.tokenOfOwnerByIndex(walletAddress, i);
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
                        onNftLoaded(nfts);
                    }
                }catch(error){
                    console.log('error fetching ' + knownContracts[i].name);
                    console.log(error);
                }

            })
        )

        return response;
    }

}

export async function getNftSalesForAddress(walletAddress) {
    try {
        const response = await fetch(`${ api.baseUrl }${ api.listings }?seller=${ walletAddress }&state=1`);
        const json = await response.json();

        const listings = json.listings || [];


        const filteredListings = listings.map(item => {

            const { saleTime, listingId, price, nft, purchaser } = item;

            const { name, image } = nft || {};

            return {
                name,
                image,
                saleTime: moment(new Date(saleTime * 1000)).format("DD/MM/YYYY, HH:mm"),
                listingId,
                price,
                purchaser,
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('listings:              ', listings)
            console.log('filteredListings:      ', filteredListings)
        }

        return filteredListings;

    } catch (error) {
        console.log('error fetching sales for: ' + walletAddress);
        console.log(error);

        return [];
    }
}

export async function getNft(collectionId, nftId) {
    try {
        let nft;
        try{
            const internalUri = `https://app.ebisusbay.com/files/${collectionId.toLowerCase()}/metadata/${nftId}.json`;

            return await (await fetch(internalUri)).json();
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

        return nft;
    } catch (error) {
        console.log(error);
    }
}
