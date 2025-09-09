import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Upload, 
  X, 
  Image as ImageIcon,
  Loader2,
  Trash2
} from 'lucide-react';
import { storageService, UploadResult } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface BusinessImageUploadProps {
  businessId: string;
  onImagesChange?: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export const BusinessImageUpload = ({ 
  businessId, 
  onImagesChange, 
  maxImages = 5,
  className = '' 
}: BusinessImageUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Validate file count
    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed.`,
        variant: "destructive"
      });
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload only JPEG, PNG, or WebP images.",
        variant: "destructive"
      });
      return;
    }

    // Validate file sizes (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: "Please upload images smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const results = await storageService.uploadMultipleImages(files, businessId, 'business');
      
      const successfulUploads = results
        .filter(result => !result.error)
        .map(result => result.url);

      if (successfulUploads.length > 0) {
        const newImages = [...images, ...successfulUploads];
        setImages(newImages);
        onImagesChange?.(newImages);
        
        toast({
          title: "Upload successful",
          description: `${successfulUploads.length} image(s) uploaded successfully.`,
          variant: "default"
        });
      }

      const failedUploads = results.filter(result => result.error);
      if (failedUploads.length > 0) {
        toast({
          title: "Some uploads failed",
          description: `${failedUploads.length} image(s) failed to upload.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading images.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange?.(newImages);
    
    toast({
      title: "Image removed",
      description: "Image removed successfully.",
      variant: "default"
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const event = { target: { files } } as any;
      handleFileSelect(event);
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Business Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors ${
              images.length >= maxImages 
                ? 'border-gray-200 bg-gray-50' 
                : 'border-[#e64600]/30 bg-[#e64600]/5 hover:border-[#4e3c28] hover:bg-[#4e3c28]/10'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {images.length >= maxImages ? (
              <div className="text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Maximum images reached</p>
                <p className="text-xs">Remove some images to add more</p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto mb-2 text-[#e64600]" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop images here, or click to select
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Supports JPEG, PNG, WebP up to 5MB each
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  variant="outline"
                  size="sm"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Select Images
                    </>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Image Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Business image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <Button
                      onClick={() => handleRemoveImage(index)}
                      variant="destructive"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2 text-xs"
                  >
                    {index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Image Count */}
          <div className="text-sm text-gray-500 text-center">
            {images.length} of {maxImages} images uploaded
          </div>
        </CardContent>
      </Card>
    </div>
  );
};