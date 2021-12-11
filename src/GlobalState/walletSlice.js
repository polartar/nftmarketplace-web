import { createSlice } from '@reduxjs/toolkit';
import { Contract, ethers, BigNumber} from 'ethers'
import rpc from '../Assets/networks/rpc_config.json'
import Membership from '../Contracts/EbisusBayMembership.json'
import Cronies from '../Contracts/CronosToken.json'
import Market from '../Contracts/Marketplace.json'
import { ERC721, ERC1155 , Elon} from '../Contracts/Abis'
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        connectingWallet: false,
        error: false,
        address: null,
        provider: null,
        web3modal: null,
        correctChain: false,
        needsOnboard: false,
        marketBalance: "Loading...",
        code: "",
        nfts: []
    },
    reducers: {
        connectingWallet: (state) => {
            state.connectingWallet = true;
            state.error = false;
        },
        onBasicAccountData: (state, action) => {
            state.address = action.payload.address;
            state.provider = action.payload.provider;
            state.web3modal = action.payload.web3modal;
            state.correctChain = action.payload.correctChain;
            state.needsOnboard = action.payload.needsOnboard;
        },
        accountChanged: (state, action) => {
            state.membershipContract = action.payload.membershipContract;
            state.croniesContract = action.payload.croniesContract;

            state.balance = action.payload.balance;
            state.code = action.payload.code;
            state.rewards = action.payload.rewards;
            state.isMember = action.payload.isMember;
            state.marketContract = action.payload.marketContract;
            state.marketBalance = action.payload.marketBalance;
            state.gettingContractData = false;
        },
        onLogout: (state) => {
            state.connectingWallet = false;
            const web3Modal = new Web3Modal({
                cacheProvider: false, // optional
                providerOptions: [] // required
            });
            web3Modal.clearCachedProvider();
            if (state.web3modal == null) {
                const web3Modal = new Web3Modal({
                    cacheProvider: false, // optional
                    providerOptions: [] // required
                });
                web3Modal.clearCachedProvider();
            } else {
                state.web3modal.clearCachedProvider();
            }
            state.web3modal = null;
            state.provider = null;
            state.address = "";
            state.balance = "Loading...";
            state.rewards = "Loading...";
            state.marketBalance = "Loading...";
            state.isMember = false;
        },
        elonContract: (state, action) => {
            state.elonContract = action.payload.elonContract;
        },
        fetchingNfts: (state, action) => {
            state.fetchingNfts = action.payload;
            if(action.payload){
                state.nfts = []
            }
        },
    },
});

export const { connectingWallet, walletConnected, onBasicAccountData, onLogout, elonContract, accountChanged } = walletSlice.actions;

export default walletSlice.reducer;

export const connectAccount = (firstRun=false) => async(dispatch) => {
    console.log('connect account.');
    const providerOptions = {
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
        },
        injected: {
            display: {
                logo: "https://github.com/MetaMask/brand-resources/raw/master/SVG/metamask-fox.svg",
                name: "MetaMask",
                description: "Connect with MetaMask in your browser"
            },
            package: null
        },
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
        var correctChain = cid === Number(rpc.chain_id)
        if (!correctChain) {
            correctChain = cid === rpc.chain_id
        }
        //console.log(correctChain);
        await dispatch(onBasicAccountData({
            address: address,
            provider: provider,
            web3modal: web3Modal,
            needsOnboard: false,
            correctChain: correctChain
        }));

        web3provider.on('disconnect', (error) => {
            dispatch(onLogout());
        });

        web3provider.on('accountsChanged', (accounts) => {
            dispatch(connectAccount());
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
        let elon;

        if(signer && correctChain){
            elon = new Contract(rpc.elon_contract, Elon, signer);
            dispatch(elonContract({
                elonContract : elon
            }));
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
            marketBalance :sales
        }))

    } catch (error) {
        console.log("Error connecting wallet!");
        await web3Modal.clearCachedProvider();
        dispatch(onLogout());
    }

    dispatch(connectingWallet({'connecting' : false}));
}