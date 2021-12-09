import { expect } from "chai";
import { ethers } from "hardhat";

describe("TodoList", () => {
  it("Should has one task in task list provided by constructor", async () => {
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
    await todoList.deployed();

    expect(await todoList.taskCount()).to.equal(1);
  });

  it("Should emit event named TaskCreated by function createTask", async () => {
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
    await todoList.deployed();

    await expect(todoList.createTask("Test Task"))
      .to.emit(todoList, "TaskCreated")
      .withArgs(2, "Test Task", false);
  });
});