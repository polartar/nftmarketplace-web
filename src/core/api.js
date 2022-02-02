import { Contract, ethers } from "ethers";
import config from "../Assets/networks/rpc_config.json";
import Market from "../Contracts/Marketplace.json";
import { ERC1155, ERC721, MetaPixelsAbi } from '../Contracts/Abis'
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/browser';
import { dataURItoBlob } from "../Store/utils";
import moment from "moment";
import { SortOption } from '../Components/Models/sort-option.model';

import { FilterOption } from "../Components/Models/filter-option.model";

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
    nft: '/nft',
    auctions: '/auctions'
}

export default api;

// export const ebisusApi = createApi({
//     reducerPath: 'ebisusApi',
//     baseQuery: fetchBaseQuery({  baseUrl: 'https://api.ebisusbay.com' }),
//     endpoints: (builder) => ({
//         fetchListings: builder.query
//     })
// });

export async function sortAndFetchListings(page, sort, filter, traits, powertraits, search) {
    let pagesize = 12;

    let query = {
        state: 0,
        page: page,
        pageSize: pagesize,
        sortBy: 'listingId',
        direction: 'desc'
    };

    if (filter && filter instanceof FilterOption) {
        query = {...query, ...filter.toApi()};
    }

    if (sort && sort instanceof SortOption) {
        query = {...query, ...sort.toApi()};
    }

    if (traits && Object.keys(traits).length > 0) {
        //  traits      = { traitCategoryName1: {traitName2: true }, traitCategoryName3: {traitName4: false}}
        //  traitFilter = { traitCategoryName1: ['traitName2']}
        const traitFilter = Object.keys(traits).map((traitCategoryName) => {

            const traitCategory = traits[traitCategoryName];

            const traitCategoryKeys = Object.keys(traitCategory);

            const truthyFilters = traitCategoryKeys
                .filter((traitCategoryKey) => traitCategory[traitCategoryKey]);

            return truthyFilters.length === 0 ? {} : { [traitCategoryName]: truthyFilters };

        }).reduce((prev, curr) => ({ ...prev, ...curr }), {});

        query['traits'] = JSON.stringify(traitFilter);
    }

    if (powertraits && Object.keys(powertraits).length > 0) {
        const traitFilter = Object.keys(powertraits).map((traitCategoryName) => {

            const traitCategory = powertraits[traitCategoryName];

            const traitCategoryKeys = Object.keys(traitCategory);

            const truthyFilters = traitCategoryKeys
                .filter((traitCategoryKey) => traitCategory[traitCategoryKey]);

            return truthyFilters.length === 0 ? {} : { [traitCategoryName]: truthyFilters };

        }).reduce((prev, curr) => ({ ...prev, ...curr }), {});

        query['powertraits'] = JSON.stringify(traitFilter);
    }

    if (search) query['search'] = search;

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

export async function getCollectionTraits(contractAddress) {
    try {
        const internalUri = `https://app.ebisusbay.com/files/${contractAddress.toLowerCase()}/rarity.json`;

        return await (await fetch(internalUri)).json();
    } catch (error) {
        console.log(error);
    }

    return null;
}

export async function getCollectionPowertraits(contractAddress) {
    try {
        const internalUri = `https://app.ebisusbay.com/files/${contractAddress.toLowerCase()}/powertraits.json`;

        return await (await fetch(internalUri)).json();
    } catch (error) {
        console.log(error);
    }

    return null;
}

export async function getNftsForAddress(walletAddress, walletProvider, onNftLoaded) {
    if(walletAddress && walletProvider){

        const signer = walletProvider.getSigner();
        const listingsReponse = await (await fetch(`${api.baseUrl}${api.listings}?seller=${walletAddress}&state=0`)).json()
        const listings = listingsReponse.listings;

        //  Helper function
        const isListed = (address, id) => {
            return !!listings.find(listing => {
                const sameId = ethers.BigNumber.from(listing['nftId']).eq(id);
                const sameAddress = listing['nftAddress'].toLowerCase() === address.toLowerCase();
                return sameId && sameAddress;
            });
        };

        //  Helper function
        const getListingId = (address, id) => {
            return listings.find(listing => {
                const sameId = ethers.BigNumber.from(listing['nftId']).eq(id);
                const sameAddress = listing['nftAddress'].toLowerCase() === address.toLowerCase();
                return sameId && sameAddress;
            }).listingId;
        };

        //  Helper function
        const getListingPrice = (address, id) => {
            return listings.find(listing => {
                const sameId = ethers.BigNumber.from(listing['nftId']).eq(id);
                const sameAddress = listing['nftAddress'].toLowerCase() === address.toLowerCase();
                return sameId && sameAddress;
            }).price;
        };

        let response = {
            nfts: [],
            isMember: false
        };

        await Promise.all(
            knownContracts.map(async (knownContract) => {
                try{
                    if(knownContract.multiToken){
                        const contract = new Contract(knownContract.address, ERC1155, signer);
                        contract.connect(signer);
                        const count = await (async () => {
                            const bigNumber = await contract.balanceOf(walletAddress, knownContract.id);
                            return bigNumber.toNumber();
                        })();
                        if(knownContract.address === config.membership_contract && count > 0) {
                            response.isMember = true;
                        }
                        if(count !== 0){
                            let uri = await contract.uri(knownContract.id);

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
                            const listed = isListed(knownContract.address, knownContract.id);
                            const listingId = listed ? getListingId(knownContract.address, knownContract.id) : null;
                            const price = listed ? getListingPrice(knownContract.address, knownContract.id) : null;
                            const nft = {
                                'name': name,
                                'id' : knownContract.id,
                                'image' : image,
                                'count' : count,
                                'description' : description,
                                'properties' : properties,
                                'contract' : contract,
                                'address' : knownContract.address,
                                'multiToken' : true,
                                'listable' : knownContract.listable,
                                listed,
                                listingId,
                                price
                            }

                            onNftLoaded([nft]);
                        }

                    } else if (knownContract.address) {
                        var nfts = [];

                        const contract = (() => {
                            if (knownContract.name === 'MetaPixels') {
                                return new Contract(knownContract.address, MetaPixelsAbi, signer);
                            }

                            return new Contract(knownContract.address, ERC721, signer);
                        })();

                        const readContract = (() => {
                            if (knownContract.name === 'MetaPixels') {
                                return new Contract(knownContract.address, MetaPixelsAbi, readProvider);
                            }

                            return new Contract(knownContract.address, ERC721, readProvider);
                        })();

                        contract.connect(signer);

                        const count = await (async () => {
                            const bigNumber = await contract.balanceOf(walletAddress);
                            return bigNumber.toNumber();
                        })();

                        const ids = await (async () => {
                            if (count > 0) {
                                try {
                                    await readContract.tokenOfOwnerByIndex(walletAddress, 0);
                                } catch (error) {
                                    return await readContract.walletOfOwner(walletAddress);
                                }
                            }
                            return [];
                        })();

                        for(let i = 0; i < count; i++) {
                            const id = await (async () => {
                                if (ids.length === 0) {
                                    try {
                                        return await readContract.tokenOfOwnerByIndex(walletAddress, i);
                                    } catch (error) {
                                        return null;
                                    }
                                } else {
                                    return ids[i];
                                }
                            })();

                            if (id === null) {
                                continue;
                            }
                            const listed = isListed(knownContract.address, id);
                            const listingId = listed ? getListingId(knownContract.address, id) : null;
                            const price = listed ? getListingPrice(knownContract.address, id) : null;

                            const uri = await (async () => {
                                if (knownContract.name === 'Ant Mint Pass') {
                                    //  fix for https://ebisusbay.atlassian.net/browse/WEB-166
                                    //  ant mint pass contract hard coded to this uri for now - remove this when CSS goes live
                                    return 'https://gateway.pinata.cloud/ipfs/QmWLqeupPQsb4MTtJFjxEniQ1F67gpQCzuszwhZHFx6rUM';
                                }

                                if (knownContract.name === 'Red Skull Potions') {
                                    // fix for CroSkull's Red Skull Potions
                                    return `https://gateway.pinata.cloud/ipfs/QmQd9sFZv9aTenGD4q4LWDQWnkM4CwBtJSL82KLveJUNTT/${ id }`;
                                }

                                if (knownContract.name === 'MetaPixels') {
                                    return await readContract.lands(id);
                                }

                                return await readContract.tokenURI(id);
                            })();

                            if (knownContract.name === 'MetaPixels') {
                                const image = `${ uri.image }`.startsWith('https://') ? uri.image : `https://ipfs.metaversepixels.app/ipfs/${ uri.image }`;
                                const description = uri.detail;
                                const name = `${ knownContract.name } ${ id }`;
                                const properties = {};
                                nfts.push({
                                    id,
                                    name,
                                    image,
                                    description,
                                    properties,
                                    contract,
                                    address: knownContract.address,
                                    multiToken: false,
                                    listable: false,
                                    transferable: false,
                                    listed,
                                    listingId,
                                    price
                                });
                                continue;
                            }

                            if (knownContract.onChain) {
                                const json = Buffer.from(uri.split(',')[1], 'base64');
                                const parsed = JSON.parse(json);
                                const name = parsed.name;
                                const image = dataURItoBlob(parsed.image, 'image/svg+xml');
                                const desc = parsed.description;
                                const properties = (parsed.properties) ? parsed.properties : parsed.attributes;
                                const nft = {
                                    id,
                                    'name': name,
                                    'image': URL.createObjectURL(image),
                                    'description': desc,
                                    'properties': properties,
                                    'contract': contract,
                                    'address': knownContract.address,
                                    'multiToken': false,
                                    'listable': knownContract.listable,
                                    listed,
                                    listingId,
                                    price
                                };
                                nfts.push(nft);
                                continue;
                            }

                            const checkedUri = (() => {
                                try {
                                    if (gatewayTools.containsCID(uri) && !uri.startsWith('ar')) {
                                        return gatewayTools.convertToDesiredGateway(uri, gateway);
                                    }

                                    if (uri.startsWith('ar')) {
                                        return `https://arweave.net/${ uri.substring(5) }`;
                                    }

                                    return uri;
                                } catch (e) {
                                    return uri;
                                }
                            })();

                            const json = await (async () => {
                                if (checkedUri.includes('unrevealed')) {
                                    return {
                                        id,
                                        'name': knownContract.name + ' ' + id,
                                        'description': 'Unrevealed!',
                                        'image': "",
                                        'contract': contract,
                                        'address': knownContract.address,
                                        'multiToken': false,
                                        'properties': [],
                                        'listable': knownContract.listable,
                                        listed,
                                        listingId,
                                        price
                                    }
                                } else {
                                    return await (await fetch(uri)).json();
                                }
                            })();

                            const image = (() => {
                                try {
                                    if (json.image.startsWith('ipfs')) {
                                        return `${ gateway }/ipfs/${ json.image.substring(7) }`;
                                    }

                                    if (gatewayTools.containsCID(json.image) && !json.image.startsWith('ar')) {
                                        return gatewayTools.convertToDesiredGateway(json.image, gateway);
                                    }

                                    if (json.image.startsWith('ar')) {
                                        if (typeof json.tooltip !== 'undefined') {
                                            return `https://arweave.net/${ json.tooltip.substring(5) }`;
                                        } else {
                                            return `https://arweave.net/${ json.image.substring(5) }`;
                                        }
                                    }

                                    return json.image;

                                } catch (e) {
                                    return json.image;
                                }
                            })();

                            const nft = {
                                id,
                                'name': json.name,
                                'image': image,
                                'description': json.description,
                                'properties': (json.properties) ? json.properties : json.attributes,
                                'contract': contract,
                                'address': knownContract.address,
                                'multiToken': false,
                                'listable': knownContract.listable,
                                listed,
                                listingId,
                                price
                            }
                            nfts.push(nft);
                        }

                        if (nfts.length > 0) {
                            onNftLoaded(nfts);
                        }
                    }
                }catch(error){
                    console.log('error fetching ' + knownContract.name);
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

        const sortedListings = listings.sort((a, b) => b.saleTime - a.saleTime);

        const filteredListings = sortedListings.map(item => {

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

export async function getNftSalesHistory(collectionId, nftId) {
    try{
        const queryString = new URLSearchParams({
            collection: collectionId.toLowerCase(),
            tokenId: nftId
        });

        const url = new URL(api.nft, `${api.baseUrl}`);
        const uri = `${url}?${queryString}`;

        const result = await (await fetch(uri)).json();

        return result.listings ?? [];
    }catch(error){
        console.log(error)
        return [];
    }
}

export async function getNft(collectionId, nftId, useFallback = true) {
    try{
        const queryString = new URLSearchParams({
            collection: collectionId.toLowerCase(),
            tokenId: nftId
        });

        const url = new URL(api.nft, `${api.baseUrl}`);
        const uri = `${url}?${queryString}`;

        const result = await (await fetch(uri)).json();

        if (useFallback && !result.nft) {
            result.nft = await getNftFromFile(collectionId, nftId);
        }

        return result;
    }catch(error){
        console.log(error)
        return await getNftFromFile(collectionId, nftId);
    }
}

export async function getNftFromFile(collectionId, nftId) {
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


export async function sortAndFetchAuctions(page) {
    const url = new URL(api.auctions, `${api.baseUrl}`);
    return await (await fetch(url)).json();
}

export async function getAuction(auctionId) {
    try{
        const uri = `${api.baseUrl}${api.auctions}?auctionId=${auctionId}`;
        var rawListing = await (await fetch(uri)).json();

        return rawListing['auctions'][0];
    }catch(error){
        console.log(error)
    }
}
