import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import SubscriptionPlans from '../../components/milestone3/SubscriptionPlans';

const Subscriptions = () => {
  const [plans, setPlans] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = 1; // Replace with actual user context

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const [plansData, subscriptionData] = await Promise.all([
        paymentService.getSubscriptionPlans(),
        paymentService.getUserSubscription(userId)
      ]);

      if (plansData.success) {
        setPlans(plansData.plans);
      }

      if (subscriptionData.success) {
        setCurrentSubscription(subscriptionData.subscription);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planType) => {
    try {
      // Simulate payment gateway transaction
      const gatewayTransactionId = `stripe_sub_${Date.now()}`;
      
      const result = await paymentService.subscribe(userId, planType, gatewayTransactionId);

      if (result.success) {
        alert('Subscription activated successfully!');
        loadSubscriptionData();
      } else {
        alert('Subscription failed');
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      alert('Subscription failed');
    }
  };

  const handleCancel = async () => {
    if (!currentSubscription) return;

    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    try {
      const result = await paymentService.cancelSubscription(
        currentSubscription.id,
        userId
      );

      if (result.success) {
        alert('Subscription cancelled');
        loadSubscriptionData();
      } else {
        alert('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel subscription');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Subscription Plans</h1>

      {currentSubscription && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-2">Current Subscription</h2>
          <p className="text-gray-700 mb-4">
            Plan: <span className="font-semibold">{currentSubscription.plan_type}</span>
          </p>
          <p className="text-gray-700 mb-4">
            Expires: {new Date(currentSubscription.end_date).toLocaleDateString()}
          </p>
          <button
            onClick={handleCancel}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Cancel Subscription
          </button>
        </div>
      )}

      <SubscriptionPlans plans={plans} onSubscribe={handleSubscribe} />
    </div>
  );
};

export default Subscriptions;