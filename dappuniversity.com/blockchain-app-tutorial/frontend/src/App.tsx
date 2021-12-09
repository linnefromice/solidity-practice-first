import React, { useEffect, useState, VFC } from "react";
import { ethers } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // update every time We deploy contract / copy from log (`npx hardhat run (file for deployment)`)
const abi = [ // update every time We deploy contract / copy from typechain/factories/TodoList__factory.ts
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_content",
        type: "string",
      },
    ],
    name: "createTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "taskCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tasks",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "content",
        type: "string",
      },
      {
        internalType: "bool",
        name: "completed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const App: VFC = () => {
  const provider = new ethers.providers.JsonRpcProvider();
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const { taskCount, tasks } = contract.functions;

  const [addresses, setAddresses] = useState<string[]>([]);
  const [taskCountValue, setTaskCountValue] = useState<string>("");
  const [tasksValue, setTasksValue] = useState<string[]>([]); // TODO: modify `string` type, use type

  useEffect(() => {
    const getAddresses = async () => {
      const addresses = await provider.listAccounts();
      setAddresses(addresses);
    }
    const getTaskCount = async () => {
      const _taskCount = await taskCount();
      setTaskCountValue(_taskCount);
    }
    const getTasks = async () => {
      // get taskCount
      const _taskCount = await taskCount();
      setTaskCountValue(_taskCount);
      // get Tasks
      const _tasks = []
      for (let i = 1; i <= _taskCount; i++) {
        const _task = await tasks(1);
        _tasks.push(_task.toString())
      }
      setTasksValue(_tasks);
    }
    getAddresses();
    getTasks()
  }, [])

  return (
    <div>
      <h1>Hello world!</h1>
      <ul>
        {addresses.map((addr, index) => <ol key={`address.${index}`}>{addr}</ol>)}
      </ul>
      <p>{`taskCount ... ${taskCountValue}`}</p>
      <ul>
        {tasksValue.map((task, index) => <ol key={`task.${index}`}>{task}</ol>)}
      </ul>
    </div>
  );
}
