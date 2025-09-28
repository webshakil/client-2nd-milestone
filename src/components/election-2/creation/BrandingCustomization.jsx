import React from 'react';
import { 
  Palette, 
  Image, 
  Link, 
  Code, 
  Eye, 
  Upload, 
  X,
  ExternalLink,
  Brush,
  Globe
} from 'lucide-react';

const BrandingCustomization = ({ formData, updateFormData, errors = {} }) => {
  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateFormData({ [field]: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (field) => {
    updateFormData({ [field]: '' });
  };

  const handleColorChange = (colorType, value) => {
    updateFormData({
      brandColors: {
        ...formData.brandColors,
        [colorType]: value
      }
    });
  };

  const generateCustomUrl = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      updateFormData({ customVotingUrl: slug });
    }
  };

  const handleLanguageChange = (language) => {
    updateFormData({ primaryLanguage: language });
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { code: 'sw', name: 'Swahili', flag: '🇰🇪' }
  ];

  const presetThemes = [
    {
      name: 'Professional Blue',
      colors: { primary: '#3B82F6', secondary: '#64748B', accent: '#10B981' }
    },
    {
      name: 'Corporate Green',
      colors: { primary: '#059669', secondary: '#6B7280', accent: '#F59E0B' }
    },
    {
      name: 'Modern Purple',
      colors: { primary: '#8B5CF6', secondary: '#64748B', accent: '#EF4444' }
    },
    {
      name: 'Classic Red',
      colors: { primary: '#DC2626', secondary: '#6B7280', accent: '#2563EB' }
    }
  ];

  const applyPresetTheme = (theme) => {
    updateFormData({ brandColors: theme.colors });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Branding & Customization</h2>
        <p className="mt-2 text-gray-600">
          Customize the appearance and branding of your election to match your organization.
        </p>
      </div>

      {/* Logo Branding */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Image className="w-5 h-5 mr-2" />
          Logo & Branding
        </h3>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Organization Logo
          </label>
          
          {formData.logoBrandingUrl ? (
            <div className="relative inline-block">
              <img
                src={formData.logoBrandingUrl}
                alt="Logo"
                className="w-32 h-32 object-contain rounded-lg border border-gray-300 bg-white p-2"
              />
              <button
                type="button"
                onClick={() => removeImage('logoBrandingUrl')}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors max-w-xs">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <label className="cursor-pointer">
                <span className="text-sm text-gray-600">
                  Upload your logo
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'logoBrandingUrl')}
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">PNG, SVG recommended</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom URL */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Link className="w-5 h-5 mr-2" />
          Custom Voting URL
        </h3>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Custom URL Slug
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              vottery.com/vote/
            </span>
            <input
              type="text"
              className={`flex-1 rounded-none rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.customVotingUrl ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="my-election-url"
              value={formData.customVotingUrl || ''}
              onChange={(e) => updateFormData({ customVotingUrl: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
            />
            <button
              type="button"
              onClick={generateCustomUrl}
              className="ml-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Generate
            </button>
          </div>
          {errors.customVotingUrl && (
            <p className="text-red-600 text-sm">{errors.customVotingUrl}</p>
          )}
          {formData.customVotingUrl && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <ExternalLink className="w-4 h-4" />
              <span>vottery.com/vote/{formData.customVotingUrl}</span>
            </div>
          )}
        </div>
      </div>

      {/* Color Scheme */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Color Scheme
        </h3>

        {/* Preset Themes */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Quick Themes
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {presetThemes.map((theme, index) => (
              <button
                key={index}
                type="button"
                onClick={() => applyPresetTheme(theme)}
                className="p-3 border rounded-lg hover:border-gray-400 transition-colors text-left"
              >
                <div className="flex space-x-1 mb-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.colors.secondary }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.colors.accent }}
                  ></div>
                </div>
                <p className="text-xs font-medium text-gray-700">{theme.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                value={formData.brandColors?.primary || '#3B82F6'}
                onChange={(e) => handleColorChange('primary', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={formData.brandColors?.primary || '#3B82F6'}
                onChange={(e) => handleColorChange('primary', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Secondary Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                value={formData.brandColors?.secondary || '#64748B'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={formData.brandColors?.secondary || '#64748B'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Accent Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                value={formData.brandColors?.accent || '#10B981'}
                onChange={(e) => handleColorChange('accent', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={formData.brandColors?.accent || '#10B981'}
                onChange={(e) => handleColorChange('accent', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Language Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Language Settings
        </h3>

        <div className="space-y-4">
          {/* Primary Language */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Primary Language
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.primaryLanguage || 'en'}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Multi-language Support Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Enable Multi-language Support</h4>
              <p className="text-sm text-gray-600">Allow automatic translation to 70+ languages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.supportsMultilang || false}
                onChange={(e) => updateFormData({ supportsMultilang: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {formData.supportsMultilang && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">🌍 Multi-language Features</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Automatic translation using GTranslate API</li>
                <li>• Support for 70+ languages including RTL languages</li>
                <li>• Localized date/time formats</li>
                <li>• Region-specific content adaptation</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Code className="w-5 h-5 mr-2" />
          Advanced Styling
        </h3>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Custom CSS (Optional)
          </label>
          <textarea
            rows={6}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder={`/* Custom CSS for your election */
.election-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.vote-button {
  border-radius: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}`}
            value={formData.customCss || ''}
            onChange={(e) => updateFormData({ customCss: e.target.value })}
          />
          <p className="text-xs text-gray-500">
            Advanced users can add custom CSS to further customize the appearance
          </p>
        </div>
      </div>

      {/* Preview Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Style Preview
        </h3>
        
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="space-y-4">
            {/* Header Preview */}
            <div 
              className="p-4 rounded-lg text-white"
              style={{ backgroundColor: formData.brandColors?.primary || '#3B82F6' }}
            >
              <div className="flex items-center space-x-3">
                {formData.logoBrandingUrl && (
                  <img
                    src={formData.logoBrandingUrl}
                    alt="Logo"
                    className="w-8 h-8 object-contain bg-white rounded p-1"
                  />
                )}
                <h4 className="font-semibold">
                  {formData.title || 'Your Election Title'}
                </h4>
              </div>
            </div>

            {/* Button Preview */}
            <div className="flex space-x-3">
              <button
                className="px-4 py-2 rounded-md text-white font-medium"
                style={{ backgroundColor: formData.brandColors?.primary || '#3B82F6' }}
              >
                Vote Now
              </button>
              <button
                className="px-4 py-2 rounded-md text-white font-medium"
                style={{ backgroundColor: formData.brandColors?.accent || '#10B981' }}
              >
                View Results
              </button>
            </div>

            {/* Content Preview */}
            <div className="text-sm">
              <p style={{ color: formData.brandColors?.secondary || '#64748B' }}>
                This is how your election content will appear to voters with your selected colors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Style Info */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Brush className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-purple-900">White-label Corporate Style</h4>
            <p className="text-sm text-purple-700 mt-1">
              Your custom branding will be applied across all election pages, emails, and notifications 
              to create a seamless branded voting experience for your participants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingCustomization;