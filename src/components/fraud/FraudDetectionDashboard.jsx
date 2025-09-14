// components/fraud/FraudDetectionDashboard.js
import React, { useState } from 'react';
import { useFraud } from '../../hooks/useFraud';
import { useAuth } from '../../contexts/AuthContext';

const FraudDetectionDashboard = ({ electionId }) => {
  const { detectFraud, fraudAnalysis, loading } = useFraud(electionId);
  const { hasRole } = useAuth();
  
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [sampleVoteData] = useState([
    // Sample vote data for demonstration
    { voter_id: 'voter_001', candidate_id: 'candidate_A', timestamp: '2024-03-01T10:00:00Z', ip_address: '192.168.1.1' },
    { voter_id: 'voter_002', candidate_id: 'candidate_B', timestamp: '2024-03-01T10:05:00Z', ip_address: '192.168.1.2' },
    { voter_id: 'voter_003', candidate_id: 'candidate_A', timestamp: '2024-03-01T10:10:00Z', ip_address: '192.168.1.3' },
    { voter_id: 'voter_001', candidate_id: 'candidate_A', timestamp: '2024-03-01T10:15:00Z', ip_address: '192.168.1.1' }, // Duplicate
    { voter_id: 'voter_004', candidate_id: 'candidate_C', timestamp: '2024-03-01T10:20:00Z', ip_address: '192.168.1.4' },
  ]);

  // Check if user can run fraud detection
  const canRunDetection = hasRole(['Manager', 'Admin', 'Auditor', 'Analyst']);

  // Run fraud detection
  const handleRunDetection = async () => {
    if (!canRunDetection || !electionId) return;
    
    setAnalysisRunning(true);
    try {
      await detectFraud(electionId, sampleVoteData);
    } catch (error) {
      console.error('Error running fraud detection:', error);
    } finally {
      setAnalysisRunning(false);
    }
  };

  if (!canRunDetection) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <p>You don't have permission to access fraud detection features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Fraud Detection Analysis
          </h3>
          <button
            onClick={handleRunDetection}
            disabled={loading || analysisRunning || !electionId}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analysisRunning ? 'Analyzing...' : 'Run Detection'}
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Analyze voting patterns and detect potential fraud indicators for this election.
        </p>
        
        {!electionId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-yellow-800 text-sm">
              Please select an election to run fraud detection analysis.
            </p>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {fraudAnalysis && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-red-600">
                {fraudAnalysis.detected_issues?.duplicates || 0}
              </div>
              <div className="text-sm text-gray-600">Duplicate Votes</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-orange-600">
                {fraudAnalysis.detected_issues?.suspicious_patterns || 0}
              </div>
              <div className="text-sm text-gray-600">Suspicious Patterns</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {fraudAnalysis.detected_issues?.voting_anomalies || 0}
              </div>
              <div className="text-sm text-gray-600">Voting Anomalies</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">
                {fraudAnalysis.voting_statistics?.unique_voters || 0}
              </div>
              <div className="text-sm text-gray-600">Unique Voters</div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fraud Analysis Report */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Fraud Analysis Report
              </h4>
              
              {fraudAnalysis.fraud_analysis ? (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Risk Level</h5>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      fraudAnalysis.fraud_analysis.risk_level === 'high' ? 'bg-red-100 text-red-800' :
                      fraudAnalysis.fraud_analysis.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {fraudAnalysis.fraud_analysis.risk_level?.toUpperCase() || 'LOW'}
                    </span>
                  </div>
                  
                  {fraudAnalysis.fraud_analysis.issues && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Detected Issues</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {fraudAnalysis.fraud_analysis.issues.map((issue, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {fraudAnalysis.fraud_analysis.recommendations && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Recommendations</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {fraudAnalysis.fraud_analysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No specific fraud patterns detected.</p>
              )}
            </div>

            {/* Voting Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Voting Statistics
              </h4>
              
              {fraudAnalysis.voting_statistics && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {fraudAnalysis.voting_statistics.total_votes}
                      </div>
                      <div className="text-sm text-gray-600">Total Votes</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {fraudAnalysis.voting_statistics.unique_voters}
                      </div>
                      <div className="text-sm text-gray-600">Unique Voters</div>
                    </div>
                  </div>
                  
                  {fraudAnalysis.voting_statistics.voting_timeline && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Voting Timeline</h5>
                      <div className="space-y-2">
                        {Object.entries(fraudAnalysis.voting_statistics.voting_timeline).map(([timeframe, count]) => (
                          <div key={timeframe} className="flex justify-between text-sm">
                            <span className="text-gray-600">{timeframe}</span>
                            <span className="font-medium">{count} votes</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Detailed Issues */}
          {(fraudAnalysis.detected_issues?.duplicates > 0 || 
            fraudAnalysis.detected_issues?.suspicious_patterns > 0 || 
            fraudAnalysis.detected_issues?.voting_anomalies > 0) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Detailed Issue Analysis
              </h4>
              
              <div className="space-y-4">
                {fraudAnalysis.detected_issues?.duplicates > 0 && (
                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-medium text-red-700 mb-2">Duplicate Votes Detected</h5>
                    <p className="text-sm text-gray-600">
                      Found {fraudAnalysis.detected_issues.duplicates} potential duplicate votes. 
                      This may indicate voter fraud or system errors that need investigation.
                    </p>
                  </div>
                )}
                
                {fraudAnalysis.detected_issues?.suspicious_patterns > 0 && (
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h5 className="font-medium text-orange-700 mb-2">Suspicious Patterns</h5>
                    <p className="text-sm text-gray-600">
                      Identified {fraudAnalysis.detected_issues.suspicious_patterns} suspicious voting patterns. 
                      These may include unusual timing, geographic clustering, or other anomalies.
                    </p>
                  </div>
                )}
                
                {fraudAnalysis.detected_issues?.voting_anomalies > 0 && (
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h5 className="font-medium text-yellow-700 mb-2">Voting Anomalies</h5>
                    <p className="text-sm text-gray-600">
                      Detected {fraudAnalysis.detected_issues.voting_anomalies} voting behavior anomalies. 
                      These require further analysis to determine if they represent legitimate concerns.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {(loading || analysisRunning) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-gray-600">Running fraud detection analysis...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudDetectionDashboard;