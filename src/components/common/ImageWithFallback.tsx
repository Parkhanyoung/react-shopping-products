import { SyntheticEvent } from "react";
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
  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;
    target.src = fallbackSrc;
  };

  return <img src={src} onError={handleError} {...attributes} />;
};

export default ImageWithFallback;
