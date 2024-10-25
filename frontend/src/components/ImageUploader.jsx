// components/ImageUploader.jsx
import React, { useState, useRef } from "react";
import { Upload, X } from 'lucide-react';
import axios from 'axios';

const ImageUploader = ({ onImageUpload, onSuccess, tripId }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [album, setAlbum] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type.startsWith("image/")) {
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError("");
    } else {
      setError("Please select a valid image file (PNG, JPG, GIF).");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError("");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    if (album) formData.append("album", album);
    if (tripId) formData.append("tripId", tripId);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(Math.round(progress));
        },
        // Increase timeout for large files
        timeout: 30000
      };

      const response = await axios.post('http://localhost:8000/upload', formData, config);

      if (response.data && response.data.imageUrl) {
        const uploadedImage = {
          imageUrl: response.data.imageUrl,
          caption: response.data.message || '',
          album: album,
          uploadedAt: new Date().toISOString()
        };

        onImageUpload(uploadedImage);
        onSuccess?.();

        // Reset form
        setFile(null);
        setPreview(null);
        setAlbum("");
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Upload error:', err);
      let errorMessage = 'Failed to upload image.';
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.detail || err.response.data?.message || errorMessage;
      } else if (err.request) {
        // Request made but no response
        errorMessage = 'Server not responding. Please try again.';
      }
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleUpload} className="space-y-4">
        {/* Drag & Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg ${
            preview ? 'border-gray-300' : 'border-blue-400 hover:border-blue-500'
          } transition-colors`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="p-8 text-center">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-blue-400" />
                <div className="flex flex-col items-center">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-500 hover:text-blue-600"
                  >
                    <span className="font-medium">Click to upload</span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </label>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            )}
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              accept="image/*"
            />
          </div>
        </div>

        {/* Album Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Album Name
          </label>
          <input
            type="text"
            placeholder="Optional album name"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        )}

        {/* Upload Button */}
        <button
          type="submit"
          disabled={!file || isUploading}
          className={`w-full py-2 px-4 rounded-md ${
            !file || isUploading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          } transition-colors`}
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload Image"
          )}
        </button>
      </form>
    </div>
  );
};

export default ImageUploader;