import React from 'react';
import { 
  Shield, 
  Fingerprint, 
  Key, 
  Mail, 
  Lock, 
  Smartphone, 
  User, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

const AccessControlSettings = ({ formData, updateFormData, errors = {} }) => {
  const authMethods = [
    {
      id: 'passkey',
      name: 'Passkey Authentication',
      description: 'Modern, secure authentication using device credentials',
      icon: <Key className="w-5 h-5" />,
      recommended: true,
      security: 'High',
      features: ['Device-based', 'No passwords', 'Phishing resistant']
    },
    {
      id: 'oauth',
      name: 'OAuth (Social Login)',
      description: 'Login with Google, Facebook, Twitter, LinkedIn',
      icon: <User className="w-5 h-5" />,
      security: 'Medium',
      features: ['Quick signup', 'Trusted providers', 'Wide adoption']
    },
    {
      id: 'magic_link',
      name: 'Magic Link',
      description: 'Passwordless login via email link',
      icon: <Mail className="w-5 h-5" />,
      security: 'Medium',
      features: ['No passwords', 'Email-based', 'Simple UX']
    },
    {
      id: 'email_password',
      name: 'Email & Password',
      description: 'Traditional username/password with 2FA/OTP',
      icon: <Lock className="w-5 h-5" />,
      security: 'Medium',
      features: ['Familiar', '2FA support', 'OTP verification']
    }
  ];

  const handleAuthMethodChange = (method) => {
    updateFormData({ authMethod: method });
  };

  const handleBiometricToggle = (enabled) => {
    updateFormData({ biometricRequired: enabled });
  };

  const handleOAuthToggle = (enabled) => {
    updateFormData({ allowOauth: enabled });
  };

  const handleMagicLinkToggle = (enabled) => {
    updateFormData({ allowMagicLink: enabled });
  };

  const handleEmailPasswordToggle = (enabled) => {
    updateFormData({ allowEmailPassword: enabled });
  };

  const getSecurityColor = (level) => {
    switch (level) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Security & Access Control</h2>
        <p className="mt-2 text-gray-600">
          Configure authentication methods and security settings for your election.
        </p>
      </div>

      {/* Biometric Authentication */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Fingerprint className="w-5 h-5 mr-2" />
              Biometric Authentication
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Require fingerprint (Android) or Face ID (iPhone) for voting
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={formData.biometricRequired}
              onChange={(e) => handleBiometricToggle(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {formData.biometricRequired && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900">Biometric Requirements</h4>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• <strong>Android users:</strong> Must have fingerprint scanner enabled</li>
                  <li>• <strong>iPhone users:</strong> Must have Face ID or Touch ID enabled</li>
                  <li>• <strong>Desktop users:</strong> Cannot vote (biometric not available)</li>
                  <li>• Biometric data is processed locally and never stored on servers</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {!formData.biometricRequired && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-700">Standard Authentication</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Users can vote from any device using their chosen authentication method.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Authentication Method */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Primary Authentication Method</h3>
        <p className="text-sm text-gray-600">
          Choose the default authentication method for your election.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {authMethods.map((method) => (
            <div
              key={method.id}
              className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                formData.authMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleAuthMethodChange(method.id)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {method.icon}
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        {method.name}
                        {method.recommended && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSecurityColor(method.security)}`}>
                    {method.security}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {method.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {formData.authMethod === method.id && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
              )}
            </div>
          ))}
        </div>
        {errors.authMethod && (
          <p className="text-red-600 text-sm">{errors.authMethod}</p>
        )}
      </div>

      {/* Additional Authentication Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Additional Authentication Options</h3>
        <p className="text-sm text-gray-600">
          Allow users to choose from multiple authentication methods.
        </p>

        <div className="space-y-4">
          {/* OAuth Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">OAuth Social Login</h4>
                <p className="text-sm text-gray-600">Google, Facebook, Twitter, LinkedIn</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.allowOauth}
                onChange={(e) => handleOAuthToggle(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Magic Link Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Magic Link Authentication</h4>
                <p className="text-sm text-gray-600">Passwordless login via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.allowMagicLink}
                onChange={(e) => handleMagicLinkToggle(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Email & Password Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Email & Password</h4>
                <p className="text-sm text-gray-600">Traditional login with 2FA/OTP support</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.allowEmailPassword}
                onChange={(e) => handleEmailPasswordToggle(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-900">Security Features Included</h4>
            <ul className="text-sm text-green-700 mt-2 space-y-1">
              <li>• End-to-end encryption for all votes</li>
              <li>• Digital signatures for vote integrity</li>
              <li>• Tamper-resistant audit trails</li>
              <li>• Identity verification and privacy protection</li>
              <li>• HTTPS enforcement and rate limiting</li>
              <li>• GDPR and CCPA compliance</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Country-Specific Biometric Handling */}
      {formData.biometricRequired && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Smartphone className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-900">Biometric Data Handling</h4>
              <p className="text-sm text-yellow-700 mt-2">
                Biometric data is processed according to country-specific privacy regulations. 
                Data is never transmitted to our servers and remains on the user's device.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControlSettings;