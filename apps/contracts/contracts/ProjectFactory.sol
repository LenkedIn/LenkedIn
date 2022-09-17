//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@semaphore-protocol/contracts/interfaces/IVerifier.sol";
import "@semaphore-protocol/contracts/base/SemaphoreCore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";

error InvalidTreeDepth();

contract ProjectFactory is SemaphoreCore, SemaphoreGroups {
    uint8 internal constant MAX_DEPTH = 32;

    mapping(uint256 => EnumerableSet.UintSet) internal groupsJoined;

    constructor() 
    {

    }

    modifier onlySupportedDepth(uint8 depth) 
    {
        if(depth > MAX_DEPTH) {
            revert InvalidTreeDepth();
        }
    }

    function createProject(
        uint256 groupId,
        uint8 depth,
        uint256 zeroValue,
        uint256 identityCommitment
    ) 
        external
        onlySupportedDepth(depth)
    {
        _createGroup(groupId, depth, zeroValue);
        groupsJoined[identityCommitment].add(groupId);
    }

    function addMember(
        uint256 groupId, 
        uint256 identityCommitment
    ) 
        external
    {
        _addMember(groupId, identityCommitment);
        groupsJoined[identityCommitment].add(groupId);
    }

    function removeMember(
        uint256 groupId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) 
        external
    {

    }

    function endProject(uint256 groupId) 
        external
    {

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

    function lensConnect()
        external
    {

    }
}