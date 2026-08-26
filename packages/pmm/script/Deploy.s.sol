// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console2} from "forge-std/Script.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {FaroPMM} from "../src/FaroPMM.sol";
import {FaroRouter} from "../src/FaroRouter.sol";

/// forge script script/Deploy.s.sol --rpc-url arbitrum --broadcast --verify -vvv
/// env: OPS_PRIVATE_KEY (owner + funder), SEED_MEXT (wei, opcional), K, FEE_BPS, MAX_AGE, MAX_CONF_BPS (opcionales)
contract Deploy is Script {
    address constant CURVE = 0x356D349dA9ADd7Efb56a35fAB939A2c6D852f853;
    address constant USDT0 = 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9;
    address constant MEXT = 0xb96aA6babCcD738d6644ADd4912fE5eFbEBF5a25;
    address constant PYTH = 0xff1a0f4744e8582DF1aE09D5611b887B6a12925C;
    bytes32 constant FEED = 0xe13b1c1ffb32f34e1be9545583f01ef385fde7f42ee66049d30570dc866b77ca;

    function run() external {
        uint256 pk = vm.envUint("OPS_PRIVATE_KEY");
        address owner = vm.addr(pk);
        uint256 k = vm.envOr("K", uint256(0.1e18));
        uint256 feeBps = vm.envOr("FEE_BPS", uint256(40));
        uint256 maxAge = vm.envOr("MAX_AGE", uint256(60));
        uint256 maxConfBps = vm.envOr("MAX_CONF_BPS", uint256(50));
        uint256 seed = vm.envOr("SEED_MEXT", uint256(0));

        vm.startBroadcast(pk);
        FaroPMM pmm = new FaroPMM(MEXT, USDT0, 6, PYTH, FEED, k, feeBps, maxAge, maxConfBps, owner);
        FaroRouter router = new FaroRouter(CURVE, payable(address(pmm)));
        if (seed > 0) {
            IERC20(MEXT).approve(address(pmm), seed);
            pmm.deposit(seed, 0, true);
        }
        vm.stopBroadcast();

        console2.log("FaroPMM   ", address(pmm));
        console2.log("FaroRouter", address(router));
        console2.log("owner     ", owner);
        string memory json = string.concat('{"chainId":42161,"pmm":"', vm.toString(address(pmm)), '"');
        json = string.concat(json, ',"router":"', vm.toString(address(router)), '"');
        json = string.concat(json, ',"curvePool":"', vm.toString(CURVE), '","usdt0":"', vm.toString(USDT0), '"');
        json = string.concat(json, ',"mext":"', vm.toString(MEXT), '","pyth":"', vm.toString(PYTH), '"');
        json = string.concat(json, ',"feedId":"', vm.toString(FEED), '","owner":"', vm.toString(owner), '"}\n');
        vm.writeFile("deployments/arbitrum.json", json);
    }
}
