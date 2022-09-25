//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

library DataTypes {
    struct Profile {
        string lensProfile;
        EnumerableSet.UintSet ongoingProject;
        EnumerableSet.UintSet finishedProject;
        mapping(uint256 => string[]) reviewRecords;
    }

    struct Project {
        uint256 startTime;
        uint256 endTime;
        string projectName;
        string githubRepository;
        string projectImageLink;
        string projectDescription;
        EnumerableSet.UintSet reviewRecords;
    }
}