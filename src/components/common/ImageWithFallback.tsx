import { useState } from "react";
import defaultFallbackImage from "@assets/defaultFallback.png";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
}

const ImageWithFallback = ({
  src,
  fallbackSrc = defaultFallbackImage,
  ...attributes
}: ImageWithFallbackProps) => {
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = () => {
    setImageSrc(fallbackSrc);
  };

  return <img src={imageSrc} onError={handleError} {...attributes} />;
};

export default ImageWithFallback;
