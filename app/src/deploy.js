import { ethers } from "ethers";
import Escrow from "./artifacts/contracts/Escrow.sol/Escrow";

async function deploy(signer, arbiter, beneficiary, value) {
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );
  let contract = await factory.deploy(arbiter, beneficiary, { value });
  await contract.deployed();
  return contract;
}

async function connectToContract(address, signer) {
  let instance = new ethers.Contract(address, Escrow.abi, signer);
  return instance;
}

export { deploy, connectToContract };
