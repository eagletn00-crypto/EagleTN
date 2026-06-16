import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { X } from 'lucide-react';

const ImageCropperModal = ({ imageSrc, aspect, onCropDone, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropDone(croppedImageBlob);
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء قص الصورة');
    }
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg">قص الصورة</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="relative flex-1 bg-gray-900 w-full">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex flex-col gap-4">
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="w-full accent-orange-500"
            />
            <div className="flex gap-3">
              <button 
                onClick={onCancel}
                className="flex-1 py-2 px-4 rounded-xl font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
                disabled={isProcessing}
              >
                إلغاء
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-2 px-4 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors flex justify-center items-center"
                disabled={isProcessing}
              >
                {isProcessing ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'حفظ الصورة'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
