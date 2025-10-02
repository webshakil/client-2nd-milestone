import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import WalletCard from '../../components/milestone3/WalletCard';
import TransactionHistory from '../../components/milestone3/TransactionHistory';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Get userId from localStorage or context (simplified for demo)
  const userId = 1; // Replace with actual user context

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [walletData, transactionsData] = await Promise.all([
        paymentService.getWallet(userId),
        paymentService.getTransactionHistory(userId)
      ]);

      if (walletData.success) {
        setWallet(walletData.wallet);
      }

      if (transactionsData.success) {
        setTransactions(transactionsData.transactions);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      // Simulate payment gateway transaction ID
      const gatewayTransactionId = `stripe_${Date.now()}`;
      
      const result = await paymentService.deposit(
        userId,
        parseFloat(depositAmount),
        gatewayTransactionId
      );

      if (result.success) {
        alert('Deposit successful!');
        setDepositAmount('');
        loadWalletData();
      } else {
        alert('Deposit failed');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Deposit failed');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const result = await paymentService.withdraw(userId, parseFloat(withdrawAmount));

      if (result.success) {
        alert('Withdrawal request submitted!');
        setWithdrawAmount('');
        loadWalletData();
      } else {
        alert(result.error || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Withdrawal failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wallet</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WalletCard wallet={wallet} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Deposit Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Deposit Funds</h2>
              <form onSubmit={handleDeposit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Deposit
                </button>
              </form>
            </div>

            {/* Withdraw Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Withdraw Funds</h2>
              <form onSubmit={handleWithdraw}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Withdraw
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8">
            <TransactionHistory transactions={transactions} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-600">
                Use your wallet to participate in paid elections and receive prize winnings.
              </p>
              <p className="text-gray-600">
                Deposits are instant. Withdrawals may take 1-3 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;