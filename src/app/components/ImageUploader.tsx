"use client";

import { useRef, useState } from "react";
import { FiImage, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ImageUploader({
  onUpload,
}: {
  onUpload: (base64: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onUpload(result);
      toast.success('Image uploaded successfully!');
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const clearPreview = () => {
    setPreview(null);
    if (ref.current) {
      ref.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => ref.current?.click()}
        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        title="Upload image"
      >
        <FiImage className="w-5 h-5" />
      </button>
      
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="preview"
            className="w-8 h-8 object-cover rounded"
          />
          <button
            onClick={clearPreview}
            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
            title="Remove image"
          >
            <FiX className="w-3 h-3" />
          </button>
        </div>
      )}
      
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
