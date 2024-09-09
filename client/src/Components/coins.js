import React, { useState } from 'react';

function ClaimRewards() {
  const [totalCoins, setTotalCoins] = useState(350);

  const rewards = [
    { name: 'Next Session Free', cost: 200 },
    { name: 'Movie Ticket', cost: 150 },
    { name: 'Amusement Park Ticket', cost: 300 },
    { name: 'Meal Vouchers', cost: 100 }
  ];

  const claimReward = (cost) => {
    if (totalCoins >= cost) {
      setTotalCoins(totalCoins - cost);
      alert('Reward claimed!');
    } else {
      alert('Not enough coins to claim this reward.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h2 className="text-3xl font-bold mb-4">Claim Rewards</h2>
      <p className="text-lg mb-6">Total Coins: {totalCoins}</p>

      <div className="flex flex-col items-center gap-6 w-full max-w-lg">
        {rewards.map((reward, index) => (
          <div 
            key={index} 
            className="border border-gray-300 p-6 rounded-lg shadow-lg w-full text-center bg-white"
          >
            <h3 className="text-xl font-semibold mb-2">{reward.name}</h3>
            <p className="mb-4">Cost: {reward.cost} coins</p>
            <button
              onClick={() => claimReward(reward.cost)}
              disabled={totalCoins < reward.cost}
              className={`px-4 py-2 rounded ${
                totalCoins >= reward.cost ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300'
              } text-white font-semibold`}
            >
              {totalCoins >= reward.cost ? 'Claim' : 'Not Enough Coins'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClaimRewards;
