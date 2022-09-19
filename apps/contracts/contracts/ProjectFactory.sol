//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "./libraries/DataTypes.sol";

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@semaphore-protocol/contracts/interfaces/IVerifier.sol";
import "@semaphore-protocol/contracts/base/SemaphoreCore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";

error InvalidTreeDepth();

contract ProjectFactory is SemaphoreCore, SemaphoreGroups {
    
    uint8 internal constant MAX_DEPTH = 32;

    uint256 internal _projectCount;
    mapping(uint256 => Profile) public profileInfo;
    mapping(uint256 => Project) public projectInfo;

    constructor(address _verifier) 
    {

    }

    modifier onlySupportedDepth(uint8 depth) 
    {
        if(depth > MAX_DEPTH) {
            revert InvalidTreeDepth();
        }
    }

    function createProject(
        uint8 depth,
        uint256 zeroValue,
        uint256 identityCommitment
    ) 
        external
        onlySupportedDepth(depth)
        returns(_projectCount)
    {
        _createGroup(_projectCount, depth, zeroValue);
        _addMember(_projectCount, identityCommitmentHash);
        projectInfo[_projectCount] = Project(block.timestamp, 0, "", "", "", "");
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
    }

    function removeMember(
        uint256 groupId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) 
        external
    {
        _removeMember(groupId, identityCommitment);
        profileInfo[identityCommitment].ongoingProject.remove(groupId);
    }

    function endProject(uint256 groupId) 
        external
    {

    }

    function getProjectCount()
        external
        view
        returns(uint256 projectCount)
    {
        return _projectCount;
    }

    function getProjectsByIDCommitment(uint256 idCommitment)
        external
    {

    }

    function getLeafByIDCommitment(uint256 idCommitment) 
        external
    {

    }

    function submitReviews(
        uint256 groupId,
        string reviewContent,
        bytes32 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) 
        external
    {

    }

    function claimReviews() 
        external
    {

    }

    function setLensConnect(
        uint256 idCommitment,
        string lensProfile
    )
        external
    {
        profileInfo[idCommitment].lensProfile = lensProfile;
    }

    function getLensConnect(uint256 idCommitment)
        external
        view
        returns(string lensProfile)
    {
        return profileInfo[idCommitment].lensProfile = lensProfile;
    }
}