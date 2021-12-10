import { expect } from "chai";
import { ethers } from "hardhat";

describe("TodoList", () => {
  it("Should has three tasks in task list provided by constructor", async () => {
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
    await todoList.deployed();

    expect(await todoList.taskCount()).to.equal(3);
  });

  describe("function createTask", async () => {
    it("emit event named `TaskCreated`", async () => {
      const TodoList = await ethers.getContractFactory("TodoList");
      const todoList = await TodoList.deploy();
      await todoList.deployed();

      await expect(todoList.createTask("Test Task"))
      .to.emit(todoList, "TaskCreated")
      .withArgs(4, "Test Task", false);
    });
    it("create task", async () => {
      const TodoList = await ethers.getContractFactory("TodoList");
      const todoList = await TodoList.deploy();
      await todoList.deployed();

      await todoList.createTask("first task");
      expect((await todoList.tasks(4)).content).to.equal("first task");
      await todoList.createTask("second task");
      expect((await todoList.tasks(5)).content).to.equal("second task");
    })
  })

  describe("toggles task completion", async () => {
    it("emit event named `TaskCompleted`", async () => {
      const TodoList = await ethers.getContractFactory("TodoList");
      const todoList = await TodoList.deploy();
      await todoList.deployed();
        await expect(todoList.toggleCompleted(1))
        .to.emit(todoList, "TaskCompleted")
        .withArgs(1, true);
    });
    it("complete task", async () => {
      const TodoList = await ethers.getContractFactory("TodoList");
      const todoList = await TodoList.deploy();
      await todoList.deployed();

      await todoList.toggleCompleted(1);
      expect((await todoList.tasks(1)).completed).to.equal(true);

      await todoList.toggleCompleted(1);
      expect((await todoList.tasks(1)).completed).to.equal(false);
    })
  })
});