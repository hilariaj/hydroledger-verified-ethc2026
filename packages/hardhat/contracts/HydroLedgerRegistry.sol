// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HydroLedgerRegistry {
    enum Status {
        Submitted,
        Compliant,
        NeedsReview
    }

    struct Report {
        uint256 id;
        address farm;
        bytes32 reportHash;
        uint256 timestamp;
        Status status;
        string farmName;
        string region;
        string cropType;
        string reportingPeriod;
    }

    uint256 public reportCount;
    mapping(uint256 => Report) public reports;

    event ReportSubmitted(
        uint256 indexed id,
        address indexed farm,
        bytes32 reportHash,
        uint256 timestamp,
        Status status
    );

    function submitReport(
        bytes32 _reportHash,
        string memory _farmName,
        string memory _region,
        string memory _cropType,
        string memory _reportingPeriod
    ) public {
        reportCount++;

        reports[reportCount] = Report({
            id: reportCount,
            farm: msg.sender,
            reportHash: _reportHash,
            timestamp: block.timestamp,
            status: Status.Submitted,
            farmName: _farmName,
            region: _region,
            cropType: _cropType,
            reportingPeriod: _reportingPeriod
        });

        emit ReportSubmitted(
            reportCount,
            msg.sender,
            _reportHash,
            block.timestamp,
            Status.Submitted
        );
    }

    function getReport(uint256 _id) public view returns (Report memory) {
        return reports[_id];
    }
}