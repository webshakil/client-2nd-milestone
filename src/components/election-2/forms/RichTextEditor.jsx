import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Type,
  Eye,
  Edit,
  Undo,
  Redo
} from 'lucide-react';

const RichTextEditor = ({ 
  value = '', 
  onChange = () => {}, 
  placeholder = "Start typing...",
  error = null,
  disabled = false,
  maxLength = 5000,
  minHeight = "200px"
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const editorRef = useRef(null);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Save to history for undo/redo
  const saveToHistory = useCallback((content) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(content);
      if (newHistory.length > 50) newHistory.shift(); // Limit history size
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const formatText = (command, value = null) => {
    if (disabled) return;
    
    // Save selection before formatting
    const selection = window.getSelection();
    /*eslint-disable*/
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    
    // Focus the editor first
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    // Execute command
    document.execCommand(command, false, value);
    
    // Trigger change event
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current && onChange) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      saveToHistory(content);
    }
  };

  const handleInput = (e) => {
    handleContentChange();
  };

  const handleKeyDown = (e) => {
    // Handle common keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
        case 'u':
          e.preventDefault();
          formatText('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          break;
        case 'y':
          e.preventDefault();
          handleRedo();
          break;
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    
    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/plain');
    
    // Insert as plain text to avoid formatting issues
    document.execCommand('insertText', false, text);
    handleContentChange();
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const content = history[newIndex];
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        onChange(content);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const content = history[newIndex];
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        onChange(content);
      }
    }
  };

  const insertLink = () => {
    if (disabled) return;
    
    const selection = window.getSelection();
    const selectedText = selection.toString();
    
    const url = prompt('Enter URL:', 'https://');
    if (url) {
      if (selectedText) {
        formatText('createLink', url);
      } else {
        const linkText = prompt('Enter link text:', url);
        if (linkText) {
          document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${linkText}</a>`);
          handleContentChange();
        }
      }
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' }
  ];

  const headingOptions = [
    { value: 'div', label: 'Normal' },
    { value: 'h1', label: 'Heading 1' },
    { value: 'h2', label: 'Heading 2' },
    { value: 'h3', label: 'Heading 3' },
    { value: 'h4', label: 'Heading 4' }
  ];

  const getTextContent = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return div.textContent || div.innerText || '';
  };

  const currentLength = getTextContent(value).length;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-3 flex flex-wrap items-center gap-2">
        {/* Heading Selector */}
        <select
          className="text-sm border border-gray-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={(e) => formatText('formatBlock', e.target.value)}
          disabled={disabled}
        >
          {headingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="w-px h-6 bg-gray-300" />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={handleUndo}
          className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
          disabled={disabled || historyIndex <= 0}
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleRedo}
          className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
          disabled={disabled || historyIndex >= history.length - 1}
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Formatting Buttons */}
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={() => button.value ? formatText(button.command, button.value) : formatText(button.command)}
            className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={button.title}
            disabled={disabled}
          >
            <button.icon className="w-4 h-4" />
          </button>
        ))}

        {/* Link Button */}
        <button
          type="button"
          onClick={insertLink}
          className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Insert Link"
          disabled={disabled}
        >
          <Link className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Preview Toggle */}
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`p-2 rounded transition-colors ${
            isPreview ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
          }`}
          title={isPreview ? 'Edit Mode' : 'Preview Mode'}
        >
          {isPreview ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* Word Count */}
        <div className="ml-auto text-sm text-gray-600 bg-white px-2 py-1 rounded border">
          {currentLength}/{maxLength}
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative bg-white">
        {isPreview ? (
          /* Preview Mode */
          <div
            className="p-6 prose prose-sm max-w-none min-h-[200px]"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ 
              __html: value || '<p class="text-gray-400 italic">Nothing to preview</p>' 
            }}
          />
        ) : (
          /* Edit Mode */
          <div
            ref={editorRef}
            contentEditable={!disabled}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className={`p-6 outline-none focus:ring-0 min-h-[200px] ${
              disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
            } ${error ? 'ring-2 ring-red-300' : ''}`}
            style={{ 
              minHeight,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
            suppressContentEditableWarning={true}
            spellCheck="true"
          />
        )}

        {/* Placeholder - only show when empty and not in preview */}
        {!value && !isPreview && (
          <div 
            className="absolute top-6 left-6 text-gray-400 pointer-events-none select-none"
          >
            {placeholder}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 py-3 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
            {error}
          </p>
        </div>
      )}

      {/* Character Limit Warning */}
      {currentLength > maxLength * 0.9 && (
        <div className={`px-6 py-3 border-t ${
          currentLength > maxLength 
            ? 'bg-red-50 border-red-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <p className={`text-sm ${
            currentLength > maxLength ? 'text-red-700' : 'text-yellow-700'
          }`}>
            {currentLength > maxLength 
              ? `Content exceeds limit by ${currentLength - maxLength} characters`
              : `${maxLength - currentLength} characters remaining`
            }
          </p>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        [contentEditable] {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        [contentEditable]:focus {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        [contentEditable] * {
          max-width: 100%;
        }
        
        [contentEditable] h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem 0;
          line-height: 1.2;
          color: #1f2937;
        }
        
        [contentEditable] h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
          line-height: 1.3;
          color: #1f2937;
        }
        
        [contentEditable] h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
          line-height: 1.4;
          color: #1f2937;
        }
        
        [contentEditable] h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
          line-height: 1.4;
          color: #1f2937;
        }
        
        [contentEditable] p {
          margin: 0.5rem 0;
          line-height: 1.6;
          color: #374151;
        }
        
        [contentEditable] ul, [contentEditable] ol {
          margin: 0.5rem 0 0.5rem 2rem;
          padding: 0;
        }
        
        [contentEditable] li {
          margin: 0.25rem 0;
          line-height: 1.6;
        }
        
        [contentEditable] blockquote {
          border-left: 4px solid #3b82f6;
          background-color: #f8fafc;
          padding: 1rem 1.5rem;
          margin: 1rem 0;
          font-style: italic;
          color: #64748b;
          border-radius: 0 0.375rem 0.375rem 0;
        }
        
        [contentEditable] a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        [contentEditable] a:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
        
        [contentEditable] strong {
          font-weight: 700;
          color: #1f2937;
        }
        
        [contentEditable] em {
          font-style: italic;
        }
        
        [contentEditable] u {
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        [contentEditable] br {
          display: block;
          margin: 0.5rem 0;
          content: "";
        }
        
        /* Preview styles */
        .prose h1, .prose h2, .prose h3, .prose h4 {
          color: #1f2937;
          font-weight: 600;
        }
        
        .prose p {
          color: #374151;
          line-height: 1.6;
          margin: 0.5rem 0;
        }
        
        .prose ul, .prose ol {
          color: #374151;
          margin: 0.5rem 0 0.5rem 2rem;
        }
        
        .prose li {
          margin: 0.25rem 0;
        }
        
        .prose blockquote {
          border-left: 4px solid #3b82f6;
          background-color: #f8fafc;
          padding: 1rem 1.5rem;
          margin: 1rem 0;
          font-style: italic;
          color: #64748b;
          border-radius: 0 0.375rem 0.375rem 0;
        }
        
        .prose a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .prose strong {
          font-weight: 700;
          color: #1f2937;
        }
        
        .prose em {
          font-style: italic;
        }
        
        .prose u {
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

// Demo component to show the editor in action
const EditorDemo = () => {
  const [content, setContent] = useState('<p>Welcome to the rich text editor! Try typing, formatting, and using all the features.</p>');
  const [error, setError] = useState(null);

  const handleChange = (newContent) => {
    setContent(newContent);
    
    // Clear any previous errors
    if (error) {
      setError(null);
    }
    
    // Example validation
    const textLength = newContent.replace(/<[^>]*>/g, '').length;
    if (textLength > 5000) {
      setError('Content is too long!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rich Text Editor</h1>
        <p className="text-gray-600">A fully functional rich text editor with proper text handling, formatting, and all normal behaviors.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <RichTextEditor
          value={content}
          onChange={handleChange}
          placeholder="Start writing your content here..."
          error={error}
          maxLength={5000}
          minHeight="300px"
        />
      </div>
      
      {/* <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Features:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Proper cursor positioning and text selection</li>
          <li>• Normal deletion and backspace behavior</li>
          <li>• Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y)</li>
          <li>• Undo/Redo functionality</li>
          <li>• Clean paste handling</li>
          <li>• Real-time character counting</li>
          <li>• Preview mode</li>
          <li>• Responsive design</li>
        </ul>
      </div> */}
    </div>
  );
};

export default EditorDemo;
// import React, { useState, useRef } from 'react';
// import { 
//   Bold, 
//   Italic, 
//   Underline, 
//   List, 
//   ListOrdered, 
//   Link, 
//   Quote, 
//   AlignLeft, 
//   AlignCenter, 
//   AlignRight,
//   Type,
//   Eye,
//   Edit
// } from 'lucide-react';

// const RichTextEditor = ({ 
//   value = '', 
//   onChange, 
//   placeholder = "Start typing...",
//   error = null,
//   disabled = false,
//   maxLength = 5000,
//   minHeight = "200px"
// }) => {
//   const [isPreview, setIsPreview] = useState(false);
//   const editorRef = useRef(null);

//   const formatText = (command, value = null) => {
//     if (disabled) return;
    
//     document.execCommand(command, false, value);
    
//     // Trigger change event
//     if (editorRef.current && onChange) {
//       const content = editorRef.current.innerHTML;
//       onChange(content);
//     }
//   };

//   const handleInput = () => {
//     if (editorRef.current && onChange) {
//       const content = editorRef.current.innerHTML;
//       onChange(content);
//     }
//   };

//   const insertLink = () => {
//     if (disabled) return;
    
//     const url = prompt('Enter URL:');
//     if (url) {
//       formatText('createLink', url);
//     }
//   };

//   const toolbarButtons = [
//     { icon: Bold, command: 'bold', title: 'Bold' },
//     { icon: Italic, command: 'italic', title: 'Italic' },
//     { icon: Underline, command: 'underline', title: 'Underline' },
//     { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
//     { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
//     { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
//     { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
//     { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
//     { icon: AlignRight, command: 'justifyRight', title: 'Align Right' }
//   ];

//   const headingOptions = [
//     { value: 'div', label: 'Normal' },
//     { value: 'h1', label: 'Heading 1' },
//     { value: 'h2', label: 'Heading 2' },
//     { value: 'h3', label: 'Heading 3' },
//     { value: 'h4', label: 'Heading 4' }
//   ];

//   const getTextContent = (html) => {
//     const div = document.createElement('div');
//     div.innerHTML = html;
//     return div.textContent || div.innerText || '';
//   };

//   const currentLength = getTextContent(value).length;

//   return (
//     <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
//       {/* Toolbar */}
//       <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1">
//         {/* Heading Selector */}
//         <select
//           className="text-sm border border-gray-300 rounded px-2 py-1 mr-2"
//           onChange={(e) => formatText('formatBlock', e.target.value)}
//           disabled={disabled}
//         >
//           {headingOptions.map((option) => (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>

//         {/* Formatting Buttons */}
//         {toolbarButtons.map((button, index) => (
//           <button
//             key={index}
//             type="button"
//             onClick={() => button.value ? formatText(button.command, button.value) : formatText(button.command)}
//             className="p-1.5 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             title={button.title}
//             disabled={disabled}
//           >
//             <button.icon className="w-4 h-4" />
//           </button>
//         ))}

//         {/* Link Button */}
//         <button
//           type="button"
//           onClick={insertLink}
//           className="p-1.5 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           title="Insert Link"
//           disabled={disabled}
//         >
//           <Link className="w-4 h-4" />
//         </button>

//         {/* Divider */}
//         <div className="w-px h-6 bg-gray-300 mx-2" />

//         {/* Preview Toggle */}
//         <button
//           type="button"
//           onClick={() => setIsPreview(!isPreview)}
//           className={`p-1.5 rounded transition-colors ${
//             isPreview ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
//           }`}
//           title={isPreview ? 'Edit Mode' : 'Preview Mode'}
//         >
//           {isPreview ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//         </button>

//         {/* Word Count */}
//         <div className="ml-auto text-xs text-gray-500">
//           {currentLength}/{maxLength} characters
//         </div>
//       </div>

//       {/* Editor/Preview Area */}
//       <div className="relative">
//         {isPreview ? (
//           /* Preview Mode */
//           <div
//             className="p-4 prose prose-sm max-w-none"
//             style={{ minHeight }}
//             dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-500">Nothing to preview</p>' }}
//           />
//         ) : (
//           /* Edit Mode */
//           <div
//             ref={editorRef}
//             contentEditable={!disabled}
//             onInput={handleInput}
//             className={`p-4 outline-none focus:ring-0 ${
//               disabled ? 'bg-gray-100 cursor-not-allowed' : ''
//             } ${error ? 'border-red-300' : ''}`}
//             style={{ minHeight }}
//             dangerouslySetInnerHTML={{ __html: value }}
//             data-placeholder={placeholder}
//             suppressContentEditableWarning={true}
//           />
//         )}

//         {/* Placeholder */}
//         {!value && !isPreview && (
//           <div 
//             className="absolute top-4 left-4 text-gray-500 pointer-events-none"
//             style={{ display: value ? 'none' : 'block' }}
//           >
//             {placeholder}
//           </div>
//         )}
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="px-4 py-2 bg-red-50 border-t border-red-200">
//           <p className="text-sm text-red-600">{error}</p>
//         </div>
//       )}

//       {/* Character Limit Warning */}
//       {currentLength > maxLength * 0.9 && (
//         <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
//           <p className="text-sm text-yellow-600">
//             {currentLength > maxLength 
//               ? `Content exceeds maximum length by ${currentLength - maxLength} characters`
//               : `Approaching character limit (${maxLength - currentLength} remaining)`
//             }
//           </p>
//         </div>
//       )}

//       {/* Formatting Help */}
//       <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
//         <p className="text-xs text-gray-500">
//           Use the toolbar to format your text. You can add headings, lists, links, and basic formatting.
//         </p>
//       </div>

//       {/* Custom Styles for Rich Text Content */}
//       <style jsx>{`
//         [contentEditable] {
//           outline: none;
//         }
        
//         [contentEditable]:empty:before {
//           content: attr(data-placeholder);
//           color: #9CA3AF;
//           pointer-events: none;
//         }
        
//         [contentEditable] h1 {
//           font-size: 1.875rem;
//           font-weight: 700;
//           margin-bottom: 0.5rem;
//         }
        
//         [contentEditable] h2 {
//           font-size: 1.5rem;
//           font-weight: 600;
//           margin-bottom: 0.5rem;
//         }
        
//         [contentEditable] h3 {
//           font-size: 1.25rem;
//           font-weight: 600;
//           margin-bottom: 0.5rem;
//         }
        
//         [contentEditable] h4 {
//           font-size: 1.125rem;
//           font-weight: 600;
//           margin-bottom: 0.5rem;
//         }
        
//         [contentEditable] p {
//           margin-bottom: 0.75rem;
//         }
        
//         [contentEditable] ul, [contentEditable] ol {
//           margin-left: 1.5rem;
//           margin-bottom: 0.75rem;
//         }
        
//         [contentEditable] li {
//           margin-bottom: 0.25rem;
//         }
        
//         [contentEditable] blockquote {
//           border-left: 4px solid #E5E7EB;
//           padding-left: 1rem;
//           margin: 1rem 0;
//           font-style: italic;
//           color: #6B7280;
//         }
        
//         [contentEditable] a {
//           color: #2563EB;
//           text-decoration: underline;
//         }
        
//         [contentEditable] a:hover {
//           color: #1D4ED8;
//         }
        
//         [contentEditable] strong {
//           font-weight: 700;
//         }
        
//         [contentEditable] em {
//           font-style: italic;
//         }
        
//         [contentEditable] u {
//           text-decoration: underline;
//         }
        
//         .prose h1, .prose h2, .prose h3, .prose h4 {
//           color: #111827;
//           font-weight: 600;
//         }
        
//         .prose p {
//           color: #374151;
//           line-height: 1.6;
//         }
        
//         .prose ul, .prose ol {
//           color: #374151;
//         }
        
//         .prose blockquote {
//           border-left: 4px solid #E5E7EB;
//           padding-left: 1rem;
//           margin: 1rem 0;
//           font-style: italic;
//           color: #6B7280;
//         }
        
//         .prose a {
//           color: #2563EB;
//           text-decoration: underline;
//         }
        
//         .prose strong {
//           font-weight: 700;
//         }
        
//         .prose em {
//           font-style: italic;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default RichTextEditor;