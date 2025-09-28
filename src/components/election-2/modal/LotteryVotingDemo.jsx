import React, { useState, useEffect, useRef } from 'react';
import {
  XMarkIcon,
  GiftIcon,
  CheckCircleIcon,
  TrophyIcon,
  SparklesIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  CubeIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const LotteryVotingDemo = ({ election, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userName] = useState('Demo User');
  const [userVoteId] = useState('VT-2025-' + Math.floor(Math.random() * 10000));
  const [lotteryRunning, setLotteryRunning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [ballsInMachine, setBallsInMachine] = useState([]);
  const [machineRotation, setMachineRotation] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [voteFlying, setVoteFlying] = useState(false);
  const [digitalReceipt, setDigitalReceipt] = useState(null);
  const [fourDNumbers, setFourDNumbers] = useState(null);
  //const [showReceipt, setShowReceipt] = useState(false);
  const [blockchainHash, setBlockchainHash] = useState('');
  const [liveResults, setLiveResults] = useState({ total: 1247, breakdown: {} });
  const flyingVoteRef = useRef(null);

  // Election data with proper images for all options
  const electionData = {
    title: election?.title || "Best Smartphone 2025",
    description: election?.description || "Vote for the best smartphone and win prizes!",
    prizeAmount: election?.reward_amount ? parseFloat(election.reward_amount) : 50000,
    winnerCount: election?.winner_count || 3,
    isPaid: election?.pricing_type !== 'free',
    isLotterized: election?.is_lotterized !== false,
    participationFee: election?.participation_fee ? parseFloat(election.participation_fee) : 10,
    options: election?.questions?.[0]?.answers?.map((answer, index) => ({
      id: answer.id || index + 1,
      name: answer.text || answer.name,
      votes: Math.floor(Math.random() * 500) + 100,
      image: answer.imageUrl || `https://picsum.photos/400/300?random=${index + 1}`, // Always provide image
      emoji: "📱"
    })) || [
      { id: 1, name: "iPhone 16 Pro Max", votes: 423, image: "https://picsum.photos/400/300?random=1", emoji: "📱" },
      { id: 2, name: "Samsung Galaxy S25 Ultra", votes: 387, image: "https://picsum.photos/400/300?random=2", emoji: "📱" },
      { id: 3, name: "Google Pixel 9 Pro", votes: 298, image: "https://picsum.photos/400/300?random=3", emoji: "📱" },
      { id: 4, name: "OnePlus 13 Pro", votes: 139, image: "https://picsum.photos/400/300?random=4", emoji: "📱" }
    ]
  };

  // Generate 4D lottery numbers
  const generate4DNumbers = () => {
    const crypto = window.crypto || window.msCrypto;
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    return {
      dimension1: (array[0] % 9999).toString().padStart(4, '0'),
      dimension2: (array[1] % 9999).toString().padStart(4, '0'),
      dimension3: (array[2] % 9999).toString().padStart(4, '0'),
      dimension4: (array[3] % 9999).toString().padStart(4, '0'),
      masterNumber: (array[0] % 999999).toString().padStart(6, '0')
    };
  };

  // Generate digital receipt
  const generateDigitalReceipt = (voteData) => {
    const timestamp = new Date().toISOString();
    return {
      receiptId: 'RC-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      voteId: userVoteId,
      voterName: userName,
      choice: voteData.name,
      timestamp: timestamp,
      blockchainTx: 'BLK-' + Math.random().toString(36).substr(2, 12).toUpperCase(),
      hash: 'SHA256-' + Math.random().toString(36).substr(2, 16).toUpperCase(),
      verificationCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
      fourDNumbers: fourDNumbers,
      electionId: election?.id || 'DEMO-001'
    };
  };

  // Initialize mock voters and live results
  useEffect(() => {
    const mockVoters = [
      { id: 'VT-001', userName: 'Alice Johnson', option: { name: 'iPhone' }, color: '#EF4444', fourD: generate4DNumbers() },
      { id: 'VT-002', userName: 'Bob Smith', option: { name: 'Samsung' }, color: '#10B981', fourD: generate4DNumbers() },
      { id: 'VT-003', userName: 'Carol Davis', option: { name: 'Google' }, color: '#F59E0B', fourD: generate4DNumbers() },
      { id: 'VT-004', userName: 'David Wilson', option: { name: 'OnePlus' }, color: '#8B5CF6', fourD: generate4DNumbers() }
    ];
    setBallsInMachine(mockVoters);
    setBlockchainHash('0x' + Math.random().toString(16).substr(2, 40));
    
    // Initialize live results
    const initialResults = {};
    electionData.options.forEach(option => {
      initialResults[option.id] = option.votes;
    });
    setLiveResults({
      total: Object.values(initialResults).reduce((sum, votes) => sum + votes, 0),
      breakdown: initialResults
    });
  }, []);

  // Live results update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveResults(prev => {
        const newBreakdown = { ...prev.breakdown };
        // Randomly increment votes for demonstration
        const randomOption = electionData.options[Math.floor(Math.random() * electionData.options.length)];
        if (newBreakdown[randomOption.id]) {
          newBreakdown[randomOption.id] += Math.floor(Math.random() * 3) + 1;
        }
        
        return {
          breakdown: newBreakdown,
          total: Object.values(newBreakdown).reduce((sum, votes) => sum + votes, 0)
        };
      });
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Machine rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMachineRotation(prev => (prev + 1.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handlePayment = () => {
    setShowPayment(true);
    setTimeout(() => {
      setPaymentCompleted(true);
      setShowPayment(false);
      setCurrentStep(1);
    }, 3000);
  };

  const handleVoteSubmit = () => {
    if (!selectedOption) return;
    
    const fourD = generate4DNumbers();
    setFourDNumbers(fourD);
    setVoteFlying(true);
    
    // Update live results with user's vote
    setLiveResults(prev => ({
      breakdown: {
        ...prev.breakdown,
        [selectedOption.id]: (prev.breakdown[selectedOption.id] || 0) + 1
      },
      total: prev.total + 1
    }));
    
    setTimeout(() => {
      const newBall = {
        id: userVoteId,
        userName,
        option: selectedOption,
        color: '#3B82F6',
        fourD: fourD
      };
      setBallsInMachine(prev => [...prev, newBall]);
      
      const receipt = generateDigitalReceipt(selectedOption);
      setDigitalReceipt(receipt);
      
      setVoteFlying(false);
      setCurrentStep(2);
    }, 2000);
  };

  const startLottery = () => {
    setLotteryRunning(true);
    setCurrentStep(3);
    
    setTimeout(() => {
      const totalDimensions = ballsInMachine.reduce((sum, ball) => {
        return sum + parseInt(ball.fourD?.masterNumber || '0');
      }, 0);
      
      const winningIndex = totalDimensions % ballsInMachine.length;
      const randomWinner = ballsInMachine[winningIndex];
      
      setWinner(randomWinner);
      setLotteryRunning(false);
      setCurrentStep(4);
    }, 4000);
  };

  const resetDemo = () => {
    setCurrentStep(electionData.isPaid && !paymentCompleted ? 0 : 1);
    setSelectedOption(null);
    setWinner(null);
    setLotteryRunning(false);
    setDigitalReceipt(null);
    //setShowReceipt(false);
    setVoteFlying(false);
  };

  // 4D Lottery Machine
  const LotteryMachine = () => (
    <div className="relative mx-auto w-96 h-96">
      <div 
        className="relative w-full h-full transition-transform duration-100"
        style={{ 
          transform: `rotateY(${machineRotation}deg) rotateX(${Math.sin(machineRotation * Math.PI / 180) * 15}deg)` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-200 rounded-full border-8 border-purple-400 shadow-2xl opacity-80">
          <div className="absolute inset-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full border-4 border-blue-300 opacity-70">
            <div className="absolute inset-4 bg-gradient-to-br from-transparent to-purple-50 rounded-full border-2 border-purple-200">
              {ballsInMachine.map((ball, index) => {
                const time = Date.now() / 1000;
                const angle1 = (index * 360) / ballsInMachine.length + time * 15;
                const angle2 = (index * 180) / ballsInMachine.length + time * 10;
                const radius1 = 45 + Math.sin(time + index) * 15;
                const radius2 = 30 + Math.cos(time + index * 2) * 10;
                
                const x = Math.cos((angle1 * Math.PI) / 180) * radius1;
                const y = Math.sin((angle1 * Math.PI) / 180) * radius1;
                const z = Math.cos((angle2 * Math.PI) / 180) * radius2;
                
                return (
                  <div
                    key={ball.id}
                    className={`absolute w-8 h-8 rounded-full shadow-xl transform transition-all duration-500 ${
                      lotteryRunning ? 'animate-pulse' : ''
                    }`}
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      backgroundColor: winner?.id === ball.id ? '#FFD700' : ball.color,
                      transform: `scale(${winner?.id === ball.id ? 2 : 1}) translateZ(${z}px)`,
                      boxShadow: winner?.id === ball.id 
                        ? '0 0 25px #FFD700, 0 0 50px #FFD700' 
                        : '0 4px 12px rgba(0,0,0,0.3)',
                      zIndex: winner?.id === ball.id ? 20 : 1
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-white/40 to-transparent">
                      {ball.fourD && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-gray-700 bg-white/80 px-1 rounded">
                          {ball.fourD.masterNumber}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg">
            4D Lottery Machine
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {ballsInMachine.length} votes • ${electionData.prizeAmount.toLocaleString()} prize
          </div>
        </div>
      </div>
    </div>
  );

  // Flying Vote Animation
  const FlyingVote = () => (
    <div 
      ref={flyingVoteRef}
      className={`fixed w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transform transition-all duration-2000 z-50 ${
        voteFlying ? 'animate-bounce' : ''
      }`}
      style={{
        left: voteFlying ? '50%' : '20%',
        top: voteFlying ? '30%' : '60%',
        transform: voteFlying ? 'translate(-50%, -50%) scale(0.5)' : 'translate(-50%, -50%) scale(1)'
      }}
    >
      VOTE
    </div>
  );

  // Digital Receipt Modal - Fixed close button
  // Digital Receipt Modal - Fixed close button with proper z-index and event handling
// Digital Receipt Modal - Completely rewritten for proper functionality
// Remove the DigitalReceiptModal component entirely and replace the View Receipt button with:


// const DigitalReceiptModal = () => {
//   if (!showReceipt) return null;
  
//   return (
//     <div 
//       className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
//       style={{ zIndex: 99999 }}
//     >
//       <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
//         {/* Close button with absolute positioning */}
//         <button 
//           onClick={() => setShowReceipt(false)}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
//           type="button"
//         >
//           ✕
//         </button>
        
//         <div className="pr-8"> {/* Add padding to avoid close button */}
//           <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
//             <DocumentTextIcon className="h-5 w-5" />
//             Digital Receipt
//           </h3>
          
//           {digitalReceipt && (
//             <div className="space-y-3 text-sm">
//               <div className="border-b pb-2">
//                 <div className="font-bold text-green-600">VOTE VERIFIED ✓</div>
//               </div>
              
//               <div className="grid grid-cols-2 gap-2">
//                 <div><strong>Receipt ID:</strong></div>
//                 <div className="font-mono text-xs">{digitalReceipt.receiptId}</div>
                
//                 <div><strong>Vote ID:</strong></div>
//                 <div className="font-mono text-xs">{digitalReceipt.voteId}</div>
                
//                 <div><strong>Choice:</strong></div>
//                 <div>{digitalReceipt.choice}</div>
                
//                 <div><strong>Blockchain TX:</strong></div>
//                 <div className="font-mono text-xs break-all">{digitalReceipt.blockchainTx}</div>
//               </div>
              
//               {digitalReceipt.fourDNumbers && (
//                 <div className="bg-purple-50 p-3 rounded border">
//                   <div className="font-bold text-purple-800 mb-2">4D Lottery Numbers:</div>
//                   <div className="grid grid-cols-2 gap-1 text-xs">
//                     <div>D1: {digitalReceipt.fourDNumbers.dimension1}</div>
//                     <div>D2: {digitalReceipt.fourDNumbers.dimension2}</div>
//                     <div>D3: {digitalReceipt.fourDNumbers.dimension3}</div>
//                     <div>D4: {digitalReceipt.fourDNumbers.dimension4}</div>
//                     <div className="col-span-2 font-bold text-center mt-1">
//                       Master: {digitalReceipt.fourDNumbers.masterNumber}
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               {/* Additional close button at bottom */}
//               <div className="flex justify-end pt-4">
//                 <button
//                   onClick={() => setShowReceipt(false)}
//                   className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
//                   type="button"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
//   const DigitalReceiptModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg max-w-md w-full p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-bold flex items-center gap-2">
//             <DocumentTextIcon className="h-5 w-5" />
//             Digital Receipt
//           </h3>
//           <button 
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               setShowReceipt(false);
//             }}
//             className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
//             type="button"
//           >
//             <XMarkIcon className="h-6 w-6" />
//           </button>
//         </div>
        
//         {digitalReceipt && (
//           <div className="space-y-3 text-sm">
//             <div className="border-b pb-2">
//               <div className="font-bold text-green-600">VOTE VERIFIED ✓</div>
//             </div>
            
//             <div className="grid grid-cols-2 gap-2">
//               <div><strong>Receipt ID:</strong></div>
//               <div className="font-mono text-xs">{digitalReceipt.receiptId}</div>
              
//               <div><strong>Vote ID:</strong></div>
//               <div className="font-mono text-xs">{digitalReceipt.voteId}</div>
              
//               <div><strong>Choice:</strong></div>
//               <div>{digitalReceipt.choice}</div>
              
//               <div><strong>Blockchain TX:</strong></div>
//               <div className="font-mono text-xs break-all">{digitalReceipt.blockchainTx}</div>
//             </div>
            
//             {digitalReceipt.fourDNumbers && (
//               <div className="bg-purple-50 p-3 rounded border">
//                 <div className="font-bold text-purple-800 mb-2">4D Lottery Numbers:</div>
//                 <div className="grid grid-cols-2 gap-1 text-xs">
//                   <div>D1: {digitalReceipt.fourDNumbers.dimension1}</div>
//                   <div>D2: {digitalReceipt.fourDNumbers.dimension2}</div>
//                   <div>D3: {digitalReceipt.fourDNumbers.dimension3}</div>
//                   <div>D4: {digitalReceipt.fourDNumbers.dimension4}</div>
//                   <div className="col-span-2 font-bold text-center mt-1">
//                     Master: {digitalReceipt.fourDNumbers.masterNumber}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );

  // Live Results Component
  const LiveResults = () => (
    <div className="bg-gray-50 rounded-lg p-4 mt-4">
      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Live Results ({liveResults.total} total votes)
      </h4>
      <div className="space-y-2">
        {electionData.options.map((option) => {
          const votes = liveResults.breakdown[option.id] || 0;
          const percentage = liveResults.total > 0 ? (votes / liveResults.total * 100) : 0;
          
          return (
            <div key={option.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <img 
                  src={option.image} 
                  alt={option.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="text-sm font-medium truncate">{option.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-mono w-12 text-right">{votes}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  useEffect(() => {
    if (electionData.isPaid && !paymentCompleted) {
      setCurrentStep(0);
    }
  }, [electionData.isPaid, paymentCompleted]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{electionData.title}</h2>
              <p className="opacity-90 mt-1">{electionData.description}</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mt-4 bg-white/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GiftIcon className="h-6 w-6 text-yellow-300" />
                <span className="font-bold text-lg">${electionData.prizeAmount.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Winners</div>
                <div className="font-bold">{electionData.winnerCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Payment Step */}
          {currentStep === 0 && electionData.isPaid && (
            <div className="space-y-6 text-center">
              <div className="text-6xl">💳</div>
              <h3 className="text-2xl font-bold">Secure Payment Required</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-lg font-bold text-blue-900">
                  Participation Fee: ${electionData.participationFee}
                </div>
              </div>
              {showPayment ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 text-yellow-800">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                    <span className="font-bold">Processing Payment...</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handlePayment}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 mx-auto"
                >
                  <CreditCardIcon className="h-5 w-5" />
                  Pay Now & Enter Lottery
                </button>
              )}
            </div>
          )}

          {/* Voting Step */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">Cast Your Vote</h3>
              <div className="grid grid-cols-2 gap-4">
                {electionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option)}
                    className={`p-4 border-2 rounded-xl transition-all hover:shadow-lg ${
                      selectedOption?.id === option.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={option.image} 
                      alt={option.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <div className="font-bold text-lg">{option.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {liveResults.breakdown[option.id] || option.votes} votes
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedOption && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="font-medium">Selected: {selectedOption.name}</span>
                  </div>
                </div>
              )}
              
              <LiveResults />
              
              <div className="text-center">
                <button
                  onClick={handleVoteSubmit}
                  disabled={!selectedOption}
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-purple-700"
                >
                  Submit Vote & Enter 4D Lottery
                </button>
              </div>
            </div>
          )}

          {/* Vote Confirmation */}
          {currentStep === 2 && (
            <div className="space-y-6 text-center">
              <div className="text-6xl">🎉</div>
              <h3 className="text-2xl font-bold text-green-600">Vote Successfully Submitted!</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Vote ID:</span>
                    <span className="text-purple-600 font-mono">{userVoteId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Choice:</span>
                    <span>{selectedOption?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Blockchain TX:</span>
                    <span className="text-blue-600 font-mono text-xs">{blockchainHash}</span>
                  </div>
                  {fourDNumbers && (
                    <div className="flex justify-between">
                      <span className="font-medium">4D Master #:</span>
                      <span className="text-purple-600 font-mono">{fourDNumbers.masterNumber}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                {/* <button
                  onClick={() => setShowReceipt(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                  <DocumentTextIcon className="h-4 w-4" />
                  View Receipt
                </button> */}
                <button
  onClick={() => {
    alert(`Digital Receipt\n\nReceipt ID: ${digitalReceipt?.receiptId}\nVote ID: ${digitalReceipt?.voteId}\nChoice: ${digitalReceipt?.choice}\nBlockchain TX: ${digitalReceipt?.blockchainTx}\n4D Master Number: ${digitalReceipt?.fourDNumbers?.masterNumber}`);
  }}
  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
>
  <DocumentTextIcon className="h-4 w-4" />
  View Receipt
</button>
              </div>

              <LiveResults />
              <LotteryMachine />

              <button
                onClick={startLottery}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 flex items-center gap-2 mx-auto"
              >
                <SparklesIcon className="h-5 w-5" />
                Start 4D Lottery Draw
              </button>
            </div>
          )}

          {/* Lottery Draw */}
          {currentStep === 3 && (
            <div className="space-y-6 text-center">
              <h3 className="text-2xl font-bold">🎰 4D Quantum Lottery Draw</h3>
              <LotteryMachine />
              <LiveResults />
              {lotteryRunning && (
                <div className="text-lg font-bold text-purple-600">
                  4D Cryptographically Secure Selection
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {currentStep === 4 && winner && (
            <div className="space-y-6 text-center">
              <div className="text-6xl">🏆</div>
              <h3 className="text-3xl font-bold text-yellow-600">4D Lottery Winner Selected!</h3>
              
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-8 max-w-md mx-auto">
                <TrophyIcon className="h-16 w-16 mx-auto mb-4" />
                <div className="text-2xl font-bold">{winner.userName}</div>
                <div className="text-lg opacity-90">Vote ID: {winner.id}</div>
                
                {winner.fourD && (
                  <div className="bg-white/20 rounded-lg p-3 mt-4">
                    <div className="text-sm opacity-90 mb-1">Winning 4D Combination:</div>
                    <div className="font-mono text-lg">{winner.fourD.masterNumber}</div>
                  </div>
                )}
                
                <div className="bg-white/20 rounded-lg p-4 mt-4">
                  <div className="text-3xl font-bold">${electionData.prizeAmount.toLocaleString()}</div>
                  <div className="text-sm opacity-90">Prize Amount</div>
                </div>
              </div>
              
              <LiveResults />
              
              <button
                onClick={resetDemo}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Try Another Demo
              </button>
            </div>
          )}
        </div>
      </div>

      {voteFlying && <FlyingVote />}
      {/* {showReceipt && <DigitalReceiptModal />} */}
    
    </div>
  );
};

export default LotteryVotingDemo;
//this is working excellent. just to have some imporvements
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   XMarkIcon,
//   GiftIcon,
//   CheckCircleIcon,
//   TrophyIcon,
//   SparklesIcon,
//   CreditCardIcon,
//   DocumentTextIcon,
//   ShieldCheckIcon,
//   CubeIcon,
//   EyeIcon
// } from '@heroicons/react/24/outline';

// const LotteryVotingDemo = ({ election, onClose }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [userName] = useState('Demo User');
//   const [userVoteId] = useState('VT-2025-' + Math.floor(Math.random() * 10000));
//   const [lotteryRunning, setLotteryRunning] = useState(false);
//   const [winner, setWinner] = useState(null);
//   const [ballsInMachine, setBallsInMachine] = useState([]);
//   const [machineRotation, setMachineRotation] = useState(0);
//   const [showPayment, setShowPayment] = useState(false);
//   const [paymentCompleted, setPaymentCompleted] = useState(false);
//   const [voteFlying, setVoteFlying] = useState(false);
//   const [digitalReceipt, setDigitalReceipt] = useState(null);
//   const [fourDNumbers, setFourDNumbers] = useState(null);
//   const [showReceipt, setShowReceipt] = useState(false);
//   const [blockchainHash, setBlockchainHash] = useState(''); // Added this missing state
//   const flyingVoteRef = useRef(null);

//   // Election data
//   const electionData = {
//     title: election?.title || "Best Smartphone 2025",
//     description: election?.description || "Vote for the best smartphone and win prizes!",
//     prizeAmount: election?.reward_amount ? parseFloat(election.reward_amount) : 50000,
//     winnerCount: election?.winner_count || 3,
//     isPaid: election?.pricing_type !== 'free',
//     isLotterized: election?.is_lotterized !== false,
//     participationFee: election?.participation_fee ? parseFloat(election.participation_fee) : 10,
//     options: election?.questions?.[0]?.answers || [
//       { id: 1, name: "iPhone 16 Pro Max", votes: 423, emoji: "📱" },
//       { id: 2, name: "Samsung Galaxy S25 Ultra", votes: 387, emoji: "📱" },
//       { id: 3, name: "Google Pixel 9 Pro", votes: 298, emoji: "📱" },
//       { id: 4, name: "OnePlus 13 Pro", votes: 139, emoji: "📱" }
//     ]
//   };

//   // Generate 4D lottery numbers
//   const generate4DNumbers = () => {
//     const crypto = window.crypto || window.msCrypto;
//     const array = new Uint32Array(4);
//     crypto.getRandomValues(array);
//     return {
//       dimension1: (array[0] % 9999).toString().padStart(4, '0'),
//       dimension2: (array[1] % 9999).toString().padStart(4, '0'),
//       dimension3: (array[2] % 9999).toString().padStart(4, '0'),
//       dimension4: (array[3] % 9999).toString().padStart(4, '0'),
//       masterNumber: (array[0] % 999999).toString().padStart(6, '0')
//     };
//   };

//   // Generate digital receipt
//   const generateDigitalReceipt = (voteData) => {
//     const timestamp = new Date().toISOString();
//     return {
//       receiptId: 'RC-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
//       voteId: userVoteId,
//       voterName: userName,
//       choice: voteData.name,
//       timestamp: timestamp,
//       blockchainTx: 'BLK-' + Math.random().toString(36).substr(2, 12).toUpperCase(),
//       hash: 'SHA256-' + Math.random().toString(36).substr(2, 16).toUpperCase(),
//       verificationCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
//       fourDNumbers: fourDNumbers,
//       electionId: election?.id || 'DEMO-001'
//     };
//   };

//   // Initialize mock voters
//   useEffect(() => {
//     const mockVoters = [
//       { id: 'VT-001', userName: 'Alice Johnson', option: { name: 'iPhone' }, color: '#EF4444', fourD: generate4DNumbers() },
//       { id: 'VT-002', userName: 'Bob Smith', option: { name: 'Samsung' }, color: '#10B981', fourD: generate4DNumbers() },
//       { id: 'VT-003', userName: 'Carol Davis', option: { name: 'Google' }, color: '#F59E0B', fourD: generate4DNumbers() },
//       { id: 'VT-004', userName: 'David Wilson', option: { name: 'OnePlus' }, color: '#8B5CF6', fourD: generate4DNumbers() }
//     ];
//     setBallsInMachine(mockVoters);
//     setBlockchainHash('0x' + Math.random().toString(16).substr(2, 40));
//   }, []);

//   // Machine rotation animation
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setMachineRotation(prev => (prev + 1.5) % 360);
//     }, 50);
//     return () => clearInterval(interval);
//   }, []);

//   const handlePayment = () => {
//     setShowPayment(true);
//     setTimeout(() => {
//       setPaymentCompleted(true);
//       setShowPayment(false);
//       setCurrentStep(1);
//     }, 3000);
//   };

//   const handleVoteSubmit = () => {
//     if (!selectedOption) return;
    
//     const fourD = generate4DNumbers();
//     setFourDNumbers(fourD);
//     setVoteFlying(true);
    
//     setTimeout(() => {
//       const newBall = {
//         id: userVoteId,
//         userName,
//         option: selectedOption,
//         color: '#3B82F6',
//         fourD: fourD
//       };
//       setBallsInMachine(prev => [...prev, newBall]);
      
//       const receipt = generateDigitalReceipt(selectedOption);
//       setDigitalReceipt(receipt);
      
//       setVoteFlying(false);
//       setCurrentStep(2);
//     }, 2000);
//   };

//   const startLottery = () => {
//     setLotteryRunning(true);
//     setCurrentStep(3);
    
//     setTimeout(() => {
//       const totalDimensions = ballsInMachine.reduce((sum, ball) => {
//         return sum + parseInt(ball.fourD?.masterNumber || '0');
//       }, 0);
      
//       const winningIndex = totalDimensions % ballsInMachine.length;
//       const randomWinner = ballsInMachine[winningIndex];
      
//       setWinner(randomWinner);
//       setLotteryRunning(false);
//       setCurrentStep(4);
//     }, 4000);
//   };

//   const resetDemo = () => {
//     setCurrentStep(electionData.isPaid && !paymentCompleted ? 0 : 1);
//     setSelectedOption(null);
//     setWinner(null);
//     setLotteryRunning(false);
//     setDigitalReceipt(null);
//     setShowReceipt(false);
//     setVoteFlying(false);
//   };

//   // 4D Lottery Machine
//   const LotteryMachine = () => (
//     <div className="relative mx-auto w-96 h-96">
//       <div 
//         className="relative w-full h-full transition-transform duration-100"
//         style={{ 
//           transform: `rotateY(${machineRotation}deg) rotateX(${Math.sin(machineRotation * Math.PI / 180) * 15}deg)` 
//         }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-200 rounded-full border-8 border-purple-400 shadow-2xl opacity-80">
//           <div className="absolute inset-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full border-4 border-blue-300 opacity-70">
//             <div className="absolute inset-4 bg-gradient-to-br from-transparent to-purple-50 rounded-full border-2 border-purple-200">
//               {ballsInMachine.map((ball, index) => {
//                 const time = Date.now() / 1000;
//                 const angle1 = (index * 360) / ballsInMachine.length + time * 15;
//                 const angle2 = (index * 180) / ballsInMachine.length + time * 10;
//                 const radius1 = 45 + Math.sin(time + index) * 15;
//                 const radius2 = 30 + Math.cos(time + index * 2) * 10;
                
//                 const x = Math.cos((angle1 * Math.PI) / 180) * radius1;
//                 const y = Math.sin((angle1 * Math.PI) / 180) * radius1;
//                 const z = Math.cos((angle2 * Math.PI) / 180) * radius2;
                
//                 return (
//                   <div
//                     key={ball.id}
//                     className={`absolute w-8 h-8 rounded-full shadow-xl transform transition-all duration-500 ${
//                       lotteryRunning ? 'animate-pulse' : ''
//                     }`}
//                     style={{
//                       left: `calc(50% + ${x}px)`,
//                       top: `calc(50% + ${y}px)`,
//                       backgroundColor: winner?.id === ball.id ? '#FFD700' : ball.color,
//                       transform: `scale(${winner?.id === ball.id ? 2 : 1}) translateZ(${z}px)`,
//                       boxShadow: winner?.id === ball.id 
//                         ? '0 0 25px #FFD700, 0 0 50px #FFD700' 
//                         : '0 4px 12px rgba(0,0,0,0.3)',
//                       zIndex: winner?.id === ball.id ? 20 : 1
//                     }}
//                   >
//                     <div className="w-full h-full rounded-full bg-gradient-to-br from-white/40 to-transparent">
//                       {ball.fourD && (
//                         <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-gray-700 bg-white/80 px-1 rounded">
//                           {ball.fourD.masterNumber}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
        
//         <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center">
//           <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg">
//             4D Lottery Machine
//           </div>
//           <div className="text-sm text-gray-600 mt-2">
//             {ballsInMachine.length} votes • ${electionData.prizeAmount.toLocaleString()} prize
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Flying Vote Animation
//   const FlyingVote = () => (
//     <div 
//       ref={flyingVoteRef}
//       className={`fixed w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transform transition-all duration-2000 z-50 ${
//         voteFlying ? 'animate-bounce' : ''
//       }`}
//       style={{
//         left: voteFlying ? '50%' : '20%',
//         top: voteFlying ? '30%' : '60%',
//         transform: voteFlying ? 'translate(-50%, -50%) scale(0.5)' : 'translate(-50%, -50%) scale(1)'
//       }}
//     >
//       VOTE
//     </div>
//   );

//   // Digital Receipt Modal
//   const DigitalReceiptModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg max-w-md w-full p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-bold flex items-center gap-2">
//             <DocumentTextIcon className="h-5 w-5" />
//             Digital Receipt
//           </h3>
//           <button onClick={() => setShowReceipt(false)}>
//             <XMarkIcon className="h-5 w-5" />
//           </button>
//         </div>
        
//         {digitalReceipt && (
//           <div className="space-y-3 text-sm">
//             <div className="border-b pb-2">
//               <div className="font-bold text-green-600">VOTE VERIFIED ✓</div>
//             </div>
            
//             <div className="grid grid-cols-2 gap-2">
//               <div><strong>Receipt ID:</strong></div>
//               <div className="font-mono text-xs">{digitalReceipt.receiptId}</div>
              
//               <div><strong>Vote ID:</strong></div>
//               <div className="font-mono text-xs">{digitalReceipt.voteId}</div>
              
//               <div><strong>Choice:</strong></div>
//               <div>{digitalReceipt.choice}</div>
              
//               <div><strong>Blockchain TX:</strong></div>
//               <div className="font-mono text-xs break-all">{digitalReceipt.blockchainTx}</div>
//             </div>
            
//             {digitalReceipt.fourDNumbers && (
//               <div className="bg-purple-50 p-3 rounded border">
//                 <div className="font-bold text-purple-800 mb-2">4D Lottery Numbers:</div>
//                 <div className="grid grid-cols-2 gap-1 text-xs">
//                   <div>D1: {digitalReceipt.fourDNumbers.dimension1}</div>
//                   <div>D2: {digitalReceipt.fourDNumbers.dimension2}</div>
//                   <div>D3: {digitalReceipt.fourDNumbers.dimension3}</div>
//                   <div>D4: {digitalReceipt.fourDNumbers.dimension4}</div>
//                   <div className="col-span-2 font-bold text-center mt-1">
//                     Master: {digitalReceipt.fourDNumbers.masterNumber}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   useEffect(() => {
//     if (electionData.isPaid && !paymentCompleted) {
//       setCurrentStep(0);
//     }
//   }, [electionData.isPaid, paymentCompleted]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold">{electionData.title}</h2>
//               <p className="opacity-90 mt-1">{electionData.description}</p>
//             </div>
//             <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full">
//               <XMarkIcon className="h-6 w-6" />
//             </button>
//           </div>
          
//           <div className="mt-4 bg-white/20 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <GiftIcon className="h-6 w-6 text-yellow-300" />
//                 <span className="font-bold text-lg">${electionData.prizeAmount.toLocaleString()}</span>
//               </div>
//               <div className="text-right">
//                 <div className="text-sm opacity-90">Winners</div>
//                 <div className="font-bold">{electionData.winnerCount}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           {/* Payment Step */}
//           {currentStep === 0 && electionData.isPaid && (
//             <div className="space-y-6 text-center">
//               <div className="text-6xl">💳</div>
//               <h3 className="text-2xl font-bold">Secure Payment Required</h3>
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
//                 <div className="text-lg font-bold text-blue-900">
//                   Participation Fee: ${electionData.participationFee}
//                 </div>
//               </div>
//               {showPayment ? (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                   <div className="flex items-center justify-center gap-2 text-yellow-800">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
//                     <span className="font-bold">Processing Payment...</span>
//                   </div>
//                 </div>
//               ) : (
//                 <button
//                   onClick={handlePayment}
//                   className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 mx-auto"
//                 >
//                   <CreditCardIcon className="h-5 w-5" />
//                   Pay Now & Enter Lottery
//                 </button>
//               )}
//             </div>
//           )}

//           {/* Voting Step */}
//           {currentStep === 1 && (
//             <div className="space-y-6">
//               <h3 className="text-xl font-bold text-center">Cast Your Vote</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 {electionData.options.map((option) => (
//                   <button
//                     key={option.id}
//                     onClick={() => setSelectedOption(option)}
//                     className={`p-6 border-2 rounded-xl transition-all hover:shadow-lg ${
//                       selectedOption?.id === option.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
//                     }`}
//                   >
//                     <div className="text-4xl mb-3">{option.emoji}</div>
//                     <div className="font-bold text-lg">{option.name}</div>
//                   </button>
//                 ))}
//               </div>
              
//               <div className="text-center">
//                 <button
//                   onClick={handleVoteSubmit}
//                   disabled={!selectedOption}
//                   className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-purple-700"
//                 >
//                   Submit Vote & Enter 4D Lottery
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Vote Confirmation */}
//           {currentStep === 2 && (
//             <div className="space-y-6 text-center">
//               <div className="text-6xl">🎉</div>
//               <h3 className="text-2xl font-bold text-green-600">Vote Successfully Submitted!</h3>
              
//               <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="font-medium">Vote ID:</span>
//                     <span className="text-purple-600 font-mono">{userVoteId}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-medium">Choice:</span>
//                     <span>{selectedOption?.name}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-medium">Blockchain TX:</span>
//                     <span className="text-blue-600 font-mono text-xs">{blockchainHash}</span>
//                   </div>
//                   {fourDNumbers && (
//                     <div className="flex justify-between">
//                       <span className="font-medium">4D Master #:</span>
//                       <span className="text-purple-600 font-mono">{fourDNumbers.masterNumber}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               <div className="flex gap-3 justify-center">
//                 <button
//                   onClick={() => setShowReceipt(true)}
//                   className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
//                 >
//                   <DocumentTextIcon className="h-4 w-4" />
//                   View Receipt
//                 </button>
//               </div>

//               <LotteryMachine />

//               <button
//                 onClick={startLottery}
//                 className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 flex items-center gap-2 mx-auto"
//               >
//                 <SparklesIcon className="h-5 w-5" />
//                 Start 4D Lottery Draw
//               </button>
//             </div>
//           )}

//           {/* Lottery Draw */}
//           {currentStep === 3 && (
//             <div className="space-y-6 text-center">
//               <h3 className="text-2xl font-bold">🎰 4D Quantum Lottery Draw</h3>
//               <LotteryMachine />
//               {lotteryRunning && (
//                 <div className="text-lg font-bold text-purple-600">
//                   4D Cryptographically Secure Selection
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Results */}
//           {currentStep === 4 && winner && (
//             <div className="space-y-6 text-center">
//               <div className="text-6xl">🏆</div>
//               <h3 className="text-3xl font-bold text-yellow-600">4D Lottery Winner Selected!</h3>
              
//               <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-8 max-w-md mx-auto">
//                 <TrophyIcon className="h-16 w-16 mx-auto mb-4" />
//                 <div className="text-2xl font-bold">{winner.userName}</div>
//                 <div className="text-lg opacity-90">Vote ID: {winner.id}</div>
                
//                 {winner.fourD && (
//                   <div className="bg-white/20 rounded-lg p-3 mt-4">
//                     <div className="text-sm opacity-90 mb-1">Winning 4D Combination:</div>
//                     <div className="font-mono text-lg">{winner.fourD.masterNumber}</div>
//                   </div>
//                 )}
                
//                 <div className="bg-white/20 rounded-lg p-4 mt-4">
//                   <div className="text-3xl font-bold">${electionData.prizeAmount.toLocaleString()}</div>
//                   <div className="text-sm opacity-90">Prize Amount</div>
//                 </div>
//               </div>
              
//               <button
//                 onClick={resetDemo}
//                 className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium"
//               >
//                 Try Another Demo
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {voteFlying && <FlyingVote />}
//       {showReceipt && <DigitalReceiptModal />}
//     </div>
//   );
// };

// export default LotteryVotingDemo;
// import React, { useState, useEffect } from 'react';
// import {
//   XMarkIcon,
//   GiftIcon,
//   CheckCircleIcon,
//   TrophyIcon,
//   SparklesIcon,
//   CreditCardIcon
// } from '@heroicons/react/24/outline';

// const LotteryVotingDemo = ({ election, onClose }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [userName] = useState('Demo User');
//   const [userVoteId] = useState('VT-2025-' + Math.floor(Math.random() * 10000));
//   const [lotteryRunning, setLotteryRunning] = useState(false);
//   const [winner, setWinner] = useState(null);
//   const [ballsInMachine, setBallsInMachine] = useState([]);
//   const [machineRotation, setMachineRotation] = useState(0);
//   const [showPayment, setShowPayment] = useState(false);
//   const [paymentCompleted, setPaymentCompleted] = useState(false);

//   // Election data
//   const electionData = {
//     title: election?.title || "Best Smartphone 2025",
//     description: election?.description || "Vote for the best smartphone and win prizes!",
//     prizeAmount: election?.reward_amount ? parseFloat(election.reward_amount) : 50000,
//     winnerCount: election?.winner_count || 3,
//     isPaid: election?.pricing_type !== 'free',
//     participationFee: election?.participation_fee ? parseFloat(election.participation_fee) : 10,
//     options: [
//       { id: 1, name: "iPhone 16 Pro Max", votes: 423, emoji: "📱" },
//       { id: 2, name: "Samsung Galaxy S25 Ultra", votes: 387, emoji: "📱" },
//       { id: 3, name: "Google Pixel 9 Pro", votes: 298, emoji: "📱" },
//       { id: 4, name: "OnePlus 13 Pro", votes: 139, emoji: "📱" }
//     ]
//   };

//   // Initialize mock voters
//   useEffect(() => {
//     const mockVoters = [
//       { id: 'VT-001', userName: 'Alice Johnson', option: { name: 'Option A' }, color: '#EF4444' },
//       { id: 'VT-002', userName: 'Bob Smith', option: { name: 'Option B' }, color: '#10B981' },
//       { id: 'VT-003', userName: 'Carol Davis', option: { name: 'Option C' }, color: '#F59E0B' },
//       { id: 'VT-004', userName: 'David Wilson', option: { name: 'Option D' }, color: '#8B5CF6' }
//     ];
//     setBallsInMachine(mockVoters);
//   }, []);

//   // Machine rotation
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setMachineRotation(prev => (prev + 2) % 360);
//     }, 50);
//     return () => clearInterval(interval);
//   }, []);

//   const handlePayment = () => {
//     setShowPayment(true);
//     setTimeout(() => {
//       setPaymentCompleted(true);
//       setShowPayment(false);
//       setCurrentStep(1);
//     }, 3000);
//   };

//   const handleVoteSubmit = () => {
//     if (!selectedOption) return;
//     const newBall = {
//       id: userVoteId,
//       userName,
//       option: selectedOption,
//       color: '#3B82F6'
//     };
//     setBallsInMachine(prev => [...prev, newBall]);
//     setCurrentStep(2);
//   };

//   const startLottery = () => {
//     setLotteryRunning(true);
//     setCurrentStep(3);
//     setTimeout(() => {
//       const randomWinner = ballsInMachine[Math.floor(Math.random() * ballsInMachine.length)];
//       setWinner(randomWinner);
//       setLotteryRunning(false);
//       setCurrentStep(4);
//     }, 3000);
//   };

//   const resetDemo = () => {
//     setCurrentStep(electionData.isPaid && !paymentCompleted ? 0 : 1);
//     setSelectedOption(null);
//     setWinner(null);
//     setLotteryRunning(false);
//   };

//   // Lottery Machine Component
//   const LotteryMachine = () => (
//     <div className="relative mx-auto w-80 h-80">
//       <div className="relative w-full h-full" style={{ transform: `rotateY(${machineRotation}deg)` }}>
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full border-8 border-blue-300 shadow-2xl opacity-80">
//           <div className="absolute inset-4 bg-gradient-to-br from-transparent to-blue-50 rounded-full border-4 border-blue-200">
//             {ballsInMachine.map((ball, index) => {
//               const time = Date.now() / 1000;
//               const angle = (index * 360) / ballsInMachine.length + time * 20;
//               const radius = 50 + Math.sin(time + index) * 10;
//               const x = Math.cos((angle * Math.PI) / 180) * radius;
//               const y = Math.sin((angle * Math.PI) / 180) * radius;
              
//               return (
//                 <div
//                   key={ball.id}
//                   className={`absolute w-6 h-6 rounded-full shadow-lg ${lotteryRunning ? 'animate-bounce' : ''}`}
//                   style={{
//                     left: `calc(50% + ${x}px)`,
//                     top: `calc(50% + ${y}px)`,
//                     backgroundColor: winner?.id === ball.id ? '#FFD700' : ball.color,
//                     transform: winner?.id === ball.id ? 'scale(1.5)' : 'scale(1)',
//                     boxShadow: winner?.id === ball.id ? '0 0 15px #FFD700' : '0 2px 4px rgba(0,0,0,0.2)'
//                   }}
//                 >
//                   <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent"></div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   useEffect(() => {
//     if (electionData.isPaid && !paymentCompleted) {
//       setCurrentStep(0);
//     }
//   }, [electionData.isPaid, paymentCompleted]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold">{electionData.title}</h2>
//               <p className="opacity-90 mt-1">{electionData.description}</p>
//             </div>
//             <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full">
//               <XMarkIcon className="h-6 w-6" />
//             </button>
//           </div>
          
//           <div className="mt-4 bg-white/20 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <GiftIcon className="h-6 w-6 text-yellow-300" />
//                 <span className="font-bold text-lg">${electionData.prizeAmount.toLocaleString()}</span>
//               </div>
//               <div className="text-right">
//                 <div className="text-sm opacity-90">Winners</div>
//                 <div className="font-bold">{electionData.winnerCount}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           {/* Payment Step */}
//           {currentStep === 0 && electionData.isPaid && (
//             <div className="space-y-6 text-center">
//               <div className="text-6xl">💳</div>
//               <h3 className="text-2xl font-bold">Payment Required</h3>
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
//                 <div className="text-lg font-bold text-blue-900">
//                   Participation Fee: ${electionData.participationFee}
//                 </div>
//               </div>
//               {showPayment ? (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                   <div className="flex items-center justify-center gap-2 text-yellow-800">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
//                     <span className="font-bold">Processing Payment...</span>
//                   </div>
//                 </div>
//               ) : (
//                 <button
//                   onClick={handlePayment}
//                   className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 mx-auto"
//                 >
//                   <CreditCardIcon className="h-5 w-5" />
//                   Pay Now & Enter Lottery
//                 </button>
//               )}
//             </div>
//           )}

//           {/* Voting Step */}
//           {currentStep === 1 && (
//             <div className="space-y-6">
//               <h3 className="text-xl font-bold text-center">Cast Your Vote</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 {electionData.options.map((option) => (
//                   <button
//                     key={option.id}
//                     onClick={() => setSelectedOption(option)}
//                     className={`p-6 border-2 rounded-xl ${
//                       selectedOption?.id === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
//                     }`}
//                   >
//                     <div className="text-4xl mb-3">{option.emoji}</div>
//                     <div className="font-bold text-lg">{option.name}</div>
//                   </button>
//                 ))}
//               </div>
//               <div className="text-center">
//                 <button
//                   onClick={handleVoteSubmit}
//                   disabled={!selectedOption}
//                   className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50"
//                 >
//                   Submit Vote & Enter Lottery
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Vote Confirmation */}
//           {currentStep === 2 && (
//             <div className="space-y-6 text-center">
//               <div className="text-6xl">🎉</div>
//               <h3 className="text-2xl font-bold text-green-600">Vote Submitted!</h3>
//               <LotteryMachine />
//               <button
//                 onClick={startLottery}
//                 className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto"
//               >
//                 <SparklesIcon className="h-5 w-5" />
//                 Start Lottery Draw
//               </button>
//             </div>
//           )}

//           {/* Lottery Draw */}
//           {currentStep === 3 && (
//             <div className="space-y-6 text-center">
//               <h3 className="text-2xl font-bold">🎰 Live Lottery Draw</h3>
//               <LotteryMachine />
//               {lotteryRunning && (
//                 <div className="text-lg font-bold text-purple-600">
//                   Cryptographically Secure Random Selection
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Results */}
//           {currentStep === 4 && winner && (
//             <div className="space-y-6 text-center">
//               <div className="text-6xl">🏆</div>
//               <h3 className="text-3xl font-bold text-yellow-600">We Have a Winner!</h3>
//               <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-8 max-w-md mx-auto">
//                 <TrophyIcon className="h-16 w-16 mx-auto mb-4" />
//                 <div className="text-2xl font-bold">{winner.userName}</div>
//                 <div className="text-3xl font-bold mt-4">${electionData.prizeAmount.toLocaleString()}</div>
//               </div>
//               <button
//                 onClick={resetDemo}
//                 className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold"
//               >
//                 Try Another Demo
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LotteryVotingDemo;