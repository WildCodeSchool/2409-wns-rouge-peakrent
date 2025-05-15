import React from "react";

type TitleProps = {
  text: string;
  titleLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  icon?: React.ReactNode;
};

export function Title({
  text,
  titleLevel = "h1",
  className = "",
  icon,
}: TitleProps) {
  return React.createElement(
    titleLevel,
    {
      className: `flex gap-2 text-2xl md:text-3xl font-bold items-center ${className}`,
    },
    <>
      {icon && icon}
      {text}
    </>
  );
}
