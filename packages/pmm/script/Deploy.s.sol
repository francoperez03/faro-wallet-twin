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

    struct P {
        uint256 k;
        uint256 feeBps;
        uint256 maxAge;
        uint256 maxConfBps;
        uint256 maxTrade;
        uint256 seed;
        address owner;
    }

    function run() external {
        uint256 pk = vm.envUint("OPS_PRIVATE_KEY");
        P memory p = P({
            k: vm.envOr("K", uint256(0.05e18)),
            feeBps: vm.envOr("FEE_BPS", uint256(40)),
            maxAge: vm.envOr("MAX_AGE", uint256(60)),
            maxConfBps: vm.envOr("MAX_CONF_BPS", uint256(50)),
            maxTrade: vm.envOr("MAX_TRADE_QUOTE", uint256(2_500e18)),
            seed: vm.envOr("SEED_MEXT", uint256(0)),
            owner: vm.addr(pk)
        });
        address owner = p.owner;

        vm.startBroadcast(pk);
        FaroPMM pmm = _deployPmm(p);
        FaroRouter router = new FaroRouter(CURVE, payable(address(pmm)));
        if (p.seed > 0) {
            IERC20(MEXT).approve(address(pmm), p.seed);
            pmm.deposit(p.seed, 0, true);
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

    function _deployPmm(P memory p) internal returns (FaroPMM) {
        return new FaroPMM(MEXT, USDT0, 6, PYTH, FEED, p.k, p.feeBps, p.maxAge, p.maxConfBps, p.maxTrade, p.owner);
    }
}
