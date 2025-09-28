//WIth question preview
import React from 'react';
import { 
  Eye, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Gift, 
  Shield, 
  Globe, 
  Palette,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Edit,
  Video,
  MessageSquare
} from 'lucide-react';
/*eslint-disable*/
const ElectionPreview = ({ formData, errors = {}, election = null, countries = [] }) => {
  const formatDate = (dateObj) => {
    if (!dateObj?.date || !dateObj?.time) return 'Not set';
    
    try {
      const dateTime = new Date(`${dateObj.date}T${dateObj.time}`);
      if (isNaN(dateTime.getTime())) return 'Invalid Date';
      
      return dateTime.toLocaleDateString() + ' at ' + dateTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getDuration = () => {
    if (!formData.startDate?.date || !formData.endDate?.date || 
        !formData.startDate?.time || !formData.endDate?.time) {
      return 'Duration not calculated';
    }
    
    try {
      const start = new Date(`${formData.startDate.date}T${formData.startDate.time}`);
      const end = new Date(`${formData.endDate.date}T${formData.endDate.time}`);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 'Invalid duration';
      }
      
      const diff = end - start;
      
      if (diff <= 0) return 'Invalid duration';
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      let duration = "";
      if (days > 0) duration += `${days} day${days > 1 ? 's' : ''} `;
      if (hours > 0) duration += `${hours} hour${hours > 1 ? 's' : ''} `;
      if (minutes > 0) duration += `${minutes} minute${minutes > 1 ? 's' : ''}`;
      
      return duration.trim() || 'Less than a minute';
    } catch (error) {
      return 'Duration calculation error';
    }
  };

  const getVotingTypeDisplay = () => {
    switch (formData.votingType) {
      case 'plurality': return { name: 'Plurality Voting', icon: '🗳️', desc: 'One choice per voter' };
      case 'ranked_choice': return { name: 'Ranked Choice Voting', icon: '📊', desc: 'Rank candidates by preference' };
      case 'approval': return { name: 'Approval Voting', icon: '✅', desc: 'Approve multiple candidates' };
      default: return { name: 'Not set', icon: '❓', desc: '' };
    }
  };

  const getPermissionDisplay = () => {
    switch (formData.permissionToVote) {
      case 'world_citizens': return { name: 'Open to Everyone', icon: '🌍', desc: 'Anyone in the world can vote' };
      case 'registered_members': return { name: 'Registered Members Only', icon: '👥', desc: 'Organization members only' };
      case 'country_specific': {
        const selectedCountries = getSelectedCountriesList();
        let desc = '';
        
        if (selectedCountries.length === 0) {
          desc = 'No countries selected';
        } else if (selectedCountries.length <= 3) {
          desc = selectedCountries.join(', ');
        } else {
          desc = `${selectedCountries.slice(0, 3).join(', ')} and ${selectedCountries.length - 3} more`;
        }
        
        return { name: 'Country Specific', icon: '🏳️', desc };
      }
      default: return { name: 'Not set', icon: '❓', desc: '' };
    }
  };

  const getSelectedCountriesList = () => {
    if (!formData.countries || formData.countries.length === 0) {
      return [];
    }
    
    // Handle case where formData.countries contains objects
    if (typeof formData.countries[0] === 'object') {
      return formData.countries
        .map(country => country.country_name || country.name || 'Unknown Country')
        .sort();
    }
    
    // Handle case where formData.countries contains IDs and we have countries lookup
    if (countries && countries.length > 0) {
      return countries
        .filter(country => formData.countries.includes(country.id))
        .map(country => country.country_name)
        .sort();
    }
    
    // Fallback - just return the IDs as strings
    return formData.countries.map(countryId => `Country ${countryId}`);
  };

  const getAuthMethodDisplay = () => {
    switch (formData.authMethod) {
      case 'passkey': return { name: 'Passkey Authentication', icon: '🔐' };
      case 'oauth': return { name: 'OAuth Social Login', icon: '👤' };
      case 'magic_link': return { name: 'Magic Link', icon: '✉️' };
      case 'email_password': return { name: 'Email & Password', icon: '🔒' };
      default: return { name: 'Not set', icon: '❓' };
    }
  };

  const getQuestionTypeIcon = (questionType) => {
    switch (questionType) {
      case 'multiple_choice': return '📋';
      case 'open_answer': return '✍️';
      case 'image_based': return '🖼️';
      case 'comparison': return '⚖️';
      default: return '❓';
    }
  };

  const getQuestionTypeName = (questionType) => {
    switch (questionType) {
      case 'multiple_choice': return 'Multiple Choice';
      case 'open_answer': return 'Open Answer';
      case 'image_based': return 'Image Based';
      case 'comparison': return 'Comparison';
      default: return 'Unknown Type';
    }
  };

  const PreviewCard = ({ title, children, icon: Icon, status = 'complete' }) => (
    <div className={`border rounded-lg p-4 ${status === 'incomplete' ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Icon className="w-5 h-5 mr-2" />
          {title}
        </h3>
        {status === 'complete' ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-orange-500" />
        )}
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Election Preview</h2>
        <p className="mt-2 text-gray-600">
          Review all settings before publishing your election.
        </p>
      </div>

      {/* Main Election Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {formData.logoBrandingUrl && (
              <img
                src={formData.logoBrandingUrl}
                alt="Logo"
                className="w-12 h-12 object-contain bg-white rounded p-1"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {formData.title || 'Untitled Election'}
              </h1>
              {formData.customVotingUrl && (
                <div className="flex items-center space-x-2 text-sm text-blue-600 mt-1">
                  <ExternalLink className="w-4 h-4" />
                  <span>vottery.com/vote/{formData.customVotingUrl}</span>
                </div>
              )}
            </div>
          </div>
          <Eye className="w-6 h-6 text-gray-400" />
        </div>

        {formData.topicImageUrl && (
          <img
            src={formData.topicImageUrl}
            alt="Topic"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        {/* <p className="text-gray-700 mb-4">
          {formData.description || 'No description provided.'}
        </p> */}
        <div 
  className="text-gray-700 mb-4"
  dangerouslySetInnerHTML={{ 
    __html: formData.description || 'No description provided.' 
  }}
/>

        {formData.topicVideoUrl && (
          <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Video className="w-4 h-4" />
              <span>Video content: {formData.topicVideoUrl}</span>
            </div>
          </div>
        )}
      </div>

      {/* Configuration Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Schedule */}
        <PreviewCard 
          title="Schedule" 
          icon={Calendar}
          status={formData.startDate?.date && formData.endDate?.date ? 'complete' : 'incomplete'}
        >
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Start:</span>
              <span className="font-medium">{formatDate(formData.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">End:</span>
              <span className="font-medium">{formatDate(formData.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{getDuration()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Timezone:</span>
              <span className="font-medium">{formData.timezone || 'UTC'}</span>
            </div>
          </div>
        </PreviewCard>

        {/* Questions & Answers Overview */}
        <PreviewCard 
          title="Questions & Answers" 
          icon={MessageSquare}
          status={formData.questions && formData.questions.length > 0 ? 'complete' : 'incomplete'}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Questions:</span>
              <span className="font-medium">{formData.questions?.length || 0}</span>
            </div>
            
            {formData.questions && formData.questions.length > 0 ? (
              <>
                {/* Question Types Breakdown */}
                <div className="space-y-2">
                  {formData.questions.slice(0, 3).map((question, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getQuestionTypeIcon(question.questionType)}</span>
                        <span className="text-gray-600">Q{index + 1}:</span>
                        <span className="font-medium truncate max-w-32">
                          {question.questionText || 'Untitled'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {getQuestionTypeName(question.questionType)}
                      </span>
                    </div>
                  ))}
                  
                  {formData.questions.length > 3 && (
                    <div className="text-sm text-gray-500 text-center py-2">
                      ... and {formData.questions.length - 3} more question{formData.questions.length - 3 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Question Types Summary */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['multiple_choice', 'open_answer', 'image_based', 'comparison'].map(type => {
                      const count = formData.questions.filter(q => q.questionType === type).length;
                      if (count === 0) return null;
                      return (
                        <div key={type} className="flex items-center space-x-1">
                          <span>{getQuestionTypeIcon(type)}</span>
                          <span className="text-gray-600">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total Answers */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Answer Options:</span>
                  <span className="font-medium">
                    {formData.questions.reduce((total, question) => 
                      total + (question.answers?.length || 0), 0
                    )}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-orange-600">No questions configured yet</p>
            )}
          </div>
        </PreviewCard>

        {/* Voting Configuration */}
        <PreviewCard title="Voting Method" icon={Users}>
          <div className="space-y-3">
            <div>
              <span className="text-2xl mr-2">{getVotingTypeDisplay().icon}</span>
              <span className="font-medium">{getVotingTypeDisplay().name}</span>
              <p className="text-sm text-gray-600 mt-1">{getVotingTypeDisplay().desc}</p>
            </div>
          </div>
        </PreviewCard>

        {/* Access Control */}
        <PreviewCard title="Access Control" icon={Shield}>
          <div className="space-y-3">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{getPermissionDisplay().icon}</span>
                <span className="font-medium">{getPermissionDisplay().name}</span>
              </div>
              <p className="text-sm text-gray-600">{getPermissionDisplay().desc}</p>
            </div>
            
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">{getAuthMethodDisplay().icon}</span>
                <span className="font-medium">{getAuthMethodDisplay().name}</span>
              </div>
              {formData.biometricRequired && (
                <p className="text-sm text-blue-600">🔒 Biometric authentication required</p>
              )}
            </div>
          </div>
        </PreviewCard>

        {/* Financial Settings */}
        <PreviewCard title="Financial Settings" icon={DollarSign}>
          <div className="space-y-3">
            {/* Pricing Display */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pricing Type:</span>
              <span className="font-medium">
                {formData.pricingType === 'free' && 'Free'}
                {formData.pricingType === 'general' && 'General Fee'}
                {formData.pricingType === 'regional' && 'Regional Pricing'}
                {!formData.pricingType && 'Free'}
              </span>
            </div>
            
            {/* General Fee Display */}
            {formData.pricingType === 'general' && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Participation Fee:</span>
                <span className="font-medium">${formData.participationFee || 0}</span>
              </div>
            )}
            
            {/* Regional Fees Display */}
            {formData.pricingType === 'regional' && formData.regionalFees && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <div className="text-sm font-medium text-blue-800 mb-2">Regional Fees:</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {Object.entries(formData.regionalFees).map(([region, fee]) => {
                    const regionNames = {
                      region1: 'US & Canada',
                      region2: 'W. Europe',
                      region3: 'E. Europe & Russia',
                      region4: 'Africa',
                      region5: 'Latin America',
                      region6: 'Middle East & Asia',
                      region7: 'Australasia',
                      region8: 'China & Hong Kong'
                    };
                    // Clean display of the fee - remove unnecessary decimals
                    const displayFee = Number(fee) % 1 === 0 ? Number(fee).toString() : Number(fee).toFixed(2);
                    return (
                      <div key={region} className="flex justify-between">
                        <span className="text-blue-700">{regionNames[region]}:</span>
                        <span className="font-medium text-blue-800">${displayFee}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Processing Fee Display */}
            {(formData.pricingType === 'general' || formData.pricingType === 'regional') && formData.processingFeePercentage > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Processing Fee:</span>
                <span className="font-medium">{formData.processingFeePercentage}%</span>
              </div>
            )}
            
            {/* Lottery Display */}
            {formData.isLotterized && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Gift className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Lottery Enabled</span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-green-700">Reward Type:</span>
                    <span className="font-medium text-green-800">
                      {formData.rewardType === 'monetary' && 'Monetary'}
                      {formData.rewardType === 'non-monetary' && 'Non-monetary'}
                      {formData.rewardType === 'revenue-share' && 'Revenue Share'}
                    </span>
                  </div>
                  
                  {formData.rewardType === 'monetary' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-green-700">Prize Pool:</span>
                        <span className="font-medium text-green-800">${formData.rewardAmount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Winners:</span>
                        <span className="font-medium text-green-800">{formData.winnerCount || 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Per Winner:</span>
                        <span className="font-medium text-green-800">
                          ${formData.rewardAmount && formData.winnerCount ? (formData.rewardAmount / formData.winnerCount).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {formData.rewardType === 'non-monetary' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-green-700">Prize:</span>
                        <span className="font-medium text-green-800 text-xs">
                          {formData.nonMonetaryReward ? 
                            (formData.nonMonetaryReward.length > 30 ? 
                              formData.nonMonetaryReward.substring(0, 30) + '...' : 
                              formData.nonMonetaryReward
                            ) : 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Winners:</span>
                        <span className="font-medium text-green-800">{formData.winnerCount || 1}</span>
                      </div>
                      {formData.rewardAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-green-700">Est. Value:</span>
                          <span className="font-medium text-green-800">${formData.rewardAmount}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {formData.rewardType === 'revenue-share' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-green-700">Projected Revenue:</span>
                        <span className="font-medium text-green-800">${formData.projectedRevenue || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Share Percentage:</span>
                        <span className="font-medium text-green-800">{formData.revenueSharePercentage || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Winners:</span>
                        <span className="font-medium text-green-800">{formData.winnerCount || 1}</span>
                      </div>
                      {formData.projectedRevenue && formData.revenueSharePercentage && formData.winnerCount && (
                        <div className="flex justify-between">
                          <span className="text-green-700">Est. Per Winner:</span>
                          <span className="font-medium text-green-800">
                            ${((formData.projectedRevenue * formData.revenueSharePercentage) / 100 / formData.winnerCount).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </PreviewCard>

        {/* Branding */}
        <PreviewCard title="Branding" icon={Palette}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: formData.brandColors?.primary || '#3B82F6' }}
              ></div>
              <span className="text-sm">Primary: {formData.brandColors?.primary || '#3B82F6'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: formData.brandColors?.secondary || '#64748B' }}
              ></div>
              <span className="text-sm">Secondary: {formData.brandColors?.secondary || '#64748B'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: formData.brandColors?.accent || '#10B981' }}
              ></div>
              <span className="text-sm">Accent: {formData.brandColors?.accent || '#10B981'}</span>
            </div>
            
            {formData.supportsMultilang && (
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600">Multi-language support enabled</span>
                </div>
              </div>
            )}
          </div>
        </PreviewCard>

        {/* Results Display */}
        <PreviewCard title="Results & Features" icon={Eye}>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Live Results:</span>
              <span className="font-medium">{formData.showLiveResults ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vote Editing:</span>
              <span className="font-medium">{formData.allowVoteEditing ? 'Allowed' : 'Not Allowed'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Language:</span>
              <span className="font-medium">{formData.primaryLanguage || 'en'}</span>
            </div>
          </div>
        </PreviewCard>
      </div>

      {/* Validation Errors */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900">Please fix the following issues:</h4>
              <ul className="text-sm text-red-700 mt-2 space-y-1">
                {Object.entries(errors).map(([key, error]) => (
                  <li key={key}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {Object.keys(errors).length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-900">Election Ready to Publish!</h4>
              <p className="text-sm text-green-700 mt-1">
                Your election is properly configured and ready to be published. Click "Publish Election" to make it live.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Debug Section - Remove after testing */}
     
    </div>
  );
};

export default ElectionPreview;
// //for previewing everything
// //WIth question preview
// import React from 'react';
// import { 
//   Eye, 
//   Calendar, 
//   Clock, 
//   Users, 
//   DollarSign, 
//   Gift, 
//   Shield, 
//   Globe, 
//   Palette,
//   CheckCircle,
//   AlertTriangle,
//   ExternalLink,
//   Edit,
//   Video,
//   MessageSquare
// } from 'lucide-react';
// /*eslint-disable*/
// const ElectionPreview = ({ formData, errors = {}, election = null, countries = [] }) => {
//   const formatDate = (dateObj) => {
//     if (!dateObj?.date || !dateObj?.time) return 'Not set';
    
//     try {
//       const dateTime = new Date(`${dateObj.date}T${dateObj.time}`);
//       if (isNaN(dateTime.getTime())) return 'Invalid Date';
      
//       return dateTime.toLocaleDateString() + ' at ' + dateTime.toLocaleTimeString([], { 
//         hour: '2-digit', 
//         minute: '2-digit' 
//       });
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   const getDuration = () => {
//     if (!formData.startDate?.date || !formData.endDate?.date || 
//         !formData.startDate?.time || !formData.endDate?.time) {
//       return 'Duration not calculated';
//     }
    
//     try {
//       const start = new Date(`${formData.startDate.date}T${formData.startDate.time}`);
//       const end = new Date(`${formData.endDate.date}T${formData.endDate.time}`);
      
//       if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//         return 'Invalid duration';
//       }
      
//       const diff = end - start;
      
//       if (diff <= 0) return 'Invalid duration';
      
//       const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
//       let duration = "";
//       if (days > 0) duration += `${days} day${days > 1 ? 's' : ''} `;
//       if (hours > 0) duration += `${hours} hour${hours > 1 ? 's' : ''} `;
//       if (minutes > 0) duration += `${minutes} minute${minutes > 1 ? 's' : ''}`;
      
//       return duration.trim() || 'Less than a minute';
//     } catch (error) {
//       return 'Duration calculation error';
//     }
//   };

//   const getVotingTypeDisplay = () => {
//     switch (formData.votingType) {
//       case 'plurality': return { name: 'Plurality Voting', icon: '🗳️', desc: 'One choice per voter' };
//       case 'ranked_choice': return { name: 'Ranked Choice Voting', icon: '📊', desc: 'Rank candidates by preference' };
//       case 'approval': return { name: 'Approval Voting', icon: '✅', desc: 'Approve multiple candidates' };
//       default: return { name: 'Not set', icon: '❓', desc: '' };
//     }
//   };

//   const getPermissionDisplay = () => {
//     switch (formData.permissionToVote) {
//       case 'world_citizens': return { name: 'Open to Everyone', icon: '🌍', desc: 'Anyone in the world can vote' };
//       case 'registered_members': return { name: 'Registered Members Only', icon: '👥', desc: 'Organization members only' };
//       case 'country_specific': {
//         const selectedCountries = getSelectedCountriesList();
//         let desc = '';
        
//         if (selectedCountries.length === 0) {
//           desc = 'No countries selected';
//         } else if (selectedCountries.length <= 3) {
//           desc = selectedCountries.join(', ');
//         } else {
//           desc = `${selectedCountries.slice(0, 3).join(', ')} and ${selectedCountries.length - 3} more`;
//         }
        
//         return { name: 'Country Specific', icon: '🏳️', desc };
//       }
//       default: return { name: 'Not set', icon: '❓', desc: '' };
//     }
//   };

//   const getSelectedCountriesList = () => {
//     if (!formData.countries || formData.countries.length === 0) {
//       return [];
//     }
    
//     // Handle case where formData.countries contains objects
//     if (typeof formData.countries[0] === 'object') {
//       return formData.countries
//         .map(country => country.country_name || country.name || 'Unknown Country')
//         .sort();
//     }
    
//     // Handle case where formData.countries contains IDs and we have countries lookup
//     if (countries && countries.length > 0) {
//       return countries
//         .filter(country => formData.countries.includes(country.id))
//         .map(country => country.country_name)
//         .sort();
//     }
    
//     // Fallback - just return the IDs as strings
//     return formData.countries.map(countryId => `Country ${countryId}`);
//   };

//   const getAuthMethodDisplay = () => {
//     switch (formData.authMethod) {
//       case 'passkey': return { name: 'Passkey Authentication', icon: '🔐' };
//       case 'oauth': return { name: 'OAuth Social Login', icon: '👤' };
//       case 'magic_link': return { name: 'Magic Link', icon: '✉️' };
//       case 'email_password': return { name: 'Email & Password', icon: '🔒' };
//       default: return { name: 'Not set', icon: '❓' };
//     }
//   };

//   const getQuestionTypeIcon = (questionType) => {
//     switch (questionType) {
//       case 'multiple_choice': return '📋';
//       case 'open_answer': return '✍️';
//       case 'image_based': return '🖼️';
//       case 'comparison': return '⚖️';
//       default: return '❓';
//     }
//   };

//   const getQuestionTypeName = (questionType) => {
//     switch (questionType) {
//       case 'multiple_choice': return 'Multiple Choice';
//       case 'open_answer': return 'Open Answer';
//       case 'image_based': return 'Image Based';
//       case 'comparison': return 'Comparison';
//       default: return 'Unknown Type';
//     }
//   };

//   const PreviewCard = ({ title, children, icon: Icon, status = 'complete' }) => (
//     <div className={`border rounded-lg p-4 ${status === 'incomplete' ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-white'}`}>
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="font-semibold text-gray-900 flex items-center">
//           <Icon className="w-5 h-5 mr-2" />
//           {title}
//         </h3>
//         {status === 'complete' ? (
//           <CheckCircle className="w-5 h-5 text-green-500" />
//         ) : (
//           <AlertTriangle className="w-5 h-5 text-orange-500" />
//         )}
//       </div>
//       {children}
//     </div>
//   );

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">Election Preview</h2>
//         <p className="mt-2 text-gray-600">
//           Review all settings before publishing your election.
//         </p>
//       </div>

//       {/* Main Election Preview */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex items-center space-x-3">
//             {formData.logoBrandingUrl && (
//               <img
//                 src={formData.logoBrandingUrl}
//                 alt="Logo"
//                 className="w-12 h-12 object-contain bg-white rounded p-1"
//               />
//             )}
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {formData.title || 'Untitled Election'}
//               </h1>
//               {formData.customVotingUrl && (
//                 <div className="flex items-center space-x-2 text-sm text-blue-600 mt-1">
//                   <ExternalLink className="w-4 h-4" />
//                   <span>vottery.com/vote/{formData.customVotingUrl}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//           <Eye className="w-6 h-6 text-gray-400" />
//         </div>

//         {formData.topicImageUrl && (
//           <img
//             src={formData.topicImageUrl}
//             alt="Topic"
//             className="w-full h-48 object-cover rounded-lg mb-4"
//           />
//         )}

//         <p className="text-gray-700 mb-4">
//           {formData.description || 'No description provided.'}
//         </p>

//         {formData.topicVideoUrl && (
//           <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
//             <div className="flex items-center space-x-2 text-sm text-gray-600">
//               <Video className="w-4 h-4" />
//               <span>Video content: {formData.topicVideoUrl}</span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Configuration Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Schedule */}
//         <PreviewCard 
//           title="Schedule" 
//           icon={Calendar}
//           status={formData.startDate?.date && formData.endDate?.date ? 'complete' : 'incomplete'}
//         >
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Start:</span>
//               <span className="font-medium">{formatDate(formData.startDate)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">End:</span>
//               <span className="font-medium">{formatDate(formData.endDate)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Duration:</span>
//               <span className="font-medium">{getDuration()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Timezone:</span>
//               <span className="font-medium">{formData.timezone || 'UTC'}</span>
//             </div>
//           </div>
//         </PreviewCard>

//         {/* Questions & Answers Overview */}
//         <PreviewCard 
//           title="Questions & Answers" 
//           icon={MessageSquare}
//           status={formData.questions && formData.questions.length > 0 ? 'complete' : 'incomplete'}
//         >
//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Total Questions:</span>
//               <span className="font-medium">{formData.questions?.length || 0}</span>
//             </div>
            
//             {formData.questions && formData.questions.length > 0 ? (
//               <>
//                 {/* Question Types Breakdown */}
//                 <div className="space-y-2">
//                   {formData.questions.slice(0, 3).map((question, index) => (
//                     <div key={index} className="flex items-center justify-between text-sm">
//                       <div className="flex items-center space-x-2">
//                         <span className="text-lg">{getQuestionTypeIcon(question.questionType)}</span>
//                         <span className="text-gray-600">Q{index + 1}:</span>
//                         <span className="font-medium truncate max-w-32">
//                           {question.questionText || 'Untitled'}
//                         </span>
//                       </div>
//                       <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                         {getQuestionTypeName(question.questionType)}
//                       </span>
//                     </div>
//                   ))}
                  
//                   {formData.questions.length > 3 && (
//                     <div className="text-sm text-gray-500 text-center py-2">
//                       ... and {formData.questions.length - 3} more question{formData.questions.length - 3 !== 1 ? 's' : ''}
//                     </div>
//                   )}
//                 </div>

//                 {/* Question Types Summary */}
//                 <div className="pt-2 border-t border-gray-100">
//                   <div className="grid grid-cols-2 gap-2 text-xs">
//                     {['multiple_choice', 'open_answer', 'image_based', 'comparison'].map(type => {
//                       const count = formData.questions.filter(q => q.questionType === type).length;
//                       if (count === 0) return null;
//                       return (
//                         <div key={type} className="flex items-center space-x-1">
//                           <span>{getQuestionTypeIcon(type)}</span>
//                           <span className="text-gray-600">{count}</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Total Answers */}
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Total Answer Options:</span>
//                   <span className="font-medium">
//                     {formData.questions.reduce((total, question) => 
//                       total + (question.answers?.length || 0), 0
//                     )}
//                   </span>
//                 </div>
//               </>
//             ) : (
//               <p className="text-sm text-orange-600">No questions configured yet</p>
//             )}
//           </div>
//         </PreviewCard>

//         {/* Voting Configuration */}
//         <PreviewCard title="Voting Method" icon={Users}>
//           <div className="space-y-3">
//             <div>
//               <span className="text-2xl mr-2">{getVotingTypeDisplay().icon}</span>
//               <span className="font-medium">{getVotingTypeDisplay().name}</span>
//               <p className="text-sm text-gray-600 mt-1">{getVotingTypeDisplay().desc}</p>
//             </div>
//           </div>
//         </PreviewCard>

//         {/* Access Control */}
//         <PreviewCard title="Access Control" icon={Shield}>
//           <div className="space-y-3">
//             <div>
//               <div className="flex items-center space-x-2 mb-2">
//                 <span className="text-lg">{getPermissionDisplay().icon}</span>
//                 <span className="font-medium">{getPermissionDisplay().name}</span>
//               </div>
//               <p className="text-sm text-gray-600">{getPermissionDisplay().desc}</p>
//             </div>
            
//             <div className="pt-2 border-t border-gray-100">
//               <div className="flex items-center space-x-2 mb-1">
//                 <span className="text-lg">{getAuthMethodDisplay().icon}</span>
//                 <span className="font-medium">{getAuthMethodDisplay().name}</span>
//               </div>
//               {formData.biometricRequired && (
//                 <p className="text-sm text-blue-600">🔒 Biometric authentication required</p>
//               )}
//             </div>
//           </div>
//         </PreviewCard>

//         {/* Financial Settings */}
//         <PreviewCard title="Financial Settings" icon={DollarSign}>
//           <div className="space-y-3">
//             {/* Pricing Display */}
//             <div className="flex items-center justify-between">
//               <span className="text-gray-600">Pricing Type:</span>
//               <span className="font-medium">
//                 {formData.pricingType === 'free' && 'Free'}
//                 {formData.pricingType === 'general' && 'General Fee'}
//                 {formData.pricingType === 'regional' && 'Regional Pricing'}
//                 {!formData.pricingType && 'Free'}
//               </span>
//             </div>
            
//             {/* General Fee Display */}
//             {formData.pricingType === 'general' && (
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Participation Fee:</span>
//                 <span className="font-medium">${formData.participationFee || 0}</span>
//               </div>
//             )}
            
//             {/* Regional Fees Display */}
//             {formData.pricingType === 'regional' && formData.regionalFees && (
//               <div className="bg-blue-50 border border-blue-200 rounded p-3">
//                 <div className="text-sm font-medium text-blue-800 mb-2">Regional Fees:</div>
//                 <div className="grid grid-cols-2 gap-1 text-xs">
//                   {Object.entries(formData.regionalFees).map(([region, fee]) => {
//                     const regionNames = {
//                       region1: 'US & Canada',
//                       region2: 'W. Europe',
//                       region3: 'E. Europe & Russia',
//                       region4: 'Africa',
//                       region5: 'Latin America',
//                       region6: 'Middle East & Asia',
//                       region7: 'Australasia',
//                       region8: 'China & Hong Kong'
//                     };
//                     return (
//                       <div key={region} className="flex justify-between">
//                         <span className="text-blue-700">{regionNames[region]}:</span>
//                         <span className="font-medium text-blue-800">${fee}</span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
            
//             {/* Processing Fee Display */}
//             {(formData.pricingType === 'general' || formData.pricingType === 'regional') && formData.processingFeePercentage > 0 && (
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-gray-600">Processing Fee:</span>
//                 <span className="font-medium">{formData.processingFeePercentage}%</span>
//               </div>
//             )}
            
//             {/* Lottery Display */}
//             {formData.isLotterized && (
//               <div className="bg-green-50 border border-green-200 rounded p-3">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <Gift className="w-4 h-4 text-green-600" />
//                   <span className="font-medium text-green-800">Lottery Enabled</span>
//                 </div>
//                 <div className="text-sm space-y-1">
//                   <div className="flex justify-between">
//                     <span className="text-green-700">Reward Type:</span>
//                     <span className="font-medium text-green-800">
//                       {formData.rewardType === 'monetary' && 'Monetary'}
//                       {formData.rewardType === 'non-monetary' && 'Non-monetary'}
//                       {formData.rewardType === 'revenue-share' && 'Revenue Share'}
//                     </span>
//                   </div>
                  
//                   {formData.rewardType === 'monetary' && (
//                     <>
//                       <div className="flex justify-between">
//                         <span className="text-green-700">Prize Pool:</span>
//                         <span className="font-medium text-green-800">${formData.rewardAmount || 0}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-green-700">Winners:</span>
//                         <span className="font-medium text-green-800">{formData.winnerCount || 1}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-green-700">Per Winner:</span>
//                         <span className="font-medium text-green-800">
//                           ${formData.rewardAmount && formData.winnerCount ? (formData.rewardAmount / formData.winnerCount).toFixed(2) : '0.00'}
//                         </span>
//                       </div>
//                     </>
//                   )}
                  
//                   {formData.rewardType === 'non-monetary' && (
//                     <>
//                       <div className="flex justify-between">
//                         <span className="text-green-700">Prize:</span>
//                         <span className="font-medium text-green-800 text-xs">
//                           {formData.nonMonetaryReward ? 
//                             (formData.nonMonetaryReward.length > 30 ? 
//                               formData.nonMonetaryReward.substring(0, 30) + '...' : 
//                               formData.nonMonetaryReward
//                             ) : 'Not set'}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-green-700">Winners:</span>
//                         <span className="font-medium text-green-800">{formData.winnerCount || 1}</span>
//                       </div>
//                       {formData.rewardAmount > 0 && (
//                         <div className="flex justify-between">
//                           <span className="text-green-700">Est. Value:</span>
//                           <span className="font-medium text-green-800">${formData.rewardAmount}</span>
//                         </div>
//                       )}
//                     </>
//                   )}
                  
//                   {formData.rewardType === 'revenue-share' && (
//                     <>
//                       <div className="flex justify-between">
//                         <span className="text-green-700">Projected Revenue:</span>
//                         <span className="font-medium text-green-800">${formData.projectedRevenue || 0}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-green-700">Share Percentage:</span>
//                         <span className="font-medium text-green-800">{formData.revenueSharePercentage || 0}%</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-green-700">Winners:</span>
//                         <span className="font-medium text-green-800">{formData.winnerCount || 1}</span>
//                       </div>
//                       {formData.projectedRevenue && formData.revenueSharePercentage && formData.winnerCount && (
//                         <div className="flex justify-between">
//                           <span className="text-green-700">Est. Per Winner:</span>
//                           <span className="font-medium text-green-800">
//                             ${((formData.projectedRevenue * formData.revenueSharePercentage) / 100 / formData.winnerCount).toFixed(2)}
//                           </span>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </PreviewCard>

//         {/* Branding */}
//         <PreviewCard title="Branding" icon={Palette}>
//           <div className="space-y-3">
//             <div className="flex items-center space-x-2">
//               <div
//                 className="w-4 h-4 rounded border"
//                 style={{ backgroundColor: formData.brandColors?.primary || '#3B82F6' }}
//               ></div>
//               <span className="text-sm">Primary: {formData.brandColors?.primary || '#3B82F6'}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div
//                 className="w-4 h-4 rounded border"
//                 style={{ backgroundColor: formData.brandColors?.secondary || '#64748B' }}
//               ></div>
//               <span className="text-sm">Secondary: {formData.brandColors?.secondary || '#64748B'}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div
//                 className="w-4 h-4 rounded border"
//                 style={{ backgroundColor: formData.brandColors?.accent || '#10B981' }}
//               ></div>
//               <span className="text-sm">Accent: {formData.brandColors?.accent || '#10B981'}</span>
//             </div>
            
//             {formData.supportsMultilang && (
//               <div className="pt-2 border-t border-gray-100">
//                 <div className="flex items-center space-x-2">
//                   <Globe className="w-4 h-4 text-blue-500" />
//                   <span className="text-sm text-blue-600">Multi-language support enabled</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </PreviewCard>

//         {/* Results Display */}
//         <PreviewCard title="Results & Features" icon={Eye}>
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Live Results:</span>
//               <span className="font-medium">{formData.showLiveResults ? 'Enabled' : 'Disabled'}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Vote Editing:</span>
//               <span className="font-medium">{formData.allowVoteEditing ? 'Allowed' : 'Not Allowed'}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Language:</span>
//               <span className="font-medium">{formData.primaryLanguage || 'en'}</span>
//             </div>
//           </div>
//         </PreviewCard>
//       </div>

//       {/* Validation Errors */}
//       {Object.keys(errors).length > 0 && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-start space-x-3">
//             <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//             <div>
//               <h4 className="font-medium text-red-900">Please fix the following issues:</h4>
//               <ul className="text-sm text-red-700 mt-2 space-y-1">
//                 {Object.entries(errors).map(([key, error]) => (
//                   <li key={key}>• {error}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success Message */}
//       {Object.keys(errors).length === 0 && (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//           <div className="flex items-start space-x-3">
//             <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//             <div>
//               <h4 className="font-medium text-green-900">Election Ready to Publish!</h4>
//               <p className="text-sm text-green-700 mt-1">
//                 Your election is properly configured and ready to be published. Click "Publish Election" to make it live.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Debug Section - Remove after testing */}
     
//     </div>
//   );
// };

// export default ElectionPreview;
// //WIth question preview
// import React from 'react';
// import { 
//   Eye, 
//   Calendar, 
//   Clock, 
//   Users, 
//   DollarSign, 
//   Gift, 
//   Shield, 
//   Globe, 
//   Palette,
//   CheckCircle,
//   AlertTriangle,
//   ExternalLink,
//   Edit,
//   Video,
//   MessageSquare
// } from 'lucide-react';
// /*eslint-disable*/
// const ElectionPreview = ({ formData, errors = {}, election = null, countries = [] }) => {
//   const formatDate = (dateObj) => {
//     if (!dateObj?.date || !dateObj?.time) return 'Not set';
    
//     try {
//       const dateTime = new Date(`${dateObj.date}T${dateObj.time}`);
//       if (isNaN(dateTime.getTime())) return 'Invalid Date';
      
//       return dateTime.toLocaleDateString() + ' at ' + dateTime.toLocaleTimeString([], { 
//         hour: '2-digit', 
//         minute: '2-digit' 
//       });
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   const getDuration = () => {
//     if (!formData.startDate?.date || !formData.endDate?.date || 
//         !formData.startDate?.time || !formData.endDate?.time) {
//       return 'Duration not calculated';
//     }
    
//     try {
//       const start = new Date(`${formData.startDate.date}T${formData.startDate.time}`);
//       const end = new Date(`${formData.endDate.date}T${formData.endDate.time}`);
      
//       if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//         return 'Invalid duration';
//       }
      
//       const diff = end - start;
      
//       if (diff <= 0) return 'Invalid duration';
      
//       const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
//       let duration = "";
//       if (days > 0) duration += `${days} day${days > 1 ? 's' : ''} `;
//       if (hours > 0) duration += `${hours} hour${hours > 1 ? 's' : ''} `;
//       if (minutes > 0) duration += `${minutes} minute${minutes > 1 ? 's' : ''}`;
      
//       return duration.trim() || 'Less than a minute';
//     } catch (error) {
//       return 'Duration calculation error';
//     }
//   };

//   const getVotingTypeDisplay = () => {
//     switch (formData.votingType) {
//       case 'plurality': return { name: 'Plurality Voting', icon: '🗳️', desc: 'One choice per voter' };
//       case 'ranked_choice': return { name: 'Ranked Choice Voting', icon: '📊', desc: 'Rank candidates by preference' };
//       case 'approval': return { name: 'Approval Voting', icon: '✅', desc: 'Approve multiple candidates' };
//       default: return { name: 'Not set', icon: '❓', desc: '' };
//     }
//   };

//   const getPermissionDisplay = () => {
//     switch (formData.permissionToVote) {
//       case 'world_citizens': return { name: 'Open to Everyone', icon: '🌍', desc: 'Anyone in the world can vote' };
//       case 'registered_members': return { name: 'Registered Members Only', icon: '👥', desc: 'Organization members only' };
//       case 'country_specific': {
//         const selectedCountries = getSelectedCountriesList();
//         let desc = '';
        
//         if (selectedCountries.length === 0) {
//           desc = 'No countries selected';
//         } else if (selectedCountries.length <= 3) {
//           desc = selectedCountries.join(', ');
//         } else {
//           desc = `${selectedCountries.slice(0, 3).join(', ')} and ${selectedCountries.length - 3} more`;
//         }
        
//         return { name: 'Country Specific', icon: '🏳️', desc };
//       }
//       default: return { name: 'Not set', icon: '❓', desc: '' };
//     }
//   };

//   const getSelectedCountriesList = () => {
//     if (!formData.countries || formData.countries.length === 0) {
//       return [];
//     }
    
//     // Handle case where formData.countries contains objects
//     if (typeof formData.countries[0] === 'object') {
//       return formData.countries
//         .map(country => country.country_name || country.name || 'Unknown Country')
//         .sort();
//     }
    
//     // Handle case where formData.countries contains IDs and we have countries lookup
//     if (countries && countries.length > 0) {
//       return countries
//         .filter(country => formData.countries.includes(country.id))
//         .map(country => country.country_name)
//         .sort();
//     }
    
//     // Fallback - just return the IDs as strings
//     return formData.countries.map(countryId => `Country ${countryId}`);
//   };

//   const getAuthMethodDisplay = () => {
//     switch (formData.authMethod) {
//       case 'passkey': return { name: 'Passkey Authentication', icon: '🔐' };
//       case 'oauth': return { name: 'OAuth Social Login', icon: '👤' };
//       case 'magic_link': return { name: 'Magic Link', icon: '✉️' };
//       case 'email_password': return { name: 'Email & Password', icon: '🔒' };
//       default: return { name: 'Not set', icon: '❓' };
//     }
//   };

//   const getQuestionTypeIcon = (questionType) => {
//     switch (questionType) {
//       case 'multiple_choice': return '📋';
//       case 'open_answer': return '✍️';
//       case 'image_based': return '🖼️';
//       case 'comparison': return '⚖️';
//       default: return '❓';
//     }
//   };

//   const getQuestionTypeName = (questionType) => {
//     switch (questionType) {
//       case 'multiple_choice': return 'Multiple Choice';
//       case 'open_answer': return 'Open Answer';
//       case 'image_based': return 'Image Based';
//       case 'comparison': return 'Comparison';
//       default: return 'Unknown Type';
//     }
//   };

//   const PreviewCard = ({ title, children, icon: Icon, status = 'complete' }) => (
//     <div className={`border rounded-lg p-4 ${status === 'incomplete' ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-white'}`}>
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="font-semibold text-gray-900 flex items-center">
//           <Icon className="w-5 h-5 mr-2" />
//           {title}
//         </h3>
//         {status === 'complete' ? (
//           <CheckCircle className="w-5 h-5 text-green-500" />
//         ) : (
//           <AlertTriangle className="w-5 h-5 text-orange-500" />
//         )}
//       </div>
//       {children}
//     </div>
//   );

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">Election Preview</h2>
//         <p className="mt-2 text-gray-600">
//           Review all settings before publishing your election.
//         </p>
//       </div>

//       {/* Main Election Preview */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex items-center space-x-3">
//             {formData.logoBrandingUrl && (
//               <img
//                 src={formData.logoBrandingUrl}
//                 alt="Logo"
//                 className="w-12 h-12 object-contain bg-white rounded p-1"
//               />
//             )}
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {formData.title || 'Untitled Election'}
//               </h1>
//               {formData.customVotingUrl && (
//                 <div className="flex items-center space-x-2 text-sm text-blue-600 mt-1">
//                   <ExternalLink className="w-4 h-4" />
//                   <span>vottery.com/vote/{formData.customVotingUrl}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//           <Eye className="w-6 h-6 text-gray-400" />
//         </div>

//         {formData.topicImageUrl && (
//           <img
//             src={formData.topicImageUrl}
//             alt="Topic"
//             className="w-full h-48 object-cover rounded-lg mb-4"
//           />
//         )}

//         <p className="text-gray-700 mb-4">
//           {formData.description || 'No description provided.'}
//         </p>

//         {formData.topicVideoUrl && (
//           <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
//             <div className="flex items-center space-x-2 text-sm text-gray-600">
//               <Video className="w-4 h-4" />
//               <span>Video content: {formData.topicVideoUrl}</span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Configuration Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Schedule */}
//         <PreviewCard 
//           title="Schedule" 
//           icon={Calendar}
//           status={formData.startDate?.date && formData.endDate?.date ? 'complete' : 'incomplete'}
//         >
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Start:</span>
//               <span className="font-medium">{formatDate(formData.startDate)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">End:</span>
//               <span className="font-medium">{formatDate(formData.endDate)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Duration:</span>
//               <span className="font-medium">{getDuration()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Timezone:</span>
//               <span className="font-medium">{formData.timezone || 'UTC'}</span>
//             </div>
//           </div>
//         </PreviewCard>

//         {/* Questions & Answers Overview */}
//         <PreviewCard 
//           title="Questions & Answers" 
//           icon={MessageSquare}
//           status={formData.questions && formData.questions.length > 0 ? 'complete' : 'incomplete'}
//         >
//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Total Questions:</span>
//               <span className="font-medium">{formData.questions?.length || 0}</span>
//             </div>
            
//             {formData.questions && formData.questions.length > 0 ? (
//               <>
//                 {/* Question Types Breakdown */}
//                 <div className="space-y-2">
//                   {formData.questions.slice(0, 3).map((question, index) => (
//                     <div key={index} className="flex items-center justify-between text-sm">
//                       <div className="flex items-center space-x-2">
//                         <span className="text-lg">{getQuestionTypeIcon(question.questionType)}</span>
//                         <span className="text-gray-600">Q{index + 1}:</span>
//                         <span className="font-medium truncate max-w-32">
//                           {question.questionText || 'Untitled'}
//                         </span>
//                       </div>
//                       <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                         {getQuestionTypeName(question.questionType)}
//                       </span>
//                     </div>
//                   ))}
                  
//                   {formData.questions.length > 3 && (
//                     <div className="text-sm text-gray-500 text-center py-2">
//                       ... and {formData.questions.length - 3} more question{formData.questions.length - 3 !== 1 ? 's' : ''}
//                     </div>
//                   )}
//                 </div>

//                 {/* Question Types Summary */}
//                 <div className="pt-2 border-t border-gray-100">
//                   <div className="grid grid-cols-2 gap-2 text-xs">
//                     {['multiple_choice', 'open_answer', 'image_based', 'comparison'].map(type => {
//                       const count = formData.questions.filter(q => q.questionType === type).length;
//                       if (count === 0) return null;
//                       return (
//                         <div key={type} className="flex items-center space-x-1">
//                           <span>{getQuestionTypeIcon(type)}</span>
//                           <span className="text-gray-600">{count}</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Total Answers */}
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Total Answer Options:</span>
//                   <span className="font-medium">
//                     {formData.questions.reduce((total, question) => 
//                       total + (question.answers?.length || 0), 0
//                     )}
//                   </span>
//                 </div>
//               </>
//             ) : (
//               <p className="text-sm text-orange-600">No questions configured yet</p>
//             )}
//           </div>
//         </PreviewCard>

//         {/* Voting Configuration */}
//         <PreviewCard title="Voting Method" icon={Users}>
//           <div className="space-y-3">
//             <div>
//               <span className="text-2xl mr-2">{getVotingTypeDisplay().icon}</span>
//               <span className="font-medium">{getVotingTypeDisplay().name}</span>
//               <p className="text-sm text-gray-600 mt-1">{getVotingTypeDisplay().desc}</p>
//             </div>
//           </div>
//         </PreviewCard>

//         {/* Access Control */}
//         <PreviewCard title="Access Control" icon={Shield}>
//           <div className="space-y-3">
//             <div>
//               <div className="flex items-center space-x-2 mb-2">
//                 <span className="text-lg">{getPermissionDisplay().icon}</span>
//                 <span className="font-medium">{getPermissionDisplay().name}</span>
//               </div>
//               <p className="text-sm text-gray-600">{getPermissionDisplay().desc}</p>
//             </div>
            
//             <div className="pt-2 border-t border-gray-100">
//               <div className="flex items-center space-x-2 mb-1">
//                 <span className="text-lg">{getAuthMethodDisplay().icon}</span>
//                 <span className="font-medium">{getAuthMethodDisplay().name}</span>
//               </div>
//               {formData.biometricRequired && (
//                 <p className="text-sm text-blue-600">🔒 Biometric authentication required</p>
//               )}
//             </div>
//           </div>
//         </PreviewCard>

//         {/* Financial Settings */}
//         <PreviewCard title="Financial Settings" icon={DollarSign}>
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-gray-600">Participation Fee:</span>
//               <span className="font-medium">
//                 {formData.isPaid ? `$${formData.participationFee || 0}` : 'Free'}
//               </span>
//             </div>
            
//             {formData.isLotterized && (
//               <div className="bg-green-50 border border-green-200 rounded p-3">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <Gift className="w-4 h-4 text-green-600" />
//                   <span className="font-medium text-green-800">Lottery Enabled</span>
//                 </div>
//                 <div className="text-sm space-y-1">
//                   <div className="flex justify-between">
//                     <span className="text-green-700">Prize Pool:</span>
//                     <span className="font-medium text-green-800">${formData.rewardAmount || 0}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-green-700">Winners:</span>
//                     <span className="font-medium text-green-800">{formData.winnerCount || 1}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-green-700">Per Winner:</span>
//                     <span className="font-medium text-green-800">
//                       ${formData.rewardAmount && formData.winnerCount ? (formData.rewardAmount / formData.winnerCount).toFixed(2) : '0.00'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </PreviewCard>

//         {/* Branding */}
//         <PreviewCard title="Branding" icon={Palette}>
//           <div className="space-y-3">
//             <div className="flex items-center space-x-2">
//               <div
//                 className="w-4 h-4 rounded border"
//                 style={{ backgroundColor: formData.brandColors?.primary || '#3B82F6' }}
//               ></div>
//               <span className="text-sm">Primary: {formData.brandColors?.primary || '#3B82F6'}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div
//                 className="w-4 h-4 rounded border"
//                 style={{ backgroundColor: formData.brandColors?.secondary || '#64748B' }}
//               ></div>
//               <span className="text-sm">Secondary: {formData.brandColors?.secondary || '#64748B'}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div
//                 className="w-4 h-4 rounded border"
//                 style={{ backgroundColor: formData.brandColors?.accent || '#10B981' }}
//               ></div>
//               <span className="text-sm">Accent: {formData.brandColors?.accent || '#10B981'}</span>
//             </div>
            
//             {formData.supportsMultilang && (
//               <div className="pt-2 border-t border-gray-100">
//                 <div className="flex items-center space-x-2">
//                   <Globe className="w-4 h-4 text-blue-500" />
//                   <span className="text-sm text-blue-600">Multi-language support enabled</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </PreviewCard>

//         {/* Results Display */}
//         <PreviewCard title="Results & Features" icon={Eye}>
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Live Results:</span>
//               <span className="font-medium">{formData.showLiveResults ? 'Enabled' : 'Disabled'}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Vote Editing:</span>
//               <span className="font-medium">{formData.allowVoteEditing ? 'Allowed' : 'Not Allowed'}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Language:</span>
//               <span className="font-medium">{formData.primaryLanguage || 'en'}</span>
//             </div>
//           </div>
//         </PreviewCard>
//       </div>

//       {/* Validation Errors */}
//       {Object.keys(errors).length > 0 && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-start space-x-3">
//             <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//             <div>
//               <h4 className="font-medium text-red-900">Please fix the following issues:</h4>
//               <ul className="text-sm text-red-700 mt-2 space-y-1">
//                 {Object.entries(errors).map(([key, error]) => (
//                   <li key={key}>• {error}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success Message */}
//       {Object.keys(errors).length === 0 && (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//           <div className="flex items-start space-x-3">
//             <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//             <div>
//               <h4 className="font-medium text-green-900">Election Ready to Publish!</h4>
//               <p className="text-sm text-green-700 mt-1">
//                 Your election is properly configured and ready to be published. Click "Publish Election" to make it live.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Debug Section - Remove after testing */}
     
//     </div>
//   );
// };

// export default ElectionPreview;
// import React from 'react';
// import { 
//   Eye, 
//   Calendar, 
//   Clock, 
//   Users, 
//   DollarSign, 
//   Gift, 
//   Shield, 
//   Globe, 
//   Palette,
//   CheckCircle,
//   AlertTriangle,
//   ExternalLink,
//   Edit,
//   Video
// } from 'lucide-react';
// /*eslint-disable*/
// const ElectionPreview = ({ formData, errors = {}, election = null, countries = [] }) => {
//   const formatDate = (dateObj) => {
//     if (!dateObj?.date || !dateObj?.time) return 'Not set';
    
//     try {
//       const dateTime = new Date(`${dateObj.date}T${dateObj.time}`);
//       if (isNaN(dateTime.getTime())) return 'Invalid Date';
      
//       return dateTime.toLocaleDateString() + ' at ' + dateTime.toLocaleTimeString([], { 
//         hour: '2-digit', 
//         minute: '2-digit' 
//       });
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   const getDuration = () => {
//     if (!formData.startDate?.date || !formData.endDate?.date || 
//         !formData.startDate?.time || !formData.endDate?.time) {
//       return 'Duration not calculated';
//     }
    
//     try {
//       const start = new Date(`${formData.startDate.date}T${formData.startDate.time}`);
//       const end = new Date(`${formData.endDate.date}T${formData.endDate.time}`);
      
//       if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//         return 'Invalid duration';
//       }
      
//       const diff = end - start;
      
//       if (diff <= 0) return 'Invalid duration';
      
//       const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
//       let duration = "";
//       if (days > 0) duration += `${days} day${days > 1 ? 's' : ''} `;
//       if (hours > 0) duration += `${hours} hour${hours > 1 ? 's' : ''} `;
//       if (minutes > 0) duration += `${minutes} minute${minutes > 1 ? 's' : ''}`;
      
//       return duration.trim() || 'Less than a minute';
//     } catch (error) {
//       return 'Duration calculation error';
//     }
//   };

//   const getVotingTypeDisplay = () => {
//     switch (formData.votingType) {
//       case 'plurality': return { name: 'Plurality Voting', icon: '🗳️', desc: 'One choice per voter' };
//       case 'ranked_choice': return { name: 'Ranked Choice Voting', icon: '📊', desc: 'Rank candidates by preference' };
//       case 'approval': return { name: 'Approval Voting', icon: '✅', desc: 'Approve multiple candidates' };
//       default: return { name: 'Not set', icon: '❓', desc: '' };
//     }
//   };

//   const getPermissionDisplay = () => {
//     switch (formData.permissionToVote) {
//       case 'world_citizens': return { name: 'Open to Everyone', icon: '🌍', desc: 'Anyone in the world can vote' };
//       case 'registered_members': return { name: 'Registered Members Only', icon: '👥', desc: 'Organization members only' };
//       case 'country_specific': {
//         const selectedCountries = getSelectedCountriesList();
//         let desc = '';
        
//         if (selectedCountries.length === 0) {
//           desc = 'No countries selected';
//         } else if (selectedCountries.length <= 3) {
//           desc = selectedCountries.join(', ');
//         } else {
//           desc = `${selectedCountries.slice(0, 3).join(', ')} and ${selectedCountries.length - 3} more`;
//         }
        
//         return { name: 'Country Specific', icon: '🏳️', desc };
//       }
//       default: return { name: 'Not set', icon: '❓', desc: '' };
//     }
//   };

//   const getSelectedCountriesList = () => {
//     if (!formData.countries || formData.countries.length === 0) {
//       return [];
//     }
    
//     // Handle case where formData.countries contains objects
//     if (typeof formData.countries[0] === 'object') {
//       return formData.countries
//         .map(country => country.country_name || country.name || 'Unknown Country')
//         .sort();
//     }
    
//     // Handle case where formData.countries contains IDs and we have countries lookup
//     if (countries && countries.length > 0) {
//       return countries
//         .filter(country => formData.countries.includes(country.id))
//         .map(country => country.country_name)
//         .sort();
//     }
    
//     // Fallback - just return the IDs as strings
//     return formData.countries.map(countryId => `Country ${countryId}`);
//   };

//   const getAuthMethodDisplay = () => {
//     switch (formData.authMethod) {
//       case 'passkey': return { name: 'Passkey Authentication', icon: '🔐' };
//       case 'oauth': return { name: 'OAuth Social Login', icon: '👤' };
//       case 'magic_link': return { name: 'Magic Link', icon: '✉️' };
//       case 'email_password': return { name: 'Email & Password', icon: '🔒' };
//       default: return { name: 'Not set', icon: '❓' };
//     }
//   };

//   const PreviewCard = ({ title, children, icon: Icon, status = 'complete' }) => (
//     <div className={`border rounded-lg p-4 ${status === 'incomplete' ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-white'}`}>
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="font-semibold text-gray-900 flex items-center">
//           <Icon className="w-5 h-5 mr-2" />
//           {title}
//         </h3>
//         {status === 'complete' ? (
//           <CheckCircle className="w-5 h-5 text-green-500" />
//         ) : (
//           <AlertTriangle className="w-5 h-5 text-orange-500" />
//         )}
//       </div>
//       {children}
//     </div>
//   );

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">Election Preview</h2>
//         <p className="mt-2 text-gray-600">
//           Review all settings before publishing your election.
//         </p>
//       </div>

//       {/* Main Election Preview */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex items-center space-x-3">
//             {formData.logoBrandingUrl && (
//               <img
//                 src={formData.logoBrandingUrl}
//                 alt="Logo"
//                 className="w-12 h-12 object-contain bg-white rounded p-1"
//               />
//             )}
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {formData.title || 'Untitled Election'}
//               </h1>
//               {formData.customVotingUrl && (
//                 <div className="flex items-center space-x-2 text-sm text-blue-600 mt-1">
//                   <ExternalLink className="w-4 h-4" />
//                   <span>vottery.com/vote/{formData.customVotingUrl}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//           <Eye className="w-6 h-6 text-gray-400" />
//         </div>

//         {formData.topicImageUrl && (
//           <img
//             src={formData.topicImageUrl}
//             alt="Topic"
//             className="w-full h-48 object-cover rounded-lg mb-4"
//           />
//         )}

//         <p className="text-gray-700 mb-4">
//           {formData.description || 'No description provided.'}
//         </p>

//         {formData.topicVideoUrl && (
//           <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
//             <div className="flex items-center space-x-2 text-sm text-gray-600">
//               <Video className="w-4 h-4" />
//               <span>Video content: {formData.topicVideoUrl}</span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Configuration Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Schedule */}
//         <PreviewCard 
//           title="Schedule" 
//           icon={Calendar}
//           status={formData.startDate?.date && formData.endDate?.date ? 'complete' : 'incomplete'}
//         >
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Start:</span>
//               <span className="font-medium">{formatDate(formData.startDate)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">End:</span>
//               <span className="font-medium">{formatDate(formData.endDate)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Duration:</span>
//               <span className="font-medium">{getDuration()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Timezone:</span>
//               <span className="font-medium">{formData.timezone || 'UTC'}</span>
//             </div>
//           </div>
//         </PreviewCard>

//         {/* Voting Configuration */}
//         <PreviewCard title="Voting Method" icon={Users}>
//           <div className="space-y-3">
//             <div>
//               <span className="text-2xl mr-2">{getVotingTypeDisplay().icon}</span>
//               <span className="font-medium">{getVotingTypeDisplay().name}</span>
//               <p className="text-sm text-gray-600 mt-1">{getVotingTypeDisplay().desc}</p>
//             </div>
//           </div>
//         </PreviewCard>

//         {/* Access Control */}
//         <PreviewCard title="Access Control" icon={Shield}>
//           <div className="space-y-3">
//             <div>
//               <div className="flex items-center space-x-2 mb-2">
//                 <span className="text-lg">{getPermissionDisplay().icon}</span>
//                 <span className="font-medium">{getPermissionDisplay().name}</span>
//               </div>
//               <p className="text-sm text-gray-600">{getPermissionDisplay().desc}</p>
//             </div>
            
//             <div className="pt-2 border-t border-gray-100">
//               <div className="flex items-center space-x-2 mb-1">
//                 <span className="text-lg">{getAuthMethodDisplay().icon}</span>
//                 <span className="font-medium">{getAuthMethodDisplay().name}</span>
//               </div>
//               {formData.biometricRequired && (
//                 <p className="text-sm text-blue-600">🔒 Biometric authentication required</p>
//               )}
//             </div>
//           </div>
//         </PreviewCard>

//         {/* Financial Settings */}
//         <PreviewCard title="Financial Settings" icon={DollarSign}>
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-gray-600">Participation Fee:</span>
//               <span className="font-medium">
//                 {formData.isPaid ? `$${formData.participationFee || 0}` : 'Free'}
//               </span>
//             </div>
            
//             {formData.isLotterized && (
//               <div className="bg-green-50 border border-green-200 rounded p-3">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <Gift className="w-4 h-4 text-green-600" />
//                   <span className="font-medium text-green-800">Lottery Enabled</span>
//                 </div>
//                 <div className="text-sm space-y-1">
//                   <div className="flex justify-between">
//                     <span className="text-green-700">Prize Pool:</span>
//                     <span className="font-medium text-green-800">${formData.rewardAmount || 0}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-green-700">Winners:</span>
//                     <span className="font-medium text-green-800">{formData.winnerCount || 1}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-green-700">Per Winner:</span>
//                     <span className="font-medium text-green-800">
//                       ${formData.rewardAmount && formData.winnerCount ? (formData.rewardAmount / formData.winnerCount).toFixed(2) : '0.00'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </PreviewCard>

//         {/* Branding */}
//         <PreviewCard title="Branding" icon={Palette}>
//           <div className="space-y-3">
//             <div className="flex items-center space-x-2">
//               <div
//                 className="w-4 h-4 rounded border"
//                 style={{ backgroundColor: formData.brandColors?.primary || '#3B82F6' }}
//               ></div>
//               <span className="text-sm">Primary: {formData.brandColors?.primary || '#3B82F6'}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div
//                 className="w-4 h-4 rounded border"
//                 style={{ backgroundColor: formData.brandColors?.secondary || '#64748B' }}
//               ></div>
//               <span className="text-sm">Secondary: {formData.brandColors?.secondary || '#64748B'}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div
//                 className="w-4 h-4 rounded border"
//                 style={{ backgroundColor: formData.brandColors?.accent || '#10B981' }}
//               ></div>
//               <span className="text-sm">Accent: {formData.brandColors?.accent || '#10B981'}</span>
//             </div>
            
//             {formData.supportsMultilang && (
//               <div className="pt-2 border-t border-gray-100">
//                 <div className="flex items-center space-x-2">
//                   <Globe className="w-4 h-4 text-blue-500" />
//                   <span className="text-sm text-blue-600">Multi-language support enabled</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </PreviewCard>

//         {/* Results Display */}
//         <PreviewCard title="Results & Features" icon={Eye}>
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Live Results:</span>
//               <span className="font-medium">{formData.showLiveResults ? 'Enabled' : 'Disabled'}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Vote Editing:</span>
//               <span className="font-medium">{formData.allowVoteEditing ? 'Allowed' : 'Not Allowed'}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Language:</span>
//               <span className="font-medium">{formData.primaryLanguage || 'en'}</span>
//             </div>
//           </div>
//         </PreviewCard>
//       </div>

//       {/* Validation Errors */}
//       {Object.keys(errors).length > 0 && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-start space-x-3">
//             <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//             <div>
//               <h4 className="font-medium text-red-900">Please fix the following issues:</h4>
//               <ul className="text-sm text-red-700 mt-2 space-y-1">
//                 {Object.entries(errors).map(([key, error]) => (
//                   <li key={key}>• {error}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success Message */}
//       {Object.keys(errors).length === 0 && (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//           <div className="flex items-start space-x-3">
//             <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//             <div>
//               <h4 className="font-medium text-green-900">Election Ready to Publish!</h4>
//               <p className="text-sm text-green-700 mt-1">
//                 Your election is properly configured and ready to be published. Click "Publish Election" to make it live.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Debug Section - Remove after testing */}
     
//     </div>
//   );
// };

// export default ElectionPreview;
