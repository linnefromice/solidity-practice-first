import React, { useEffect, useState, VFC } from "react";
import { ethers } from "ethers";

/** Contract's address */
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // update every time We deploy contract / copy from log (`npx hardhat run (file for deployment)`)
/** Contract's abi */
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

/**
 * use Smart Contract
 * @returns
 */
const useContract = () => {
  const provider = new ethers.providers.JsonRpcProvider();
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const { taskCount, tasks } = contract.functions;

  const [addresses, setAddresses] = useState<string[]>([]);
  const [taskCountValue, setTaskCountValue] = useState<string>("");
  const [tasksValue, setTasksValue] = useState<string[]>([]); // TODO: modify `string` type, use type
  const [taskContent, setTaskContent] = useState<string>("");

  useEffect(() => {
    const getAddresses = async () => {
      const addresses = await provider.listAccounts();
      setAddresses(addresses);
    }
    const getTasks = async () => {
      // get taskCount
      const _taskCount = await taskCount();
      setTaskCountValue(_taskCount);
      // get Tasks
      const _tasks = []
      for (let i = 1; i <= _taskCount; i++) {
        const _task = await tasks(i);
        _tasks.push(_task.toString())
      }
      setTasksValue(_tasks);
    }
    getAddresses();
    getTasks()
  }, [])

  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);
  const updateTaskContent = (e: React.ChangeEvent<HTMLInputElement>) => setTaskContent(e.target.value);
  const handleCreateTask = async () => {
    if (taskContent === "") return;
    await contractWithSigner.functions.createTask(taskContent);
  };

  return {
    addresses,
    taskCountValue,
    tasksValue,
    updateTaskContent,
    handleCreateTask
  }
}

/**
 * Main Component
 * @returns 
 */
export const App: VFC = () => {
  const {
    addresses,
    taskCountValue,
    tasksValue,
    updateTaskContent,
    handleCreateTask
  } = useContract();

  const onClick = async () => {
    await handleCreateTask();
    window.location.reload();
  }

  return (
    <div>
      <h1>Hello world!</h1>
      <ul>
        {addresses.map((addr, index) => <ol key={`address.${index}`}>{addr}</ol>)}
      </ul>
      <p>
        <input onChange={updateTaskContent} />
        <button onClick={onClick}>Create Task</button>
      </p>
      <p>{`taskCount ... ${taskCountValue}`}</p>
      <ul>
        {tasksValue.map((task, index) => <ol key={`task.${index}`}>{task}</ol>)}
      </ul>
    </div>
  );
}
