import { useState, useEffect} from 'react';
import ReactDOM from "react-dom";
import { useWeb3Store } from "@/stores/web3Store";
import { ethers } from "ethers";
import constants from "../constants/constants.json";
import CircularProgress from '@mui/material/CircularProgress';

const Form = () => {

  const { provider, errorMessage } = useWeb3Store();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [metadata, setMetadata] = useState('');
  const [supply, setSupply] = useState(0);
  const [mintPrice, setMintPrice] = useState<number[]>([]);
  const [supplyToken, setSupplyToken] = useState<number[]>([]);
  const [showSupplyToken, setShowSupplyToken] = useState(false);
  const [isInProgress, setIsInProgres] = useState<boolean>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const mintPriceConverted: any[] = [];

  const [successMessage, setSuccessMessage] = useState<string>("")

  const percentage = 66;

  const nftcontractSigner = new ethers.Contract(
    constants.address, 
    constants.abi, 
    provider?.getSigner()
  );

  const nftcontract = nftcontractSigner.connect(nftcontractSigner.provider);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createSmartContract();
  };

  const handleSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSupply = Number(e.target.value);
    setSupply(newSupply);
    setSupplyToken(Array.from({ length: newSupply }, () => 0));
    setMintPrice(Array.from({ length: newSupply }, () => 0));
  };

  async function createSmartContract() {
    if (!provider) return;
    if(!nftcontractSigner) return;
    setIsInProgres(true);

    console.log("Creando Smart Contract...");
    console.log("Name: ", name);
    console.log("Symbol: ", symbol);
    console.log("Metadata: ", metadata);
    console.log("Supply: ", supply);
    console.log("SupplyToken: ", supplyToken);
    console.log("MintPrice: ", mintPrice);

    try {

      mintPrice.forEach((element, index) => {
        mintPriceConverted.push(ethers.utils.parseEther(String(element)));
      });

      const SSGeneratePrice = ethers.utils.parseEther(String(0.01));
      const address = await  nftcontractSigner.createCollectionToken(name, symbol, metadata, supply, supplyToken, mintPriceConverted,  {value: SSGeneratePrice});
      const receipt = await address.wait();
      
      const event = receipt.events?.find((event: { event: string; }) => { 
        return event.event === 'OnCollectionCreated';
      }); 
   
      const [addressFromContractCreated, currentCollectionAmount] = event?.args;
      console.log(addressFromContractCreated);
      
      if (errorMsg.length != 0) setErrorMsg("")
      setSuccessMessage("Collection created successfully!!");
      setIsInProgres(false);
    } catch(e: any) {
      console.log(e);
      if (successMessage.length != 0) setSuccessMessage("");
      if(e?.code ==="ACTION_REJECTED") {
        setErrorMsg("User has rejected the transaction");
      } else {
        setErrorMsg("Error f*** u ni***");
      }
      setIsInProgres(false);
    }
  };

  useEffect(() => {
    if(!provider)return;
  }, [provider, isInProgress]);

  return (
    <div className="flex justify-center my-8">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-4 gap-4 p-6 rounded-lg shadow-md mx-auto"
      >
        <h2 className="text-center text-2xl font-bold mb-4 col-span-4">
          Complete the form
        </h2>
        <div className="col-span-3 sm:col-span-1">
          <label htmlFor="name" className="block mb-2 text-orange-500">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-orange-500  text-black font-bold"
            required
          />
        </div>

        <div className="col-span-3 sm:col-span-1">
          <label htmlFor="symbol" className="block mb-2 text-orange-500">
            Symbol:
          </label>
          <input
            type="text"
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-orange-500  text-black font-bold"
            required
          />
        </div>

        <div className="col-span-3 sm:col-span-1">
          <label htmlFor="metadata" className="block mb-2 text-orange-500">
            Metadata:
          </label>
          <input
            type="text"
            id="metadata"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-orange-500  text-black font-bold"
            required
          />
        </div>

        <div className="col-span-3 sm:col-span-1">
          <label htmlFor="supply" className="block mb-2 text-orange-500">
            Supply:
          </label>
          <input
            type="number"
            id="supply"
            value={supply}
            onChange={handleSupplyChange}
            // onChange={(e) => setSupply(Number(e.target.value))}
            className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-orange-500  text-black font-bold"
            required
          />
        </div>

        <div>
          {supplyToken.map((value, index) => (
            <div className="form-group" key={index}>
              <label
                htmlFor={`supplyToken-${index}`}
                className="block mb-2 text-orange-500"
              >
                Supply Token {index + 1}:{" "}
              </label>
              <input
                type="number"
                id={`supplyToken-${index}`}
                value={value}
                className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-orange-500 mb-2  text-black font-bold"
                required
                onChange={(e) => {
                  const value = !Number.isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : null;
                  console.log(value);
                  const supply: any = value;

                  const newSupplyToken = [...supplyToken];
                  newSupplyToken[index] = Number(supply);
                  setSupplyToken(newSupplyToken);
                }}
              />
            </div>
          ))}
        </div>

        <div>
          {mintPrice.map((value, index) => (
            <div className="form-group" key={index}>
              <label
                htmlFor={`mintPrice-${index}`}
                className="block mb-2 text-orange-500"
              >
                Mint Price {index + 1}:{" "}
              </label>

              <input
                type="number"
                id={`mintPrice-${index}`}
                value={value}
                className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-orange-500 mb-2  text-black font-bold"
                required
                onChange={(e) => {

                  const value = !Number.isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : null;
                  console.log(value);
                  const amount: any = value;

                  const newmintPrice = [...mintPrice];
                  newmintPrice[index] = Number(amount);
                  setMintPrice(newmintPrice);
                }}
              />
            </div>
          ))}
        </div>
        <div className="col-span-4">
          <div className="flex justify-center mt-10">
            {isInProgress == true ? (
              <CircularProgress />
            ) : (
              <div>
                <h2 className="text-center pb-2 text-2xl text-red-500">
                  {errorMsg}
                </h2>
                <h2 className="text-center pb-2 text-2xl text-green-500">
                  {successMessage}
                </h2>
                <button
                  type="submit"
                  className="col-span-4 sm:col-span-2 rounded-lg bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 my-4 mx-auto block w-full sm:w-auto"
                >
                  CREATE {" "}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;

