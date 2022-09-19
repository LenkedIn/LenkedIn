//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

interface IProjectInfo {
    struct Project {
        uint256 startTime;
        uint256 endTime;
        string projectName;
        string GithubRepository;
        string ProjectImageLink;
        string ProjectDescription;
    }
}