import React, { useState, useEffect } from 'react';
import { lotteryService } from '../../services/lotteryService';
import LotteryMachine3D from '../../components/milestone3/LotteryMachine3D';
import PrizeCard from '../../components/milestone3/PrizeCard';

const LotteryDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [prizes, setPrizes] = useState([]);
  /*eslint-disable*/
  const [selectedElection, setSelectedElection] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = 1; // Replace with actual user context

  useEffect(() => {
    loadLotteryData();
  }, []);

  const loadLotteryData = async () => {
    try {
      setLoading(true);
      const [ticketsData, prizesData] = await Promise.all([
        lotteryService.getUserTickets(userId),
        lotteryService.getUserPrizes(userId)
      ]);

      if (ticketsData.success) {
        setTickets(ticketsData.tickets);
      }

      if (prizesData.success) {
        setPrizes(prizesData.prizes);
      }
    } catch (error) {
      console.error('Error loading lottery data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimPrize = async (ticketId) => {
    try {
      const result = await lotteryService.claimPrize(ticketId, userId);

      if (result.success) {
        alert('Prize claimed successfully!');
        loadLotteryData();
      } else {
        alert('Failed to claim prize');
      }
    } catch (error) {
      console.error('Claim prize error:', error);
      alert('Failed to claim prize');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading lottery data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lottery Dashboard</h1>

      {/* 3D Lottery Machine Visualization */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Lottery Draw</h2>
        <LotteryMachine3D />
      </div>

      {/* My Tickets */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">My Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-gray-600">You don't have any lottery tickets yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`border rounded-lg p-4 ${
                  ticket.is_winner ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-600">{ticket.election_title}</p>
                    <p className="text-2xl font-bold">{ticket.ticket_number}</p>
                  </div>
                  {ticket.is_winner && (
                    <span className="bg-yellow-400 text-white px-2 py-1 rounded text-xs font-bold">
                      WINNER
                    </span>
                  )}
                </div>
                {ticket.is_winner && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">Prize Amount</p>
                    <p className="text-xl font-bold text-green-600">
                      ${parseFloat(ticket.prize_amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Rank: #{ticket.rank}</p>
                    {!ticket.prize_claimed && (
                      <button
                        onClick={() => handleClaimPrize(ticket.id)}
                        className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                      >
                        Claim Prize
                      </button>
                    )}
                    {ticket.prize_claimed && (
                      <p className="mt-3 text-center text-sm text-green-600">
                        Prize Claimed
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Prizes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Prize History</h2>
        {prizes.length === 0 ? (
          <p className="text-gray-600">No prizes yet.</p>
        ) : (
          <div className="space-y-4">
            {prizes.map((prize) => (
              <PrizeCard key={prize.id} prize={prize} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LotteryDashboard;