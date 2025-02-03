// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const IPFSFileTrackerModule = buildModule("IPFSFileTracker", (m) => {
  const IPFSFileTracker = m.contract("IPFSFileTracker");
  return { IPFSFileTracker };
});

export default IPFSFileTrackerModule;
