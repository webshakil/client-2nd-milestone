import ImageUploader from '../forms/ImageUploader';
import VideoUploader from '../forms/VideoUploader';
import DateTimePicker from '../forms/DateTimePicker';
import ValidationErrors from '../common/ValidationErrors';
/*eslint-disable*/
const BasicElectionSetup = ({ formData, updateFormData, errors, uploadedFiles, setUploadedFiles }) => {
  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  };

  const handleTitleChange = (value) => {
    updateFormData({ 
      title: value,
      // Auto-generate custom URL if not already set
      customVotingUrl: formData.customVotingUrl || generateSlug(value)
    });
  };

  // Handle image upload for topic image
  const handleTopicImageChange = (fileData, error) => {
    if (error) {
      console.error('Topic image upload error:', error);
      // You could show a toast error here
      return;
    }
    
    if (fileData) {
      // Update form data with preview URL for display
      updateFormData({ topicImageUrl: fileData.previewUrl });
      
      // Add file to uploadedFiles array
      setUploadedFiles(prev => [
        ...prev.filter(f => f.fieldName !== 'topicImage'),
        fileData
      ]);
    } else {
      // Remove image
      updateFormData({ topicImageUrl: null });
      setUploadedFiles(prev => prev.filter(f => f.fieldName !== 'topicImage'));
    }
  };

  // Handle image upload for logo branding
  const handleLogoBrandingChange = (fileData, error) => {
    if (error) {
      console.error('Logo branding upload error:', error);
      // You could show a toast error here
      return;
    }
    
    if (fileData) {
      // Update form data with preview URL for display
      updateFormData({ logoBrandingUrl: fileData.previewUrl });
      
      // Add file to uploadedFiles array
      setUploadedFiles(prev => [
        ...prev.filter(f => f.fieldName !== 'logoBranding'),
        fileData
      ]);
    } else {
      // Remove image
      updateFormData({ logoBrandingUrl: null });
      setUploadedFiles(prev => prev.filter(f => f.fieldName !== 'logoBranding'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Basic Election Setup</h3>
        <p className="mt-1 text-sm text-gray-600">
          Set up the fundamental details of your election including title, description, and scheduling.
        </p>
      </div>

      {/* Election Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Election Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title || ''}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter a clear, descriptive title for your election"
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
          maxLength={500}
        />
        <div className="mt-1 flex justify-between">
          <ValidationErrors errors={errors.title ? [errors.title] : []} />
          <span className="text-xs text-gray-500">{(formData.title || '').length}/500</span>
        </div>
      </div>

      {/* Election Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Election Description
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Provide a detailed description of your election..."
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          rows={6}
          maxLength={5000}
        />
        <div className="mt-1 flex justify-between">
          <ValidationErrors errors={errors.description ? [errors.description] : []} />
          <span className="text-xs text-gray-500">{(formData.description || '').length}/5000</span>
        </div>
      </div>

      {/* Media Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Topic Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Election Image
          </label>
          <ImageUploader
            value={formData.topicImageUrl}
            onChange={handleTopicImageChange}
            fieldName="topicImage"
            maxSize={Infinity} // Changed from 5MB to Infinity
            allowedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
            className="w-full"
            placeholder="Upload election image"
            error={errors.topicImage}
          />
          <p className="mt-1 text-xs text-gray-500">
            Upload an image that represents your election (no size limit)
          </p>
        </div>

        {/* Logo Branding */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo/Branding
          </label>
          <ImageUploader
            value={formData.logoBrandingUrl}
            onChange={handleLogoBrandingChange}
            fieldName="logoBranding"
            maxSize={Infinity} // Changed from 2MB to Infinity
            allowedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml']}
            className="w-full"
            placeholder="Upload logo/branding"
            error={errors.logoBranding}
          />
          <p className="mt-1 text-xs text-gray-500">
            Upload your organization logo or branding (no size limit)
          </p>
        </div>
      </div>

      {/* Topic Video */}
      <div className="mt-6 video">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Election Video (Optional)
        </label>
        <VideoUploader
          value={formData.topicVideoUrl}
          onChange={(url) => handleInputChange('topicVideoUrl', url)}
          context="election_topic"
          maxSize={Infinity} // Changed from 50MB to Infinity
          acceptedTypes={['video/mp4', 'video/webm', 'video/ogg']}
        />
        <p className="mt-1 text-xs text-gray-500">
          Upload a video explaining your election (no size limit, recommended duration: 2-5 minutes)
        </p>
      </div>

      {/* Scheduling Section */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Election Scheduling</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date & Time */}
          <div>
            <DateTimePicker
              label="Start Date & Time"
              value={formData.startDate}
              onChange={(value) => updateFormData({ startDate: value })}
              minDate={new Date().toISOString().split('T')[0]}
              error={errors.startDate}
              required
            />
            <ValidationErrors errors={errors.startDate ? [errors.startDate] : []} />
          </div>

          {/* End Date & Time */}
          <div>
            <DateTimePicker
              label="End Date & Time"
              value={formData.endDate}
              onChange={(value) => updateFormData({ endDate: value })}
              minDate={formData.startDate?.date || new Date().toISOString().split('T')[0]}
              error={errors.endDate}
              required
            />
            <ValidationErrors errors={errors.endDate ? [errors.endDate] : []} />
          </div>
        </div>

        {/* Timezone */}
        <div className="mt-4">
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            id="timezone"
            value={formData.timezone || 'UTC'}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">Greenwich Mean Time (GMT)</option>
            <option value="Europe/Paris">Central European Time (CET)</option>
            <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
            <option value="Asia/Shanghai">China Standard Time (CST)</option>
            <option value="Asia/Kolkata">India Standard Time (IST)</option>
            <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
            <option value="Australia/Sydney">Australian Eastern Time (AET)</option>
          </select>
        </div>
      </div>

      {/* Custom URL Section */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Custom Election URL</h4>
        
        <div>
          <label htmlFor="customVotingUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Custom URL Slug (Optional)
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
              vottery.com/vote/
            </span>
            <input
              type="text"
              id="customVotingUrl"
              value={formData.customVotingUrl || ''}
              onChange={(e) => handleInputChange('customVotingUrl', e.target.value)}
              placeholder="my-election-2024"
              className={`flex-1 px-3 py-2 border rounded-r-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                errors.customVotingUrl ? 'border-red-300' : 'border-gray-300'
              }`}
              pattern="[a-zA-Z0-9-_]+"
              maxLength={200}
            />
          </div>
          <div className="mt-1 flex justify-between">
            <ValidationErrors errors={errors.customVotingUrl ? [errors.customVotingUrl] : []} />
            <span className="text-xs text-gray-500">Only letters, numbers, hyphens, and underscores allowed</span>
          </div>
        </div>
      </div>

      {/* Election Duration Preview */}
      {formData.startDate?.date && formData.endDate?.date && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h5 className="text-sm font-medium text-blue-900 mb-2">Election Duration Preview</h5>
          <div className="text-sm text-blue-700">
            <p>
              <strong>Starts:</strong> {new Date(`${formData.startDate.date}T${formData.startDate.time || '09:00'}`).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </p>
            <p>
              <strong>Ends:</strong> {new Date(`${formData.endDate.date}T${formData.endDate.time || '18:00'}`).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </p>
            <p>
              <strong>Duration:</strong> {(() => {
                const start = new Date(`${formData.startDate.date}T${formData.startDate.time || '09:00'}`);
                const end = new Date(`${formData.endDate.date}T${formData.endDate.time || '18:00'}`);
                const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                return `${duration} day${duration !== 1 ? 's' : ''}`;
              })()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicElectionSetup;
// //THis is the last workable code. just to increase image size above code
// import ImageUploader from '../forms/ImageUploader';
// import VideoUploader from '../forms/VideoUploader';
// import DateTimePicker from '../forms/DateTimePicker';
// import ValidationErrors from '../common/ValidationErrors';
// /*eslint-disable*/
// const BasicElectionSetup = ({ formData, updateFormData, errors, uploadedFiles, setUploadedFiles }) => {
//   const handleInputChange = (field, value) => {
//     updateFormData({ [field]: value });
//   };

//   const generateSlug = (title) => {
//     return title
//       .toLowerCase()
//       .replace(/[^a-z0-9\s-]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/-+/g, '-')
//       .replace(/^-|-$/g, '')
//       .substring(0, 50);
//   };

//   const handleTitleChange = (value) => {
//     updateFormData({ 
//       title: value,
//       // Auto-generate custom URL if not already set
//       customVotingUrl: formData.customVotingUrl || generateSlug(value)
//     });
//   };

//   // Handle image upload for topic image
//   const handleTopicImageChange = (fileData, error) => {
//     if (error) {
//       console.error('Topic image upload error:', error);
//       // You could show a toast error here
//       return;
//     }
    
//     if (fileData) {
//       // Update form data with preview URL for display
//       updateFormData({ topicImageUrl: fileData.previewUrl });
      
//       // Add file to uploadedFiles array
//       setUploadedFiles(prev => [
//         ...prev.filter(f => f.fieldName !== 'topicImage'),
//         fileData
//       ]);
//     } else {
//       // Remove image
//       updateFormData({ topicImageUrl: null });
//       setUploadedFiles(prev => prev.filter(f => f.fieldName !== 'topicImage'));
//     }
//   };

//   // Handle image upload for logo branding
//   const handleLogoBrandingChange = (fileData, error) => {
//     if (error) {
//       console.error('Logo branding upload error:', error);
//       // You could show a toast error here
//       return;
//     }
    
//     if (fileData) {
//       // Update form data with preview URL for display
//       updateFormData({ logoBrandingUrl: fileData.previewUrl });
      
//       // Add file to uploadedFiles array
//       setUploadedFiles(prev => [
//         ...prev.filter(f => f.fieldName !== 'logoBranding'),
//         fileData
//       ]);
//     } else {
//       // Remove image
//       updateFormData({ logoBrandingUrl: null });
//       setUploadedFiles(prev => prev.filter(f => f.fieldName !== 'logoBranding'));
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="border-b border-gray-200 pb-4">
//         <h3 className="text-lg font-medium text-gray-900">Basic Election Setup</h3>
//         <p className="mt-1 text-sm text-gray-600">
//           Set up the fundamental details of your election including title, description, and scheduling.
//         </p>
//       </div>

//       {/* Election Title */}
//       <div>
//         <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//           Election Title *
//         </label>
//         <input
//           type="text"
//           id="title"
//           value={formData.title || ''}
//           onChange={(e) => handleTitleChange(e.target.value)}
//           placeholder="Enter a clear, descriptive title for your election"
//           className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
//             errors.title ? 'border-red-300' : 'border-gray-300'
//           }`}
//           maxLength={500}
//         />
//         <div className="mt-1 flex justify-between">
//           <ValidationErrors errors={errors.title ? [errors.title] : []} />
//           <span className="text-xs text-gray-500">{(formData.title || '').length}/500</span>
//         </div>
//       </div>

//       {/* Election Description */}
//       <div>
//         <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//           Election Description
//         </label>
//         <textarea
//           value={formData.description || ''}
//           onChange={(e) => handleInputChange('description', e.target.value)}
//           placeholder="Provide a detailed description of your election..."
//           className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//           rows={6}
//           maxLength={5000}
//         />
//         <div className="mt-1 flex justify-between">
//           <ValidationErrors errors={errors.description ? [errors.description] : []} />
//           <span className="text-xs text-gray-500">{(formData.description || '').length}/5000</span>
//         </div>
//       </div>

//       {/* Media Upload Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Topic Image */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Election Image
//           </label>
//           <ImageUploader
//             value={formData.topicImageUrl}
//             onChange={handleTopicImageChange}
//             fieldName="topicImage"
//             maxSize={5 * 1024 * 1024} // 5MB
//             allowedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
//             className="w-full"
//             placeholder="Upload election image"
//             error={errors.topicImage}
//           />
//           <p className="mt-1 text-xs text-gray-500">
//             Upload an image that represents your election (max 5MB)
//           </p>
//         </div>

//         {/* Logo Branding */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Logo/Branding
//           </label>
//           <ImageUploader
//             value={formData.logoBrandingUrl}
//             onChange={handleLogoBrandingChange}
//             fieldName="logoBranding"
//             maxSize={2 * 1024 * 1024} // 2MB
//             allowedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml']}
//             className="w-full"
//             placeholder="Upload logo/branding"
//             error={errors.logoBranding}
//           />
//           <p className="mt-1 text-xs text-gray-500">
//             Upload your organization logo or branding (max 2MB)
//           </p>
//         </div>
//       </div>

//       {/* Topic Video */}
//       <div className="mt-6 video">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Election Video (Optional)
//         </label>
//         <VideoUploader
//           value={formData.topicVideoUrl}
//           onChange={(url) => handleInputChange('topicVideoUrl', url)}
//           context="election_topic"
//           maxSize={50 * 1024 * 1024} // 50MB
//           acceptedTypes={['video/mp4', 'video/webm', 'video/ogg']}
//         />
//         <p className="mt-1 text-xs text-gray-500">
//           Upload a video explaining your election (max 50MB, recommended duration: 2-5 minutes)
//         </p>
//       </div>

//       {/* Scheduling Section */}
//       <div className="border-t border-gray-200 pt-6">
//         <h4 className="text-md font-medium text-gray-900 mb-4">Election Scheduling</h4>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Start Date & Time */}
//           <div>
//             <DateTimePicker
//               label="Start Date & Time"
//               value={formData.startDate}
//               onChange={(value) => updateFormData({ startDate: value })}
//               minDate={new Date().toISOString().split('T')[0]}
//               error={errors.startDate}
//               required
//             />
//             <ValidationErrors errors={errors.startDate ? [errors.startDate] : []} />
//           </div>

//           {/* End Date & Time */}
//           <div>
//             <DateTimePicker
//               label="End Date & Time"
//               value={formData.endDate}
//               onChange={(value) => updateFormData({ endDate: value })}
//               minDate={formData.startDate?.date || new Date().toISOString().split('T')[0]}
//               error={errors.endDate}
//               required
//             />
//             <ValidationErrors errors={errors.endDate ? [errors.endDate] : []} />
//           </div>
//         </div>

//         {/* Timezone */}
//         <div className="mt-4">
//           <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
//             Timezone
//           </label>
//           <select
//             id="timezone"
//             value={formData.timezone || 'UTC'}
//             onChange={(e) => handleInputChange('timezone', e.target.value)}
//             className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="UTC">UTC (Coordinated Universal Time)</option>
//             <option value="America/New_York">Eastern Time (ET)</option>
//             <option value="America/Chicago">Central Time (CT)</option>
//             <option value="America/Denver">Mountain Time (MT)</option>
//             <option value="America/Los_Angeles">Pacific Time (PT)</option>
//             <option value="Europe/London">Greenwich Mean Time (GMT)</option>
//             <option value="Europe/Paris">Central European Time (CET)</option>
//             <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
//             <option value="Asia/Shanghai">China Standard Time (CST)</option>
//             <option value="Asia/Kolkata">India Standard Time (IST)</option>
//             <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
//             <option value="Australia/Sydney">Australian Eastern Time (AET)</option>
//           </select>
//         </div>
//       </div>

//       {/* Custom URL Section */}
//       <div className="border-t border-gray-200 pt-6">
//         <h4 className="text-md font-medium text-gray-900 mb-4">Custom Election URL</h4>
        
//         <div>
//           <label htmlFor="customVotingUrl" className="block text-sm font-medium text-gray-700 mb-2">
//             Custom URL Slug (Optional)
//           </label>
//           <div className="flex">
//             <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
//               vottery.com/vote/
//             </span>
//             <input
//               type="text"
//               id="customVotingUrl"
//               value={formData.customVotingUrl || ''}
//               onChange={(e) => handleInputChange('customVotingUrl', e.target.value)}
//               placeholder="my-election-2024"
//               className={`flex-1 px-3 py-2 border rounded-r-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
//                 errors.customVotingUrl ? 'border-red-300' : 'border-gray-300'
//               }`}
//               pattern="[a-zA-Z0-9-_]+"
//               maxLength={200}
//             />
//           </div>
//           <div className="mt-1 flex justify-between">
//             <ValidationErrors errors={errors.customVotingUrl ? [errors.customVotingUrl] : []} />
//             <span className="text-xs text-gray-500">Only letters, numbers, hyphens, and underscores allowed</span>
//           </div>
//         </div>
//       </div>

//       {/* Election Duration Preview */}
//       {formData.startDate?.date && formData.endDate?.date && (
//         <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
//           <h5 className="text-sm font-medium text-blue-900 mb-2">Election Duration Preview</h5>
//           <div className="text-sm text-blue-700">
//             <p>
//               <strong>Starts:</strong> {new Date(`${formData.startDate.date}T${formData.startDate.time || '09:00'}`).toLocaleString('en-US', {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 timeZoneName: 'short'
//               })}
//             </p>
//             <p>
//               <strong>Ends:</strong> {new Date(`${formData.endDate.date}T${formData.endDate.time || '18:00'}`).toLocaleString('en-US', {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 timeZoneName: 'short'
//               })}
//             </p>
//             <p>
//               <strong>Duration:</strong> {(() => {
//                 const start = new Date(`${formData.startDate.date}T${formData.startDate.time || '09:00'}`);
//                 const end = new Date(`${formData.endDate.date}T${formData.endDate.time || '18:00'}`);
//                 const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
//                 return `${duration} day${duration !== 1 ? 's' : ''}`;
//               })()}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BasicElectionSetup;
//last working code
// import ImageUploader from '../forms/ImageUploader';
// import VideoUploader from '../forms/VideoUploader';
// import DateTimePicker from '../forms/DateTimePicker';
// import ValidationErrors from '../common/ValidationErrors';

// const BasicElectionSetup = ({ formData, updateFormData, errors}) => {
//   const handleInputChange = (field, value) => {
//     updateFormData({ [field]: value });
//   };

//   const generateSlug = (title) => {
//     return title
//       .toLowerCase()
//       .replace(/[^a-z0-9\s-]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/-+/g, '-')
//       .replace(/^-|-$/g, '')
//       .substring(0, 50);
//   };

//   const handleTitleChange = (value) => {
//     updateFormData({ 
//       title: value,
//       // Auto-generate custom URL if not already set
//       customVotingUrl: formData.customVotingUrl || generateSlug(value)
//     });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="border-b border-gray-200 pb-4">
//         <h3 className="text-lg font-medium text-gray-900">Basic Election Setup</h3>
//         <p className="mt-1 text-sm text-gray-600">
//           Set up the fundamental details of your election including title, description, and scheduling.
//         </p>
//       </div>

//       {/* Election Title */}
//       <div>
//         <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//           Election Title *
//         </label>
//         <input
//           type="text"
//           id="title"
//           value={formData.title}
//           onChange={(e) => handleTitleChange(e.target.value)}
//           placeholder="Enter a clear, descriptive title for your election"
//           className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
//             errors.title ? 'border-red-300' : 'border-gray-300'
//           }`}
//           maxLength={500}
//         />
//         <div className="mt-1 flex justify-between">
//           <ValidationErrors errors={errors.title ? [errors.title] : []} />
//           <span className="text-xs text-gray-500">{formData.title.length}/500</span>
//         </div>
//       </div>

//       {/* Election Description */}
//       <div>
//         <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//           Election Description
//         </label>
       
//     <textarea
//   value={formData.description}
//   onChange={(e) => handleInputChange('description', e.target.value)}
//   placeholder="Provide a detailed description of your election..."
//   className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//   rows={6}
// />
//         <div className="mt-1 flex justify-between">
//           <ValidationErrors errors={errors.description ? [errors.description] : []} />
//           <span className="text-xs text-gray-500">{formData.description.length}/5000</span>
//         </div>
//       </div>

//       {/* Media Upload Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Topic Image */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Election Image
//           </label>
//           <ImageUploader
//             value={formData.topicImageUrl}
//             onChange={(url) => handleInputChange('topicImageUrl', url)}
//             context="election_topic"
//             maxSize={5 * 1024 * 1024} // 5MB
//             acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
//             className="w-full h-32"
//           />
//           <p className="mt-1 text-xs text-gray-500">
//             Upload an image that represents your election (max 5MB)
//           </p>
//         </div>

//         {/* Logo Branding */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Logo/Branding
//           </label>
//           <ImageUploader
//             value={formData.logoBrandingUrl}
//             onChange={(url) => handleInputChange('logoBrandingUrl', url)}
//             context="election_logo"
//             maxSize={2 * 1024 * 1024} // 2MB
//             acceptedTypes={['image/jpeg', 'image/png', 'image/svg+xml']}
//             className="w-full h-32"
//           />
//           <p className="mt-1 text-xs text-gray-500">
//             Upload your organization logo or branding (max 2MB)
//           </p>
//         </div>
//       </div>

//       {/* Topic Video */}
//       <div className="mt-6 video">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
          
//           Election Video (Optional)
//         </label>
//         <VideoUploader
//           value={formData.topicVideoUrl}
//           onChange={(url) => handleInputChange('topicVideoUrl', url)}
//           context="election_topic"
//           maxSize={50 * 1024 * 1024} // 50MB
//           acceptedTypes={['video/mp4', 'video/webm', 'video/ogg']}
//         />
//         <p className="mt-1 text-xs text-gray-500">
//           Upload a video explaining your election (max 50MB, recommended duration: 2-5 minutes)
//         </p>
//       </div>

//       {/* Scheduling Section */}
//       <div className="border-t border-gray-200 pt-6">
//         <h4 className="text-md font-medium text-gray-900 mb-4">Election Scheduling</h4>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Start Date & Time */}
//           <div>
//             <DateTimePicker
//               label="Start Date & Time"
//               value={formData.startDate}
//               onChange={(value) => updateFormData({ startDate: value })}
//               minDate={new Date().toISOString().split('T')[0]}
//               error={errors.startDate}
//               required
//             />
//             <ValidationErrors errors={errors.startDate ? [errors.startDate] : []} />
//           </div>

//           {/* End Date & Time */}
//           <div>
//             <DateTimePicker
//               label="End Date & Time"
//               value={formData.endDate}
//               onChange={(value) => updateFormData({ endDate: value })}
//               minDate={formData.startDate?.date || new Date().toISOString().split('T')[0]}
//               error={errors.endDate}
//               required
//             />
//             <ValidationErrors errors={errors.endDate ? [errors.endDate] : []} />
//           </div>
//         </div>

//         {/* Timezone */}
//         <div className="mt-4">
//           <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
//             Timezone
//           </label>
//           <select
//             id="timezone"
//             value={formData.timezone}
//             onChange={(e) => handleInputChange('timezone', e.target.value)}
//             className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="UTC">UTC (Coordinated Universal Time)</option>
//             <option value="America/New_York">Eastern Time (ET)</option>
//             <option value="America/Chicago">Central Time (CT)</option>
//             <option value="America/Denver">Mountain Time (MT)</option>
//             <option value="America/Los_Angeles">Pacific Time (PT)</option>
//             <option value="Europe/London">Greenwich Mean Time (GMT)</option>
//             <option value="Europe/Paris">Central European Time (CET)</option>
//             <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
//             <option value="Asia/Shanghai">China Standard Time (CST)</option>
//             <option value="Asia/Kolkata">India Standard Time (IST)</option>
//             <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
//             <option value="Australia/Sydney">Australian Eastern Time (AET)</option>
//           </select>
//         </div>
//       </div>

//       {/* Custom URL Section */}
//       <div className="border-t border-gray-200 pt-6">
//         <h4 className="text-md font-medium text-gray-900 mb-4">Custom Election URL</h4>
        
//         <div>
//           <label htmlFor="customVotingUrl" className="block text-sm font-medium text-gray-700 mb-2">
//             Custom URL Slug (Optional)
//           </label>
//           <div className="flex">
//             <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
//               vottery.com/vote/
//             </span>
//             <input
//               type="text"
//               id="customVotingUrl"
//               value={formData.customVotingUrl}
//               onChange={(e) => handleInputChange('customVotingUrl', e.target.value)}
//               placeholder="my-election-2024"
//               className={`flex-1 px-3 py-2 border rounded-r-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
//                 errors.customVotingUrl ? 'border-red-300' : 'border-gray-300'
//               }`}
//               pattern="[a-zA-Z0-9-_]+"
//               maxLength={200}
//             />
//           </div>
//           <div className="mt-1 flex justify-between">
//             <ValidationErrors errors={errors.customVotingUrl ? [errors.customVotingUrl] : []} />
//             <span className="text-xs text-gray-500">Only letters, numbers, hyphens, and underscores allowed</span>
//           </div>
//         </div>
//       </div>

//       {/* Election Duration Preview */}
//       {formData.startDate?.date && formData.endDate?.date && (
//         <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
//           <h5 className="text-sm font-medium text-blue-900 mb-2">Election Duration Preview</h5>
//           <div className="text-sm text-blue-700">
//             <p>
//               <strong>Starts:</strong> {new Date(`${formData.startDate.date}T${formData.startDate.time || '09:00'}`).toLocaleString('en-US', {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 timeZoneName: 'short'
//               })}
//             </p>
//             <p>
//               <strong>Ends:</strong> {new Date(`${formData.endDate.date}T${formData.endDate.time || '18:00'}`).toLocaleString('en-US', {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 timeZoneName: 'short'
//               })}
//             </p>
//             <p>
//               <strong>Duration:</strong> {(() => {
//                 const start = new Date(`${formData.startDate.date}T${formData.startDate.time || '09:00'}`);
//                 const end = new Date(`${formData.endDate.date}T${formData.endDate.time || '18:00'}`);
//                 const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
//                 return `${duration} day${duration !== 1 ? 's' : ''}`;
//               })()}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Debug Section - Remove after testing */}
//       {/* <div className="bg-gray-100 p-4 rounded-lg text-xs">
//         <h4 className="font-semibold mb-2">Debug Info:</h4>
//         <pre>{JSON.stringify({ 
//           startDate: formData.startDate, 
//           endDate: formData.endDate,
//           title: formData.title
//         }, null, 2)}</pre>
//       </div> */}
//     </div>
//   );
// };

// export default BasicElectionSetup;