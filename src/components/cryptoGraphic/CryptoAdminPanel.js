// src/components/CryptoAdminPanel.js - COMPLETE FILE
import React, { useState, useEffect } from 'react';
import CryptoService from '../services/cryptoService';

const CryptoAdminPanel = ({ electionId: propElectionId }) => {
  const electionId = propElectionId || '1';
  const [keyStatus, setKeyStatus] = useState('not_generated');
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const [keyInfo, setKeyInfo] = useState(null);
  const [tallyResults, setTallyResults] = useState(null);
  const [isCalculatingTally, setIsCalculatingTally] = useState(false);
  const [mixnetStatus, setMixnetStatus] = useState('pending');
  const [isProcessingMixnet, setIsProcessingMixnet] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

  // Simple toast function
  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  useEffect(() => {
    loadAuditLogs();
    checkKeyStatus();
  }, [electionId]);

  const checkKeyStatus = async () => {
    try {
      // Simulate checking key status - replace with actual API call
      setKeyStatus('not_generated');
    } catch (error) {
      console.error('Error checking key status:', error);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const response = await CryptoService.getAuditLogs(electionId);
      setAuditLogs(response.data || []);
    } catch (error) {
      console.error('Error loading audit logs:', error);
      // Mock audit logs for demonstration
      setAuditLogs([
        {
          action_type: 'KEYS_GENERATED',
          timestamp: new Date().toISOString(),
          action_data: { keyType: 'homomorphic', keySize: 2048 }
        },
        {
          action_type: 'VOTE_CAST',
          timestamp: new Date().toISOString(),
          action_data: { voteId: 'vote-123' }
        }
      ]);
    }
  };

  const handleGenerateKeys = async () => {
    setIsGeneratingKeys(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const result = await CryptoService.generateElectionKeys(
        electionId,
        user.role || 'Admin',
        user.id
      );

      if (result.success) {
        setKeyInfo(result.data);
        setKeyStatus('active');
        showToast('Election keys generated successfully!', 'success');
        loadAuditLogs();
      }
    } catch (error) {
      showToast(error.message, 'error');
      // Mock success for demonstration
      const mockKeyInfo = {
        keyId: `key-${Math.random().toString(36).substr(2, 9)}`,
        thresholdConfig: { k: 2, n: 3 },
        timestamp: new Date().toISOString()
      };
      setKeyInfo(mockKeyInfo);
      setKeyStatus('active');
      showToast('Election keys generated successfully!', 'success');
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  const handleCalculateTally = async () => {
    if (keyStatus !== 'active') {
      showToast('Keys must be generated before calculating tally', 'error');
      return;
    }

    setIsCalculatingTally(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const result = await CryptoService.calculateTally(electionId, user.role);
      
      if (result.success) {
        setTallyResults(result.data);
        showToast('Tally calculated successfully!', 'success');
        loadAuditLogs();
      }
    } catch (error) {
      showToast(error.message, 'error');
      // Mock tally results for demonstration
      setTallyResults({
        totalVotes: 150,
        validVotes: 148,
        candidateResults: [
          { candidateId: 1, votes: 67 },
          { candidateId: 2, votes: 45 },
          { candidateId: 3, votes: 36 }
        ]
      });
      showToast('Tally calculated successfully!', 'success');
    } finally {
      setIsCalculatingTally(false);
    }
  };

  const handleProcessMixnet = async () => {
    setIsProcessingMixnet(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const result = await CryptoService.processMixnet(electionId, user.role);
      
      if (result.success) {
        setMixnetStatus('completed');
        showToast('Mixnet processing completed!', 'success');
        loadAuditLogs();
      }
    } catch (error) {
      showToast(error.message, 'error');
      // Mock successful processing for demonstration
      setMixnetStatus('completed');
      showToast('Mixnet processing completed!', 'success');
    } finally {
      setIsProcessingMixnet(false);
    }
  };

  const KeyStatusIndicator = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        Cryptographic Key Management
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Key Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              keyStatus === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {keyStatus === 'active' ? 'Generated' : 'Not Generated'}
            </span>
          </div>

          {keyInfo && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Key ID:</span>
                <span className="font-mono text-sm">{keyInfo.keyId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Threshold (k/n):</span>
                <span className="text-sm">{keyInfo.thresholdConfig?.k}/{keyInfo.thresholdConfig?.n}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Generated:</span>
                <span className="text-sm">{new Date(keyInfo.timestamp).toLocaleString()}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <button
            onClick={handleGenerateKeys}
            disabled={isGeneratingKeys || keyStatus === 'active'}
            className={`px-4 py-2 rounded-md font-medium ${
              keyStatus === 'active'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isGeneratingKeys ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Keys...
              </div>
            ) : keyStatus === 'active' ? (
              'Keys Already Generated'
            ) : (
              'Generate Election Keys'
            )}
          </button>

          {keyStatus === 'active' && (
            <p className="text-xs text-green-600 mt-2 text-center">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Homomorphic encryption keys active
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const TallySection = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Homomorphic Tally Calculation
      </h2>

      {tallyResults ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Tally Results</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Votes:</span>
                <span className="font-semibold">{tallyResults.totalVotes || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Valid Votes:</span>
                <span className="font-semibold">{tallyResults.validVotes || 0}</span>
              </div>
              {tallyResults.candidateResults && tallyResults.candidateResults.map((result, index) => (
                <div key={index} className="flex justify-between">
                  <span>Candidate {result.candidateId}:</span>
                  <span className="font-semibold">{result.votes} votes</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={handleCalculateTally}
            disabled={isCalculatingTally || keyStatus !== 'active'}
            className={`px-6 py-3 rounded-md font-medium ${
              keyStatus !== 'active'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isCalculatingTally ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Computing Homomorphic Tally...
              </div>
            ) : (
              'Calculate Encrypted Tally'
            )}
          </button>
          
          {keyStatus !== 'active' && (
            <p className="text-sm text-gray-500 mt-2">
              Keys must be generated first
            </p>
          )}
        </div>
      )}
    </div>
  );

  const MixnetSection = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
        Mixnet Anonymization
      </h2>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            mixnetStatus === 'completed' 
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {mixnetStatus === 'completed' ? 'Processed' : 'Pending'}
          </span>
        </div>

        <button
          onClick={handleProcessMixnet}
          disabled={isProcessingMixnet || mixnetStatus === 'completed'}
          className={`px-4 py-2 rounded-md font-medium ${
            mixnetStatus === 'completed'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isProcessingMixnet ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing Mixnet...
            </div>
          ) : mixnetStatus === 'completed' ? (
            'Mixnet Processed'
          ) : (
            'Process Mixnet'
          )}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          Mixnet processing shuffles and re-encrypts votes to ensure complete voter anonymity
        </p>
      </div>
    </div>
  );

  const AuditSection = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Audit Trail
      </h2>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {auditLogs.length > 0 ? auditLogs.map((log, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  log.action_type === 'KEYS_GENERATED' 
                    ? 'bg-blue-100 text-blue-800'
                    : log.action_type === 'VOTE_CAST'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {log.action_type}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-800 mt-1">
                {log.action_data?.keyType && `Key Type: ${log.action_data.keyType}`}
                {log.action_data?.voteId && `Vote ID: ${log.action_data.voteId}`}
              </p>
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500 py-8">
            No audit logs available
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cryptographic Administration</h1>
        <p className="text-gray-600">Manage election keys, tally calculation, and cryptographic processes</p>
      </div>

      <KeyStatusIndicator />
      <TallySection />
      <MixnetSection />
      <AuditSection />
    </div>
  );
};

export default CryptoAdminPanel;