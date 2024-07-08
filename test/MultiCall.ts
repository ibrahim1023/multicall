import { expect } from "chai";
import hre from "hardhat";

import { MultiCall, TestMultiCall } from "../typechain-types";

describe("MultiCall", function () {
  let multiCall: MultiCall;
  let testMultiCallOne: TestMultiCall;
  let testMultiCallTwo: TestMultiCall;

  before(async function () {
    const MultiCall = await hre.ethers.getContractFactory("MultiCall");
    const TestMultiCall = await hre.ethers.getContractFactory("TestMultiCall");

    multiCall = await MultiCall.deploy();
    testMultiCallOne = await TestMultiCall.deploy();
    testMultiCallTwo = await TestMultiCall.deploy();
  });

  it("Should fetch data and call", async function () {
    let data = [
      await testMultiCallOne.getData(3),
      await testMultiCallTwo.getData(6),
    ];

    let targets = [testMultiCallOne.target, testMultiCallTwo.target];

    let result = await multiCall.multiCall(targets, data);

    await expect(parseInt(result[0].toString())).to.be.equal(3);
    await expect(parseInt(result[1].toString())).to.be.equal(6);
  });
});
