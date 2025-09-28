import React, { useState, useRef } from 'react';
import { Upload, X, Image, AlertCircle, Check, Eye } from 'lucide-react';

const ImageUploader = ({
  value = null,
  onChange,
  error = null,
  disabled = false,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  className = "",
  placeholder = "Click to upload image",
  showPreview = true,
  multiple = false,
  aspectRatio = null, // e.g., "16:9", "1:1", "4:3"
  dimensions = null, // e.g., { width: 1200, height: 600 }
  fieldName = "image" // Add this for identifying which field this is
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(
    value && typeof value === 'string' ? value : (value?.previewUrl || null)
  );
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    if (disabled || !files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      const allowedTypesStr = allowedTypes.map(type => type.split('/')[1]).join(', ');
      if (onChange) onChange(null, `Invalid file type. Allowed: ${allowedTypesStr}`);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      if (onChange) onChange(null, `File too large. Maximum size: ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);

    // Create file reader for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      
      // Validate dimensions if specified
      if (dimensions) {
        const img = new Image();
        img.onload = () => {
          if (img.width !== dimensions.width || img.height !== dimensions.height) {
            setIsUploading(false);
            if (onChange) onChange(null, `Image must be ${dimensions.width}x${dimensions.height} pixels`);
            return;
          }
          
          setPreviewUrl(imageUrl);
          setIsUploading(false);
          
          // Return both file object and preview URL
          if (onChange) onChange({
            file: file,
            previewUrl: imageUrl,
            fieldName: fieldName,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
          }, null);
        };
        img.src = imageUrl;
      } else {
        setPreviewUrl(imageUrl);
        setIsUploading(false);
        
        // Return both file object and preview URL
        if (onChange) onChange({
          file: file,
          previewUrl: imageUrl,
          fieldName: fieldName,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        }, null);
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      if (onChange) onChange(null, 'Failed to read file');
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    if (onChange) onChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAspectRatioStyle = () => {
    if (!aspectRatio) return {};
    
    const [width, height] = aspectRatio.split(':').map(Number);
    const paddingBottom = (height / width) * 100;
    
    return {
      paddingBottom: `${paddingBottom}%`,
      position: 'relative'
    };
  };

  return (
    <div className={`${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : previewUrl
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-gray-50'
        } ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        style={aspectRatio ? getAspectRatioStyle() : { minHeight: '200px' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        {/* Content */}
        <div className={`flex flex-col items-center justify-center p-6 ${
          aspectRatio ? 'absolute inset-0' : 'h-full'
        }`}>
          {isUploading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : previewUrl && showPreview ? (
            <div className="relative w-full h-full">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded"
              />
              
              {/* Remove Button */}
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Success Indicator */}
              <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>

              {/* Preview Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(previewUrl, '_blank');
                }}
                className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className={`mx-auto mb-4 ${
                error ? 'text-red-400' : isDragging ? 'text-blue-400' : 'text-gray-400'
              }`}>
                {error ? (
                  <AlertCircle className="w-12 h-12" />
                ) : (
                  <div className="relative">
                    <Upload className="w-12 h-12" />
                    {isDragging && (
                      <div className="absolute inset-0 bg-blue-400 opacity-20 rounded-full animate-pulse"></div>
                    )}
                  </div>
                )}
              </div>
              
              <p className={`text-sm font-medium mb-2 ${
                error ? 'text-red-600' : 'text-gray-700'
              }`}>
                {error || (isDragging ? 'Drop image here' : placeholder)}
              </p>
              
              {!error && (
                <div className="text-xs text-gray-500 space-y-1">
                  <p>or drag and drop</p>
                  <p>
                    {allowedTypes.map(type => type.split('/')[1]).join(', ').toUpperCase()} up to {formatFileSize(maxSize)}
                  </p>
                  {dimensions && (
                    <p>Required size: {dimensions.width}×{dimensions.height}px</p>
                  )}
                  {aspectRatio && (
                    <p>Aspect ratio: {aspectRatio}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center space-x-1 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* File Info */}
      {previewUrl && !error && (
        <div className="mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Image className="w-4 h-4" />
            <span>Image uploaded successfully</span>
            {value?.fileName && (
              <span>• {value.fileName} ({formatFileSize(value.fileSize || 0)})</span>
            )}
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      {!previewUrl && !error && (
        <div className="mt-2 text-xs text-gray-500">
          <p>💡 For best results:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Use high-quality images</li>
            <li>Ensure good lighting and contrast</li>
            {dimensions && <li>Upload images at exactly {dimensions.width}×{dimensions.height}px</li>}
            {aspectRatio && <li>Maintain {aspectRatio} aspect ratio</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
//this is last workable file
// import React, { useState, useRef } from 'react';
// import { Upload, X, Image, AlertCircle, Check, Eye } from 'lucide-react';

// const ImageUploader = ({
//   value = null,
//   onChange,
//   error = null,
//   disabled = false,
//   accept = "image/*",
//   maxSize = 10 * 1024 * 1024, // 10MB
//   allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
//   className = "",
//   placeholder = "Click to upload image",
//   showPreview = true,
//   multiple = false,
//   aspectRatio = null, // e.g., "16:9", "1:1", "4:3"
//   dimensions = null // e.g., { width: 1200, height: 600 }
// }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(value);
//   const fileInputRef = useRef(null);

//   const handleFileSelect = (files) => {
//     if (disabled || !files || files.length === 0) return;

//     const file = files[0];
    
//     // Validate file type
//     if (!allowedTypes.includes(file.type)) {
//       const allowedTypesStr = allowedTypes.map(type => type.split('/')[1]).join(', ');
//       if (onChange) onChange(null, `Invalid file type. Allowed: ${allowedTypesStr}`);
//       return;
//     }

//     // Validate file size
//     if (file.size > maxSize) {
//       const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
//       if (onChange) onChange(null, `File too large. Maximum size: ${maxSizeMB}MB`);
//       return;
//     }

//     setIsUploading(true);

//     // Create file reader for preview
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const imageUrl = e.target.result;
//       setPreviewUrl(imageUrl);
      
//       // Validate dimensions if specified
//       if (dimensions) {
//         const img = new Image();
//         img.onload = () => {
//           if (img.width !== dimensions.width || img.height !== dimensions.height) {
//             setIsUploading(false);
//             if (onChange) onChange(null, `Image must be ${dimensions.width}x${dimensions.height} pixels`);
//             return;
//           }
          
//           setIsUploading(false);
//           if (onChange) onChange(imageUrl, null);
//         };
//         img.src = imageUrl;
//       } else {
//         setIsUploading(false);
//         if (onChange) onChange(imageUrl, null);
//       }
//     };

//     reader.onerror = () => {
//       setIsUploading(false);
//       if (onChange) onChange(null, 'Failed to read file');
//     };

//     reader.readAsDataURL(file);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
    
//     const files = Array.from(e.dataTransfer.files);
//     handleFileSelect(files);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     if (!disabled) setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleClick = () => {
//     if (!disabled && fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleRemove = (e) => {
//     e.stopPropagation();
//     setPreviewUrl(null);
//     if (onChange) onChange(null, null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const getAspectRatioStyle = () => {
//     if (!aspectRatio) return {};
    
//     const [width, height] = aspectRatio.split(':').map(Number);
//     const paddingBottom = (height / width) * 100;
    
//     return {
//       paddingBottom: `${paddingBottom}%`,
//       position: 'relative'
//     };
//   };

//   return (
//     <div className={`${className}`}>
//       <div
//         className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
//           isDragging
//             ? 'border-blue-400 bg-blue-50'
//             : error
//             ? 'border-red-300 bg-red-50'
//             : previewUrl
//             ? 'border-green-300 bg-green-50'
//             : 'border-gray-300 bg-gray-50'
//         } ${
//           disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'
//         }`}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onClick={handleClick}
//         style={aspectRatio ? getAspectRatioStyle() : { minHeight: '200px' }}
//       >
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept={accept}
//           multiple={multiple}
//           onChange={(e) => handleFileSelect(e.target.files)}
//           className="hidden"
//           disabled={disabled}
//         />

//         {/* Content */}
//         <div className={`flex flex-col items-center justify-center p-6 ${
//           aspectRatio ? 'absolute inset-0' : 'h-full'
//         }`}>
//           {isUploading ? (
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
//               <p className="text-sm text-gray-600">Uploading...</p>
//             </div>
//           ) : previewUrl && showPreview ? (
//             <div className="relative w-full h-full">
//               <img
//                 src={previewUrl}
//                 alt="Preview"
//                 className="w-full h-full object-cover rounded"
//               />
              
//               {/* Remove Button */}
//               {!disabled && (
//                 <button
//                   type="button"
//                   onClick={handleRemove}
//                   className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               )}

//               {/* Success Indicator */}
//               <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
//                 <Check className="w-4 h-4" />
//               </div>

//               {/* Preview Button */}
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   window.open(previewUrl, '_blank');
//                 }}
//                 className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors"
//               >
//                 <Eye className="w-4 h-4" />
//               </button>
//             </div>
//           ) : (
//             <div className="text-center">
//               <div className={`mx-auto mb-4 ${
//                 error ? 'text-red-400' : isDragging ? 'text-blue-400' : 'text-gray-400'
//               }`}>
//                 {error ? (
//                   <AlertCircle className="w-12 h-12" />
//                 ) : (
//                   <div className="relative">
//                     <Upload className="w-12 h-12" />
//                     {isDragging && (
//                       <div className="absolute inset-0 bg-blue-400 opacity-20 rounded-full animate-pulse"></div>
//                     )}
//                   </div>
//                 )}
//               </div>
              
//               <p className={`text-sm font-medium mb-2 ${
//                 error ? 'text-red-600' : 'text-gray-700'
//               }`}>
//                 {error || (isDragging ? 'Drop image here' : placeholder)}
//               </p>
              
//               {!error && (
//                 <div className="text-xs text-gray-500 space-y-1">
//                   <p>or drag and drop</p>
//                   <p>
//                     {allowedTypes.map(type => type.split('/')[1]).join(', ').toUpperCase()} up to {formatFileSize(maxSize)}
//                   </p>
//                   {dimensions && (
//                     <p>Required size: {dimensions.width}×{dimensions.height}px</p>
//                   )}
//                   {aspectRatio && (
//                     <p>Aspect ratio: {aspectRatio}</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mt-2 flex items-center space-x-1 text-red-600">
//           <AlertCircle className="w-4 h-4" />
//           <span className="text-sm">{error}</span>
//         </div>
//       )}

//       {/* File Info */}
//       {previewUrl && !error && (
//         <div className="mt-2 text-xs text-gray-500">
//           <div className="flex items-center space-x-2">
//             <Image className="w-4 h-4" />
//             <span>Image uploaded successfully</span>
//           </div>
//         </div>
//       )}

//       {/* Upload Guidelines */}
//       {!previewUrl && !error && (
//         <div className="mt-2 text-xs text-gray-500">
//           <p>💡 For best results:</p>
//           <ul className="list-disc list-inside mt-1 space-y-1">
//             <li>Use high-quality images</li>
//             <li>Ensure good lighting and contrast</li>
//             {dimensions && <li>Upload images at exactly {dimensions.width}×{dimensions.height}px</li>}
//             {aspectRatio && <li>Maintain {aspectRatio} aspect ratio</li>}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUploader;