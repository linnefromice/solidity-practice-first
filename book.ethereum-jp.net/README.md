# Ethereum入門

- https://book.ethereum-jp.net/first_use/contract

## Command

```bash
brew tap ethereum/ethereum
brew install solidity
solc --version
# & write SingleNumRegister.sol
# コントラクト・コードのコンパイル
solc --abi --bin SingleNumRegister.sol 
Warning: SPDX license identifier not provided in source file. Before publishing, consider adding a comment containing "SPDX-License-Identifier: <SPDX-License>" to each source file. Use "SPDX-License-Identifier: UNLICENSED" for non-open-source code. Please see https://spdx.org for more information.
--> SingleNumRegister.sol


======= SingleNumRegister.sol:SingleNumRegister =======
Binary:
608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806360fe47b11461003b5780636d4ce63c14610057575b600080fd5b610055600480360381019061005091906100c3565b610075565b005b61005f61007f565b60405161006c91906100ff565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000602082840312156100d9576100d8610088565b5b60006100e7848285016100ae565b91505092915050565b6100f98161008d565b82525050565b600060208201905061011460008301846100f0565b9291505056fea26469706673582212202ea3e7d0301baa8508514e5b3450fb215934c41cf249bc9ed63afc30fc8dcad564736f6c634300080a0033
Contract JSON ABI
[{"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"retVal","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}]
```

```bash
geth --networkid "15" --nodiscover --datadir eth_private_net console 2>> eth_private_net/geth_err.log

> var bin = "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806360fe47b11461003b5780636d4ce63c14610057575b600080fd5b610055600480360381019061005091906100c3565b610075565b005b61005f61007f565b60405161006c91906100ff565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000602082840312156100d9576100d8610088565b5b60006100e7848285016100ae565b91505092915050565b6100f98161008d565b82525050565b600060208201905061011460008301846100f0565b9291505056fea26469706673582212202ea3e7d0301baa8508514e5b3450fb215934c41cf249bc9ed63afc30fc8dcad564736f6c634300080a0033"
undefined

> var abi = [{"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"retVal","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}]
undefined
> var contract = eth.contract(abi)

undefined

> personal.unlockAccount(eth.accounts[0])
Unlock account 0x158d577d0a0e8f9e5bb6572f249ad6cf441656a0
Passphrase: 
true
> var myContract = contract.new({ from: eth.accounts[0], data: bin })
undefined
> myContract
{
  abi: [{
      inputs: [],
      name: "get",
      outputs: [{...}],
      stateMutability: "view",
      type: "function"
  }, {
      inputs: [{...}],
      name: "set",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
  }],
  address: undefined,
  transactionHash: "0x243b2c84a3ef7f2e41a0fda84ada4575a1a2f2f09e5ba136bd9cdbab3e73d5a1"
}
```
