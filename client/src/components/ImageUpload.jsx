import { useState } from 'react';
import api from '../config/api';
import { FaCloudUploadAlt, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ImageUpload = ({ onImageUpload, currentImage, label = "Event Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, and WebP are allowed');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Maximum 5MB allowed');
      return;
    }

    setError('');
    setSuccess(false);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const { data } = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setPreview(data.url);
      setSuccess(true);
      onImageUpload(data.url);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-700 mb-2 font-medium">{label}</label>
      
      <div className="glass-dark rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-[#5A43FF] transition-colors">
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
            <button
              type="button"
              onClick={() => {
                setPreview('');
                onImageUpload('');
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
            >
              <FaTimesCircle />
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <FaCloudUploadAlt className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">PNG, JPG, WebP up to 5MB</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        
        <label
          htmlFor="image-upload"
          className={`block text-center gradient-primary text-white px-6 py-3 rounded-xl cursor-pointer hover-lift font-semibold ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" />
              Uploading...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <FaCloudUploadAlt />
              {preview ? 'Change Image' : 'Upload Image'}
            </span>
          )}
        </label>

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
            <FaTimesCircle />
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
            <FaCheckCircle />
            Image uploaded successfully!
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Or paste an image URL in the field below
      </p>
      
      <input
        type="url"
        value={preview}
        onChange={(e) => {
          setPreview(e.target.value);
          onImageUpload(e.target.value);
        }}
        placeholder="https://example.com/image.jpg"
        className="w-full px-4 py-3 glass-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A43FF] mt-2"
      />
    </div>
  );
};

export default ImageUpload;
