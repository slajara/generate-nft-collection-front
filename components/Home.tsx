import { useState, useEffect } from "react";
import { useWeb3Store } from "@/stores/web3Store";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import constants from "../constants/constants.json";

const Home = () => {
  const { provider } = useWeb3Store();
  const router = useRouter();

  const nftcontractSigner = new ethers.Contract(
    constants.address,
    constants.abi,
    provider?.getSigner()
  );

  const nftcontract = nftcontractSigner.connect(nftcontractSigner.provider);

  useEffect(() => {
    if (!provider) return;
  }, [provider]);

  return (
    <section className="justify-center">
      <div className="">
        <img
          className="w-1/2 mx-auto mb-10"
          src="../SSGenerate-logo.png"
          alt="logo ss generate"
        />
      </div>
      <section className="justify-center grid grid-cols-1">
        <div>
          <h2 className="text-center font-bold text-7xl"> ERC1155</h2>

          <section className="col-span-1 border-4 rounded-lg border-white bg-gradient-to-br from-orange-500 to-black mt-10 w-1/2 mx-auto">
            <div className="mt-20 ">
              <h2 className="text-center pb-2 text-5xl font-bold my-2                                                                                               ">
                CREATE A NEW COLLECTION
              </h2>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold rounded h-12 w-24 text-3xl mt-5"
                onClick={() => router.push("/user/form")}
              >
                {" "}
                GO !
              </button>
            </div>

            <div className="mt-20">
              <h2 className="text-center pb-2 text-5xl font-bold">
                {" "}
                MINT A NFT{" "}
              </h2>
            </div>
            <div className="flex justify-center mb-20 ">
              <button
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold rounded h-12 w-24 text-3xl mt-5"
                onClick={() => router.push("/user/mint")}
              >
                {" "}
                GO !
              </button>
            </div>
          </section>
        </div>

        <section className="col-span-1">
          {/* <div>
            <h2 className="text-center font-bold text-7xl"> ERC721</h2>

            <section className="col-span-1 border-4 rounded-lg border-white bg-gradient-to-br from-orange-500 to-black mt-10 w-1/2 mx-auto">
              <div className="mt-20 ">
                <h2 className="text-center pb-2 text-5xl font-bold">
                  CREATE A NEW COLLECTION
                </h2>
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold rounded h-12 w-24 text-3xl mt-5"
                  onClick={() => router.push("/user/form")}
                >
                  {" "}
                  GO !
                </button>
              </div>

              <div className="mt-20">
                <h2 className="text-center pb-2 text-5xl font-bold">
                  {" "}
                  MINT A NFT{" "}
                </h2>
              </div>
              <div className="flex justify-center mb-20 ">
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold rounded h-12 w-24 text-3xl mt-5"
                  onClick={() => router.push("/user/mint")}
                >
                  {" "}
                  GO !
                </button>
              </div>
            </section>
          </div> */}
        </section>
      </section>
    </section>
  );
};

export default Home;
