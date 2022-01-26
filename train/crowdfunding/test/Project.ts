import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

const deployFactory = async () => {
  const [owner] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("ProjectFactory", owner);
  const contract = await factory.deploy();
  await contract.deployed();

  return {
    contract: contract,
    owner: owner,
  };
}

describe("ProjectFactory", () => {
  it.skip(".createProject", async () => {
    const { contract: c, owner } = await deployFactory();
    expect(await c.projectAddresses.length).to.equal(0);
    const _totalAmount = ethers.utils.parseEther("0.1")
    await c.createProject(owner.address, _totalAmount)
    // TODO
    // - expect(await c.projectAddresses.length).to.equal(1); <- fail
    // - confirm deployed contract status
  })
})

const deploy = async (goalTotalAmount: BigNumber) => {
  const [owner, ...addrs] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("Project", owner);
  const contract = await factory.deploy(owner.address, goalTotalAmount);
  await contract.deployed();

  return {
    contract: contract,
    owner: owner,
    addrs: addrs
  };
}

describe("Project", () => {
  it(".constructor", async () => {
    const totalAmount = ethers.utils.parseEther("0.1")
    const { contract: c, owner } = await deploy(BigNumber.from(totalAmount));
    expect(await c.owner()).to.equal(owner.address);
    expect(await c.currentTotalAmount()).to.equal(0);
    expect(await c.goalTotalAmount()).to.equal(BigNumber.from(totalAmount));
    expect(await c.isClosed()).to.equal(false);
  })

  describe(".contribute", () => {
    describe("result", () => {
      describe("success", () => {
        const _goalAmount = ethers.utils.parseEther("0.1")
        it("& finish project because goal reached", async () => {
          const { contract, owner } = await deploy(BigNumber.from(_goalAmount));
  
          await contract.connect(owner).contribute({ value: _goalAmount })
          const currentTotalAmount = await contract.currentTotalAmount()
          expect(currentTotalAmount).to.equal(_goalAmount.toString());
          expect(await contract.isClosed()).to.equal(true);
        });
        it("& continue project because goal not reached", async () => {
          const { contract, owner } = await deploy(BigNumber.from(_goalAmount));
          const _valueContributed = _goalAmount.div(BigNumber.from("10"))
  
          await contract.connect(owner).contribute({ value: _valueContributed })
          const currentTotalAmount = await contract.currentTotalAmount()
          expect(currentTotalAmount).to.equal(_valueContributed.toString());
          expect(await contract.isClosed()).to.equal(false);
        });
      });
      describe("failure", () => {
        it("Should fail when insufficient donation amount", async () => {
          const { contract, owner } = await deploy(BigNumber.from("1"));

          const insufficientAmount = ethers.utils.parseEther("0.00999")
          await expect(
            contract.connect(owner).contribute({ value: BigNumber.from(insufficientAmount) })
          ).to.be.revertedWith("Need over 0.01 ETH for contribution.")
        });
        it("Should fail when project closed", async () => {
          const _amount = ethers.utils.parseEther("0.00999");
          const { contract, owner } = await deploy(BigNumber.from(_amount));
          await contract.connect(owner).close();
          await expect(
            contract.connect(owner).contribute({ value: BigNumber.from(_amount) })
          ).to.be.revertedWith("This project is already closed.")
        })
      });
    });
    describe("process", () => {
      const _goalAmount = ethers.utils.parseEther("0.1")
      describe("confirm people who can donate", () => {
        it("enable multi donation by one address", async () => {
          const { contract, owner } = await deploy(BigNumber.from(_goalAmount));
          const _valueContributed = _goalAmount.div(BigNumber.from("10"))
          await contract.connect(owner).contribute({ value: _valueContributed })
          await contract.connect(owner).contribute({ value: _valueContributed })
          await contract.connect(owner).contribute({ value: _valueContributed })
          const currentTotalAmount = await contract.currentTotalAmount()
          expect(currentTotalAmount).to.equal(_valueContributed.mul(BigNumber.from("3")).toString());
        })
        it("enable donation by owner & others", async () => {
          const { contract, owner, addrs } = await deploy(BigNumber.from(_goalAmount));
          const _valueContributed = _goalAmount.div(BigNumber.from("10"))
          await contract.connect(owner).contribute({ value: _valueContributed })
          await contract.connect(addrs[0]).contribute({ value: _valueContributed })
          await contract.connect(addrs[0]).contribute({ value: _valueContributed })
          await contract.connect(addrs[1]).contribute({ value: _valueContributed })
          await contract.connect(addrs[0]).contribute({ value: _valueContributed })
          const currentTotalAmount = await contract.currentTotalAmount()
          expect(currentTotalAmount).to.equal(_valueContributed.mul(BigNumber.from("5")).toString());
        })
      });
      it("possible to over goal amount by last donation", async () => {
        const { contract, owner } = await deploy(BigNumber.from(_goalAmount));
        const _valueContributed = _goalAmount.div(BigNumber.from("10"))
        await contract.connect(owner).contribute({ value: _valueContributed })
        await contract.connect(owner).contribute({ value: _valueContributed })
        await contract.connect(owner).contribute({ value: _goalAmount })
        const currentTotalAmount = await contract.currentTotalAmount()
        expect(currentTotalAmount).to.equal(_valueContributed.mul(BigNumber.from("12")).toString());
        expect(await contract.isClosed()).to.equal(true);
      })
    });
  });

  describe(".close", () => {
    describe("success", () => {
      it.skip("update status to closed", () => {})
      it.skip("refund to all users", () => {})
    });
    describe("failure", () => {
      const _goalAmount = ethers.utils.parseEther("0.1")
      it("Should fail when called by not owner", async () => {
        const { contract, addrs } = await deploy(BigNumber.from(_goalAmount));
        await expect(
          contract.connect(addrs[0]).close()
        ).to.be.revertedWith("Only owner can call this.")
      })
      it("Should fail when closed project", async () => {
        const { contract, owner } = await deploy(BigNumber.from(_goalAmount));
        await contract.connect(owner).contribute({ value: _goalAmount })
        await expect(
          contract.connect(owner).close()
        ).to.be.revertedWith("This project is already closed.")

      })
    });
  });

  describe(".refund", () => {
    describe("success", () => {
      it.skip("TODO", () => {})
    });
    describe("failure", () => {
      const _goalAmount = ethers.utils.parseEther("0.1")
      it("Should fail when active project", async () => {
        const { contract, owner } = await deploy(BigNumber.from(_goalAmount));
        await expect(
          contract.connect(owner).refund()
        ).to.be.revertedWith("This project is active.")
      })
      it.skip("Should fail when active project (reason is time)", () => {})
      it("Should fail when success project", async () => {
        const { contract, owner } = await deploy(BigNumber.from(_goalAmount));
        await contract.connect(owner).contribute({ value: _goalAmount })
        await expect(
          contract.connect(owner).refund()
        ).to.be.revertedWith("This project was successful.")
      })
    });
  });

  describe(".withdraw", () => {
    describe("success", () => {
      it.skip("TODO", () => {})
    });
    describe("failure", () => {
      const _goalAmount = ethers.utils.parseEther("0.1")
      it("Should fail when called by not owner", async () => {
        const { contract, addrs } = await deploy(BigNumber.from(_goalAmount));
        await expect(
          contract.connect(addrs[0]).withdraw()
        ).to.be.revertedWith("Only owner can call this.")
      })
      it("Should fail when active project", async () => {
        const { contract, owner } = await deploy(BigNumber.from(_goalAmount));
        await expect(
          contract.connect(owner).withdraw()
        ).to.be.revertedWith("This project is active.")
      })
      it.skip("Should fail when active project (reason is time)", () => {})
    });
  });
})