//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

library DataTypes {
    struct Profile {
        string lensProfile;
        EnumerableSet.UintSet ongoingProject;
        EnumerableSet.UintSet finishedProject;
    }

    struct Project {
        uint256 startTime;
        uint256 endTime;
        string projectName;
        string GithubRepository;
        string ProjectImageLink;
        string ProjectDescription;
    }
}