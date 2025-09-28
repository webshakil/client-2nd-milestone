
import React, { useState, useRef } from 'react';
import { Upload, X, Video, AlertCircle, Check, Eye, Play, Link, ExternalLink } from 'lucide-react';

const VideoUploader = ({
  value = null,
  onChange,
  error = null,
  disabled = false,
  accept = "video/*",
  maxSize = 100 * 1024 * 1024, // 100MB
  allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
  className = "",
  placeholder = "Upload video or enter video URL",
  showPreview = true,
  allowUrl = true,
  urlPlaceholder = "https://youtube.com/watch?v=... or https://vimeo.com/..."
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [videoUrl, setVideoUrl] = useState(value || '');
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const supportedUrls = [
    { pattern: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/, name: 'YouTube' },
    { pattern: /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/, name: 'YouTube' },
    { pattern: /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/, name: 'Vimeo' },
    { pattern: /(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/video\/([a-zA-Z0-9]+)/, name: 'Dailymotion' },
    { pattern: /^https?:\/\/.+\.(mp4|webm|ogg|avi|mov)(\?.*)?$/i, name: 'Direct Video' }
  ];

  const validateUrl = (url) => {
    if (!url) return false;
    return supportedUrls.some(support => support.pattern.test(url));
  };

  const getVideoEmbedUrl = (url) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Direct video or other
    return url;
  };

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
      const videoUrl = e.target.result;
      setPreviewUrl(videoUrl);
      setVideoUrl(videoUrl);
      setIsUploading(false);
      if (onChange) onChange(videoUrl, null);
    };

    reader.onerror = () => {
      setIsUploading(false);
      if (onChange) onChange(null, 'Failed to read file');
    };

    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (!videoUrl.trim()) {
      if (onChange) onChange(null, 'Please enter a video URL');
      return;
    }

    if (!validateUrl(videoUrl)) {
      if (onChange) onChange(null, 'Invalid video URL. Supported: YouTube, Vimeo, Dailymotion, or direct video links');
      return;
    }

    setPreviewUrl(getVideoEmbedUrl(videoUrl));
    if (onChange) onChange(videoUrl, null);
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
    if (!disabled && fileInputRef.current && uploadMode === 'file') {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setVideoUrl('');
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

  const isEmbedUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('vimeo.com') || url.includes('dailymotion.com'));
  };

  return (
    <div className={`${className}`}>
      {/* Upload Mode Toggle */}
      {allowUrl && (
        <div className="mb-4 flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setUploadMode('file')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              uploadMode === 'file'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            disabled={disabled}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              uploadMode === 'url'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            disabled={disabled}
          >
            <Link className="w-4 h-4 inline mr-2" />
            Video URL
          </button>
        </div>
      )}

      {uploadMode === 'url' ? (
        /* URL Input Mode */
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder={urlPlaceholder}
              className={`flex-1 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={disabled}
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={disabled || !videoUrl.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Video
            </button>
          </div>

          <div className="text-xs text-gray-500">
            <p>Supported platforms:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="bg-gray-100 px-2 py-1 rounded">YouTube</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Vimeo</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Dailymotion</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Direct Links</span>
            </div>
          </div>
        </div>
      ) : (
        /* File Upload Mode */
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
          style={{ minHeight: '200px' }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={disabled}
          />

          <div className="flex flex-col items-center justify-center p-6 h-full">
            {isUploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Uploading video...</p>
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
                      <Video className="w-12 h-12" />
                      {isDragging && (
                        <div className="absolute inset-0 bg-blue-400 opacity-20 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  )}
                </div>
                
                <p className={`text-sm font-medium mb-2 ${
                  error ? 'text-red-600' : 'text-gray-700'
                }`}>
                  {error || (isDragging ? 'Drop video here' : placeholder)}
                </p>
                
                {!error && (
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>or drag and drop</p>
                    <p>
                      {allowedTypes.map(type => type.split('/')[1]).join(', ').toUpperCase()} up to {formatFileSize(maxSize)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Preview */}
      {previewUrl && showPreview && (
        <div className="mt-4 relative bg-black rounded-lg overflow-hidden">
          {isEmbedUrl(videoUrl) ? (
            <div className="aspect-video">
              <iframe
                src={previewUrl}
                title="Video Preview"
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video">
              <video
                src={previewUrl}
                controls
                className="w-full h-full object-contain"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

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

          {/* External Link Button */}
          {videoUrl && isEmbedUrl(videoUrl) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.open(videoUrl, '_blank');
              }}
              className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center space-x-1 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Video Info */}
      {previewUrl && !error && (
        <div className="mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Video className="w-4 h-4" />
            <span>
              {uploadMode === 'url' ? 'Video URL added successfully' : 'Video uploaded successfully'}
            </span>
          </div>
          {videoUrl && uploadMode === 'url' && (
            <div className="mt-1 flex items-center space-x-1">
              <ExternalLink className="w-3 h-3" />
              <span className="truncate">{videoUrl}</span>
            </div>
          )}
        </div>
      )}

      {/* Upload Guidelines */}
      {/* {!previewUrl && !error && (
        <div className="mt-2 text-xs text-gray-500">
          <p>💡 Video guidelines:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Use MP4 format for best compatibility</li>
            <li>Keep file size under {formatFileSize(maxSize)}</li>
            <li>Ensure good audio quality</li>
            <li>YouTube and Vimeo URLs are automatically embedded</li>
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default VideoUploader;