import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

const deploy = async (goalTotalAmount: BigNumber) => {
  const [owner, ...addrs] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("Project", owner);
  const contract = await factory.deploy(goalTotalAmount);
  await contract.deployed();

  return {
    contract: contract,
    owner: owner,
    addrs: addrs
  };
}

describe("Project", async () => {
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
        it.skip("Should fail when project closed", () => {})
      });
    });
    describe("process", () => {
      describe("confirm people who can donate", () => {
        it.skip("enable multi donation by one address", () => {})
        it.skip("enable donation by owner & others", () => {})  
      });
      it.skip("possible to over goal amount by last donation", () => {})
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
    describe("success", () => {});
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
    describe("success", () => {});
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