import { useWeb3Store } from "@/stores/web3Store";
import { shortenAddress } from "@/utils/address";
import { supportedChains } from "@/constants/supportedChains";
import { useRouter } from "next/router";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  const {address, connectWallet, chainId, errorMessage} = useWeb3Store();
  var isSupportedChain: Boolean = false;

  if (chainId == supportedChains[0]) {
    isSupportedChain = true;
  }
  
  return (
    <nav className="flex items-center justify-between p-5" role="navigation">
        <div>
            <img className="sm:max-w-[200px] invert" src="../mrc-logo.png" alt="logo mr crypto"  onClick={() => router.push("/")}/>
        </div>
        <div className="ml-3">
        { 
          address != "" && address !== undefined && isSupportedChain
            ? <p className="flex-1 mr-2">
               <Link href={"/user/profile"}> <p className="text-center block text-blue-500 hover:bg-black text-xl"> {shortenAddress(address)} </p></Link>
              </p>  
          : <div></div>
        }  
        </div>
        <div className="ml-3">
        { !isSupportedChain && errorMessage.length != 0 ? <h2 className="text-center pb-2 text-2xl text-red-500">{errorMessage}</h2> : address !== "" && address !== undefined ? <p className="flex-1 mr-2">
              <Link href={"/"}> <p className="text-center block text-blue-500 hover:bg-black text-xl"> {shortenAddress(address)} </p></Link>
              </p>
            : <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" onClick={connectWallet}>  Connect Wallet </button>
          }   
            
        </div>
    </nav>
  )
}

export default Navbar