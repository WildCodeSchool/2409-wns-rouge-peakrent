/* eslint-disable react/prop-types */
import { useState } from "react";

import placeholderImage from "@/components/icons/emptyImage2.svg";

type ImageHandlerProps = React.ComponentProps<"img"> & {
  src?: string;
  alt: string;
};

export const ImageHandler: React.FC<ImageHandlerProps> = ({
  src,
  alt,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src || placeholderImage);
  return (
    <img
      {...props}
      src={imageSrc}
      loading="lazy"
      alt={alt}
      onError={() => setImageSrc(placeholderImage)}
    />
  );
};
