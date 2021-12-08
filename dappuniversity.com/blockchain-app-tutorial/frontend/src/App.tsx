import React, { useEffect, useState, VFC } from "react";
import { ethers } from "ethers";

export const App: VFC = () => {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner();

  const [addresses, setAddresses] = useState<string[]>([]);

  useEffect(() => {
    const getAddresses = async () => {
      const addresses = await provider.listAccounts();
      setAddresses(addresses);
    }
    getAddresses();
  }, [])

  return (
    <div>
      <h1>Hello world!</h1>
      <ul>
        {addresses.map((addr, index) => <ol key={index}>{addr}</ol>)}
      </ul>
    </div>
  );
}
