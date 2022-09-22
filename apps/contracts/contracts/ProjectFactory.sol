//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import {DataTypes} from "./libraries/DataTypes.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@semaphore-protocol/contracts/interfaces/IVerifier.sol";
import "@semaphore-protocol/contracts/base/SemaphoreCore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";

error InvalidTreeDepth();
error InvalidTime();

contract ProjectFactory is SemaphoreCore, SemaphoreGroups {
    
    using EnumerableSet for EnumerableSet.UintSet;

    address internal constant verifier = address(0);
    uint8 internal constant MAX_DEPTH = 32;

    uint256 internal _projectCount;
    mapping(uint256 => DataTypes.Profile) internal profileInfo;
    mapping(uint256 => DataTypes.Project) internal projectInfo;

    constructor() 
    {

    }

    modifier onlySupportedDepth(uint8 depth) 
    {
        if(depth > MAX_DEPTH) {
            revert InvalidTreeDepth();
        }
        _;
    }

    function createProject(
        uint8 depth,
        uint256 zeroValue,
        uint256 identityCommitment
    ) 
        external
        onlySupportedDepth(depth)
    {
        _createGroup(_projectCount, depth, zeroValue);
        _addMember(_projectCount, identityCommitment);
        DataTypes.Project storage newProject = projectInfo[_projectCount];
        newProject.startTime = block.timestamp;
        projectInfo[_projectCount].members.add(identityCommitment);
        profileInfo[identityCommitment].ongoingProject.add(_projectCount);
        _projectCount++;
    }

    function addMember(
        uint256 groupId, 
        uint256 identityCommitment
    ) 
        external
    {
        _addMember(groupId, identityCommitment);
        profileInfo[identityCommitment].ongoingProject.add(groupId);
        projectInfo[_projectCount].members.add(identityCommitment);
    }

    function removeMember(
        uint256 groupId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) 
        external
    {
        _removeMember(groupId, identityCommitment, proofSiblings, proofPathIndices);
        profileInfo[identityCommitment].ongoingProject.remove(groupId);
        projectInfo[_projectCount].members.remove(identityCommitment);
    }

    function endProject(uint256 groupId) 
        external
    {
        projectInfo[groupId].endTime = block.timestamp;
    }

    function editProjectInfo(
        uint256 groupId,
        string calldata projectName,
        string calldata githubRepository,
        string calldata projectImageLink,
        string calldata projectDescription
    )
        external
    {
        if (projectInfo[groupId].endTime < block.timestamp && 
            projectInfo[groupId].endTime == 0) {
            revert InvalidTime();
        }
        projectInfo[groupId].projectName = projectName;
        projectInfo[groupId].githubRepository = githubRepository;
        projectInfo[groupId].projectImageLink = projectImageLink;
        projectInfo[groupId].projectDescription = projectDescription;
    }

    function getProjectCount()
        external
        view
        returns(uint256 projectCount)
    {
        return _projectCount;
    }

    function getOngoingProjectsByIDCommitment(uint256 idCommitment)
        external
        view
        returns(uint256[] memory projectList)
    {
        EnumerableSet.UintSet storage projectSet = profileInfo[idCommitment].ongoingProject;
        uint256[] memory projectIds = new uint256[] (projectSet.length());

        for (uint256 i; i < projectSet.length(); i++) {
            projectIds[i] = projectSet.at(i);
        }

        return projectIds;
    }

    function getLeafByIDCommitment(uint256 idCommitment) 
        external
        view
        returns(uint256[] memory projectList)
    {
        EnumerableSet.UintSet storage projectSet = profileInfo[idCommitment].finishedProject;
        uint256[] memory projectIds = new uint256[] (projectSet.length());

        for (uint256 i; i < projectSet.length(); i++) {
            projectIds[i] = projectSet.at(i);
        }

        return projectIds;
    }

    function submitReviews(
        uint256 groupId,
        uint256 fromIdCommitment,
        uint256 toIdCommitment,
        string calldata reviewContent,
        uint256[8] calldata proof
    ) 
        external
    {
        uint256 merkleTreeRoot = getMerkleTreeRoot(groupId);
        uint256 nullifierHash = uint256(keccak256(abi.encodePacked(fromIdCommitment, toIdCommitment)));
        bytes32 signal = keccak256(abi.encodePacked(reviewContent));
        _verifyProof(signal, merkleTreeRoot, nullifierHash, groupId, proof, IVerifier(verifier));
        projectInfo[groupId].reviewRecords.add(nullifierHash);
    }

    function claimReviews() 
        external
    {

    }

    function setLensConnect(
        uint256 idCommitment,
        string calldata lensProfile
    )
        external
    {
        profileInfo[idCommitment].lensProfile = lensProfile;
    }

    function getLensConnect(uint256 idCommitment)
        external
        view
        returns(string memory _lensProfile)
    {
        return profileInfo[idCommitment].lensProfile;
    }
}