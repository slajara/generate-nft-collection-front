import { useState, useEffect } from "react";
import { useWeb3Store } from "@/stores/web3Store";
import contractFactory from "../constants/constants.json";
import { ethers } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import { CircularProgress } from "@mui/material";

const Mint = () => {
  const { provider } = useWeb3Store();
  const [amountNFT, setAmountNFT] = useState(1);
  const [amountWei, setAmountWei] = useState<number>();
  const [collectionID, setCollectionID] = useState<number>();
  const [tokenID, setTokenID] = useState<number>();
  const [price, setPrice] = useState<number>();
  const [isInProgress, setIsInProgres] = useState<boolean>();

  const showToastMessage = () => {
    toast.success('Mint completed!', {
        position: toast.POSITION.TOP_RIGHT
    });
};


  const nftcontractSigner = new ethers.Contract(
    contractFactory.address,
    contractFactory.abi,
    provider?.getSigner()
  );

  const nftcontract = nftcontractSigner.connect(nftcontractSigner.provider);

  async function getData() {
    if (!nftcontract) return;

    try {
      const price = await nftcontract.getCollectionTokenMintPrice(
        collectionID,
        tokenID
      );
      setPrice(price);
      return price;
    } catch (error) {
      console.log(error);
    }
  }

  async function getMint() {
    if (!nftcontractSigner) return;
    if (!provider) return;
    if (!collectionID) return;
    if (!tokenID) return;
    setIsInProgres(true);


    const firstPrice = await getData();

    console.log("Mint....");
    console.log("collectionID: ", collectionID);
    console.log("tokenID: ", tokenID);
    console.log("amountNFT: ", amountNFT);
    console.log("price: ", price);
    console.log("firstPrice ", Number(firstPrice));

    let pricefinal;
    if (!price) {
      pricefinal = firstPrice;
    } else {
      pricefinal = price;
    }
    try {
      const totalPrice = amountNFT * Number(firstPrice / 10 ** 18);
      
      console.log(totalPrice);
      const SSGeneratePrice = ethers.utils.parseEther(String(totalPrice));
      const tx = await nftcontractSigner.mintToken(collectionID, tokenID, amountNFT, {
        value: SSGeneratePrice,
      });
      const receipt = await tx.wait();
      const event = receipt.events?.find((event: { event: string; }) => { 
        return event.event === 'onMintToken';
      }); 
   
      const [success] = event?.args;
      console.log(success);
      if (success) {
       //showToastMessage();
      }


      setIsInProgres(false);
    } catch(e: any) {
      setIsInProgres(false);
      console.log("error", e);
    }
  }

  useEffect(() => {
    if (!provider) return;
  }, [provider]);

  return (
    <section>
      <section className="border-4 rounded-lg border-white bg-gradient-to-br from-orange-500 to-black mt-10 w-1/2 mx-auto">
        <div className="mt-10">
          <h2 className="text-center font-bold text-7xl">
            Mint your NFT ERC1155
          </h2>
          <div className="border-2 border-white mt-8 w-1/2 mx-auto"></div>
          <form className="grid grid-cols-1 mt-10">
            <div className="mx-auto">
              <label
                htmlFor="collectionID"
                className="block mb-2 mt-2 font-bold text-2xl text-center">
                {" "}
                Collection ID{" "}
              </label>
              <input
                type="number"
                id="collectionID"
                value={collectionID}
                onChange={(e) => setCollectionID(Number(e.target.value))}
                className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-black font-bold"
                required
              />
            </div>

            <div className="mx-auto">
              <label
                htmlFor="tokenID"
                className="block mb-2 mt-2 font-bold text-2xl text-center"
              >
                {" "}
                Token ID{" "}
              </label>
              <input
                type="number"
                id="tokenID"
                value={tokenID}
                onChange={(e) => setTokenID(Number(e.target.value))}
                className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-black font-bold"
                required
              />
            </div>

            <div className="mx-auto">
              <label
                htmlFor="amountNFT"
                className="block mb-2 mt-2 font-bold text-2xl text-center"
              >
                {" "}
                Amount NFTs{" "}
              </label>
              <input
                type="number"
                id="amountNFT"
                value={amountNFT}
                onChange={(e) => setAmountNFT(Number(e.target.value))}
                className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-black font-bold"
                required
              />
            </div>

            {/* <div className="mx-auto">
                            <label htmlFor="amountWei" className="block mb-2 mt-2 font-bold text-2xl text-center"> Amount Wei </label>
                            <input
                                type="number"
                                id="amountWei"
                                value={amountWei}
                                onChange={(e) => setAmountWei(Number(e.target.value))}
                                className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-black font-bold"
                                required
                            />
                        </div> */}
            <div className="mb-20"></div>
          </form>
        </div>
      </section>

      <section className="m-0-auto flex justify-center mt-10">

        { isInProgress == true ? 
            <CircularProgress />
            :
            <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold rounded h-14 w-36 text-3xl mt-5"
            onClick={getMint}
          >
            {" "}
            MINT
          </button>
        }
      
      </section>

      <section className="flex justify-center mt-10 ">
        <img className="w-1/12 mr-2" src="../eivissa1.png" alt="" />
        <img className="w-1/12 mr-2" src="../eivissa2.png" alt="" />
        <img className="w-1/12 mr-2" src="../eivissa3.png" alt="" />
        <img className="w-1/12 mr-2" src="../eivissa1.png" alt="" />
        <img className="w-1/12 mr-2" src="../eivissa2.png" alt="" />
        <img className="w-1/12 mr-2" src="../eivissa1.png" alt="" />
        <img className="w-1/12 mr-2" src="../eivissa2.png" alt="" />
        <img className="w-1/12 mr-2" src="../eivissa3.png" alt="" />
      </section>
    </section>
  );
};

export default Mint;
