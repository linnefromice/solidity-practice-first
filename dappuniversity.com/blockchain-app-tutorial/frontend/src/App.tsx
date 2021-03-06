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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "completed",
        type: "bool",
      },
    ],
    name: "TaskCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "content",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "completed",
        type: "bool",
      },
    ],
    name: "TaskCreated",
    type: "event",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "toggleCompleted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

type Task = {
  id: string,
  content: string,
  completed: boolean
}

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
  const [tasksValue, setTasksValue] = useState<Task[]>([]);
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
        _tasks.push({
          ..._task,
          id: i
          // id: _task.id._hex // note: id's type is BigNumber { _hex: string, _isBigNumber: boolean }
        })
      }
      setTasksValue(_tasks);
    }
    getAddresses();
    getTasks()
  }, [])

  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);
  const updateTaskContent = (e: React.ChangeEvent<HTMLInputElement>) => setTaskContent(e.target.value);
  const requestCreateTask = async () => {
    if (taskContent === "") return;
    await contractWithSigner.functions.createTask(taskContent);
  };
  const requestToggleCompleted = async (id: string) => {
    for (const _task of tasksValue) {
      if (id === _task.id) {
        await contractWithSigner.functions.toggleCompleted(id)
      }
    }
  }

  return {
    addresses,
    taskCountValue,
    tasksValue,
    updateTaskContent,
    requestCreateTask,
    requestToggleCompleted
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
    requestCreateTask,
    requestToggleCompleted
  } = useContract();

  const handleCreateTask = async () => {
    await requestCreateTask();
    window.location.reload();
  }

  const handleToggleCompleted = async (id: string) => {
    await requestToggleCompleted(id);
    window.location.reload();
  }

  return (
    <div>
      <h1>Hello world!</h1>
      <p>Addresses</p>
      <ul>
        {addresses.map((addr, index) => <li key={`address.${index}`}>{addr}</li>)}
      </ul>
      <p>
        <p>Operate Contract</p>
        <input onChange={updateTaskContent} />
        <button onClick={handleCreateTask}>Create Task</button>
      </p>
      <p>Tasks</p>
      <p>{`taskCount ... ${taskCountValue}`}</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Content</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasksValue.map((t, index) => <tr key={`task.${index}`}>
            <td>{t.id}</td>
            <td>{t.content}</td>
            <td>{t.completed ? "Completed" : "Not Completed"}</td>
            <td><button onClick={() => handleToggleCompleted(t.id)}>Change</button></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  );
}
