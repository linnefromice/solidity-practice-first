import React, { useEffect, useState, VFC } from "react";
import { ethers } from "ethers";

export const App: VFC = () => {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner();

  const [address, setAddress] = useState("No contract...")

  useEffect(() => {
    const getAddress = async () => {
      const address = await signer.getAddress()
      setAddress(address);
    }
    getAddress();
  }, [])

  return (
    <div>
      <h1>Hello world!</h1>
      <p>{address}</p>
    </div>
  );
}
