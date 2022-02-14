import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

const initialAccounts = async () => {
  const [owner, ...addrs] = await ethers.getSigners();
  return {
    owner,
    addrs
  }
}

const deployToken = async (owner: SignerWithAddress) => {
  const factory = await ethers.getContractFactory("IcoToken", owner);
  const token = await factory.deploy();
  await token.deployed();
  return token
}

describe("IcoToken", () => {
  const amount = ethers.utils.parseEther("0.01");
  it("owner can mint", async () => {
    const { owner } = await initialAccounts();
    const token = await deployToken(owner);
    await expect(token.connect(owner).mint(owner.address, amount))
      .to.emit(token, "Transfer")
      .withArgs("0x0000000000000000000000000000000000000000", owner.address, amount);
  });
  it("not owner cannot mint", async () => {
    const { owner, addrs } = await initialAccounts();
    const token = await deployToken(owner);
    await expect(token.connect(addrs[0]).mint(addrs[0].address, amount))
      .to.be.revertedWith("Ownable: caller is not the owner")
  });
});
