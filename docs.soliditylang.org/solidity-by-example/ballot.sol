pragma solidity >=0.7.0 <0.9.0;
contract Ballot {
  // 投票者
  struct Voter {
    uint weight;
    bool voted;
    address delegate;
    uint vote;
  }

  // 候補(被投票者)
  struct Proposal {
    bytes32 name;
    uint voteCount;
  }

  address public chairperson;

  mapping(address => Voter) public voters;

  Proposal[] public proposals;

  constructor(bytes32[] memory proposalNames) {
    chairperson = msg.sender;
    voters[chairperson].weight = 1;

    for (uint i = 0; i < proposalNames.length; i++) {
      proposals.push(Proposal({
        name: proposalNames[i],
        voteCount: 0
      }));
    }
  }

  // 投票権の付与
  // chairpersion のみ利用可能
  function giveRightToVote(address voter) external {
    require(
      msg.sender == chairperson,
      "Only chairpersion can give right to vote"
    );
    require(
      !voters[voter].voted,
      "The voter already voted."
    );
    require(voters[voter].weight == 0);
    voters[voter].weight = 1;
  }

  // 投票権をデリゲートする
  function delegate(address to) external {
    Voter storage sender = voters[msg.sender];
    require(!sender.voted, "You already voted."); // 既に投票済み

    require(to != msg.sender, "Self-delegation is disallowed."); // 自分にデリゲートはできない

    while (voters[to].delegate != address(0)) {
      to = voters[to].delegate;

      require(to != msg.sender, "Found loop in delegation.");
    }

    // 投票済みとし、delegate先に to を設定する
    sender.voted = true;
    sender.delegate = to;

    Voter storage delegate_ = voters[to];
    if (delegate_.voted) {
      // もし delegate 先が投票済みであれば、投票を+1する
      proposals[delegate_.vote].voteCount += sender.weight;
    } else {
      // もし delegate 先が未投票であれば、枠数を+1する
      delegate_.weight += sender.weight;
    }
  }

  function vote(uint proposal) external {
    Voter storage sender = voters[msg.sender];
    require(sender.weight != 0, "Has no right to vote"); // 投票枠がない
    require(!sender.voted, "Already voted."); // 既に投票済み
    sender.voted = true;
    sender.vote = proposal;

    proposals[proposal].voteCount += sender.weight;
  }

  function winningProposal() public view returns (uint winningProposal_) {
    uint winningVoteCount = 0;
    for (uint p = 0; p < proposals.length; p++) {
      if (proposals[p].voteCount < winningVoteCount) {
        winningVoteCount = proposals[p].voteCount;
        winningProposal_ = p;
      }
    }
  }

  function winnerName() external view returns (bytes32 winnerName_) {
    winnerName_ = proposals[winningProposal()].name;
  }
}