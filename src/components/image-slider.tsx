import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface SliderImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
  active: boolean;
}

interface ImageSliderProps {
  images: SliderImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onEdit?: (image: SliderImage) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export function ImageSlider({ 
  images, 
  autoPlay = true, 
  autoPlayInterval = 5000,
  onEdit,
  onDelete,
  isAdmin = false
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeImages = images.filter(img => img.active);

  if (activeImages.length === 0) {
    return null;
  }

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeImages.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, activeImages.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeImages.length);
  };

  const currentImage = activeImages[currentIndex];

  return (
    <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Main Image */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={currentImage.imageUrl}
          alt={currentImage.title}
          className="h-full w-full object-cover transition-opacity duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">{currentImage.title}</h2>
          {currentImage.description && (
            <p className="text-sm text-gray-200 mb-4">{currentImage.description}</p>
          )}
          
          {currentImage.link && (
            <Button className="w-fit" size="sm">
              Learn More →
            </Button>
          )}
        </div>

        {/* Admin Controls */}
        {isAdmin && onEdit && onDelete && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20"
              onClick={() => onEdit(currentImage)}
            >
              Edit
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              className="bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
              onClick={() => onDelete(currentImage.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Navigation Arrows */}
        {activeImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {activeImages.length > 1 && (
        <div className="flex items-center justify-center gap-2 bg-black/20 py-3 backdrop-blur-sm">
          {activeImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
