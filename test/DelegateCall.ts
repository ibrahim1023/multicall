import { expect } from "chai";
import hre from "hardhat";
import { ethers } from "ethers";

import { A, B } from "../typechain-types";

describe("MultiCall", function () {
  let contractA: A;
  let contractB: B;
  let sender: any;

  before(async function () {
    [sender] = await hre.ethers.getSigners();

    const A = await hre.ethers.getContractFactory("A");
    const B = await hre.ethers.getContractFactory("B");

    contractB = await B.deploy();
    contractA = await A.deploy();
  });

  it("Should update Contract A's storage", async function () {
    let amount = ethers.parseEther("5");
    await contractA.setVars(contractB.target, 5, {
      value: amount,
    });

    await expect(await contractA.num()).to.be.equal(5);
    await expect(await contractA.sender()).to.be.equal(sender.address);
    await expect(await contractA.value()).to.be.equal(amount);

    // contract B's storage still unchanged
    await expect(await contractB.num()).to.be.equal(0);
    await expect(await contractB.sender()).to.be.equal(
      "0x0000000000000000000000000000000000000000"
    );
    await expect(await contractB.value()).to.be.equal(0);
  });
});
