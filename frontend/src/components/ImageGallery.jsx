// components/ImageGallery.jsx
import React, { useState, useMemo } from 'react';
import { ChevronLeft, FolderOpen } from 'lucide-react';

const ImageGallery = ({ title, images }) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // Group images by album
  const albums = useMemo(() => {
    const albumGroups = images.reduce((acc, image) => {
      const albumName = image.album || 'Uncategorized';
      if (!acc[albumName]) {
        acc[albumName] = [];
      }
      acc[albumName].push(image);
      return acc;
    }, {});

    // Convert to array and add cover image
    return Object.entries(albumGroups).map(([name, albumImages]) => ({
      name,
      images: albumImages,
      coverImage: albumImages[0],
      count: albumImages.length
    }));
  }, [images]);

  if (!images?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No images to display</p>
      </div>
    );
  }

  // Album Grid View
  if (!selectedAlbum) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div
              key={album.name}
              onClick={() => setSelectedAlbum(album.name)}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="aspect-w-16 aspect-h-12 relative">
                <img
                  src={album.coverImage.imageUrl}
                  alt={album.name}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center">
                          <FolderOpen className="w-5 h-5 mr-2" />
                          {album.name}
                        </h3>
                        <p className="text-sm opacity-90">{album.count} photos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Individual Album View
  const albumImages = albums.find(a => a.name === selectedAlbum)?.images || [];
  
  return (
    <div className="space-y-6">
      {/* Album Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedAlbum(null)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Albums
        </button>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-800">{selectedAlbum}</h2>
          <p className="text-sm text-gray-600">{albumImages.length} photos</p>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {albumImages.map((image, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={image.imageUrl}
                alt={image.caption || 'Travel photo'}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
            
            <div className="p-4">
              {image.caption && (
                <p className="text-sm text-gray-600">{image.caption}</p>
              )}
              {image.uploadedAt && (
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(image.uploadedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;