import { useWeb3Store } from '@/stores/web3Store'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'


export default function App({ Component, pageProps }: AppProps) {

  const {changeChainId, changeAddress, setProvider} = useWeb3Store();
 
  useEffect(() => {
    setProvider()
    if(!window.ethereum) return    

    window.ethereum.on("accountsChanged", (acc: string[]) => {
      changeAddress(acc[0]);
    });

    window.ethereum.on("chainChanged", (newChain: number) => {
      console.log(`Chain id ${Number(newChain)}`)
      changeChainId(Number(newChain));
    });

  }, [])

  return <Component {...pageProps}/>
}
