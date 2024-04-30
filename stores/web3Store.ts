import { supportedChains } from '@/constants/supportedChains';
import { ethers } from 'ethers';
import { create } from 'zustand';

interface IWeb3State {
    address: string;
    isConnected: boolean;
    chainId: number;
    provider?: ethers.providers.Web3Provider;
    errorMessage: string

    connectWallet: () => Promise<void>;  
    disconnect: () => void;
    changeAddress: (address: string) => void;
    changeChainId: (chainId: number) => void;
    setProvider: () => void;
}

export const useWeb3Store = create<IWeb3State>((set) => ({
    address: "",
    isConnected: false,
    chainId: 0,
    provider: undefined,
    errorMessage: "",

    async connectWallet() {
        if (!window.ethereum) return set({
            errorMessage: "You need install metamask"
        })
    
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider?.send("eth_requestAccounts", []);   
        const chainId = await (await provider.getNetwork()).chainId;

        if(checkChain(chainId)) return set({
            errorMessage: "Unsupported chain"
        })

        set({
            isConnected: true,
            address: accounts[0],
            provider,
            chainId
        })
    },
    changeAddress(address) {
        set({
            address
        })
    },
    changeChainId(chainId) {
        if(checkChain(chainId)) return set({
            chainId: chainId,
            errorMessage: "Unsupported chain"
        })
        set({
            chainId,
            errorMessage: ""
        })
    },
    disconnect() {
        set({
            address: "",
            isConnected: false,
            chainId: 0,            
        })
    },
    setProvider() {
        if (!window.ethereum) return set({
            errorMessage: "You need install metamask"
        })

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        set({
            provider,
            errorMessage: ""
        })
    },

  }))

  const checkChain = (chainId: number): boolean => {
    return !supportedChains.includes(chainId);
  }