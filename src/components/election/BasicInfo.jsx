// components/election/BasicInfo.jsx
import React from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

const BasicInfo = ({ formData, handleInputChange, handleMediaUpload }) => {
  // const categories = [
  //   'Politics & Government',
  //   'Technology',
  //   'Environment',
  //   'Business',
  //   'Education',
  //   'Entertainment',
  //   'Sports',
  //   'Lifestyle',
  //   'Health',
  //   'Community'
  // ];

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      handleMediaUpload(type, file);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Election Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter a clear, descriptive title"
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Provide details about what you're voting on and any important context"
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category.toLowerCase().replace(/\s+/g, '_')}>
              {category}
            </option>
          ))}
        </select>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <PhotoIcon className="h-4 w-4 inline mr-1" />
            Cover Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-500">Upload image</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('coverImage', e)}
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
            </div>
            {formData.media.coverImage && (
              <p className="text-xs text-green-600 mt-2">
                ✓ {formData.media.coverImage.name}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <PhotoIcon className="h-4 w-4 inline mr-1" />
            Logo/Branding
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-500">Upload logo</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('logo', e)}
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">Square format preferred</p>
            </div>
            {formData.media.logo && (
              <p className="text-xs text-green-600 mt-2">
                ✓ {formData.media.logo.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;