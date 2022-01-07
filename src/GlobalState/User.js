import {createSlice} from '@reduxjs/toolkit'
import { Contract, ethers, BigNumber} from 'ethers'
import config from '../Assets/networks/rpc_config.json'
import Membership from '../Contracts/EbisusBayMembership.json'
import Cronies from '../Contracts/CronosToken.json'
import Market from '../Contracts/Marketplace.json'
import Web3Modal from "web3modal";

import detectEthereumProvider from '@metamask/detect-provider'
import { DeFiWeb3Connector } from 'deficonnect'
import  WalletConnectProvider from '@deficonnect/web3-provider'
import cdcLogo from '../Assets/cdc_logo.svg'
import { getNftSalesForAddress, getNftsForAddress } from "../core/api";

const userSlice = createSlice({
    name : 'user',
    initialState : {
        // Wallet
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
        cronies : [],
        founderCount : 0,
        vipCount : 0,
        needsOnboard: false,
        membershipContract: null,
        croniesContract: null,
        marketContract: null,
        // ebisuContract : null,
        correctChain : false,
        showWrongChainModal : false,

        // My NFTs
        fetchingNfts: false,
        nftsInitialized: false,
        nfts: [],

        // My Sales
        mySoldNftsFetching: false,
        mySoldNfts: [],

        // Theme
        theme: 'light'
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
            // state.ebisuContract = action.payload.ebisuContract;
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
            state.fetchingNfts = true;
            state.nfts = []
        },
        onNftsAdded(state, action){
            state.nfts.push(...action.payload);
        },
        onNftsReplace(state, action){
            state.nfts = action.payload;
        },
        nftsFetched(state){
            state.fetchingNfts = false;
            state.nftsInitialized = true;
        },
        onNftLoading(state, action){
            state.currentNft = null;
        },
        onNftLoaded(state, action){
            state.currentNft = action.payload.nft;
        },
        mySoldNftsFetching(state, action){
            state.mySoldNftsFetching = true;
            state.mySoldNfts = []
        },
        mySalesFetched(state, action){
            state.mySoldNftsFetching = false;
        },
        mySalesOnNftsAdded(state, action){
            state.mySoldNfts.push(...action.payload);
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
        setShowWrongChainModal(state, action){
            state.showWrongChainModal = action.payload;
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
            state.fetchingNfts = false;
            state.nftsInitialized = false;
            state.nfts = [];
            state.mySoldNftsFetching = false;
            state.mySoldNfts = [];
        },
        onThemeChanged(state, action) {
            console.log('onThemeChanged', action.payload);
            state.theme = action.payload;
        }
    }
});

export const {
    accountChanged,
    onProvider,
    fetchingNfts,
    onNftsLoaded,
    onNftLoading,
    onNftsAdded,
    onNftsReplace,
    nftsFetched,
    onNftLoaded,
    mySoldNftsFetching,
    mySalesFetched,
    mySalesOnNftsAdded,
    connectingWallet,
    onCorrectChain,
    registeredCode,
    withdrewRewards,
    withdrewPayments,
    listingUpdate,
    transferedNFT,
    setIsMember,
    setShowWrongChainModal,
    onBasicAccountData,
    onLogout,
    elonContract,
    onThemeChanged
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

    const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions // required
    });

    if (process.env.NODE_ENV !== 'production') {
        console.log("Opening a dialog", web3Modal);
    }

    var web3provider;
    try {
        web3provider = await web3Modal.connect();
    } catch(e) {
        console.log("Could not get a wallet connection", e);
        dispatch(onLogout());
        return;
    }

    try {
        dispatch(connectingWallet({'connecting' : true}));
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

        if (process.env.NODE_ENV !== 'production') {
            console.log('cid:       ', cid)
            console.log('chain_id:  ', config.chain_id)
        }
        var correctChain = cid === Number(config.chain_id);

        if (!correctChain) {
            correctChain = cid === config.chain_id
        }

        if (!correctChain) {
            await dispatch(setShowWrongChainModal(true));
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
            dispatch(onLogout());
        });

        web3provider.on('disconnect', (error) => {
            dispatch(onLogout());
        });

        web3provider.on('accountsChanged', (accounts) => {
            dispatch(onLogout());
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
        // let ebisu;

        if(signer && correctChain){
            // ebisu = new Contract(config.ebisu_contract, Elon, signer);
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
        }))
    } catch (error) {
        console.log(error)
        console.log("Error connecting wallet!");
        await web3Modal.clearCachedProvider();
        dispatch(onLogout());
    }
    dispatch(connectingWallet({'connecting' : false}));

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

export const fetchNfts = (walletAddress, walletProvider, nftsInitialized) => async (dispatch) => {
    if (!nftsInitialized) {
        dispatch(fetchingNfts());
        const response = await getNftsForAddress(walletAddress, walletProvider, (nfts) => {
            dispatch(onNftsAdded(nfts));
        });
        dispatch(setIsMember(response.isMember));
        dispatch(nftsFetched());

        return;
    }

    const loadedNfts = [];
    const response = await getNftsForAddress(walletAddress, walletProvider, (nfts) => {
        loadedNfts.push(...nfts);
    });
    dispatch(fetchingNfts());
    dispatch(onNftsReplace(loadedNfts));
    dispatch(setIsMember(response.isMember));
    dispatch(nftsFetched());
}

export const fetchSales = (walletAddress) => async (dispatch) => {
    dispatch(mySoldNftsFetching());

    const listings = await getNftSalesForAddress(walletAddress);

    dispatch(mySalesOnNftsAdded(listings))

    dispatch(mySalesFetched());
};

export const setTheme = (theme) => async(dispatch) =>{
    console.log('setting theme.....', theme)
    dispatch(onThemeChanged(theme));
}
