import React, { useRef } from "react";
import { Link } from "react-router-dom";

const Button = ({
  title,
  type = "button", 
  variant = "contained", 
  size = "md", 
  color = "primary", 
  icon,
  iconPosition = "before",
  onClick,
  disabled = false,
  className = "",
  to = "",
  href = "",
  loading = false,
  ...rest
}) => {
  const buttonRef = useRef(null);

  
  const sizeMap = {
    xs: "px-2 py-1 text-[10px]",
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantMap = {
    contained: {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      success: "bg-green-600 text-white hover:bg-green-700",
      danger: "bg-red-600 text-white hover:bg-red-700",
      warning: "bg-amber-500 text-white hover:bg-amber-600",
      info: "bg-cyan-500 text-white hover:bg-cyan-600",
      black: "bg-gray-900 text-white hover:bg-black",
    },
    outlined: {
      primary: "border border-blue-600 text-blue-600 hover:bg-blue-50",
      success: "border border-green-600 text-green-600 hover:bg-green-50",
      danger: "border border-red-600 text-red-600 hover:bg-red-50",
      warning: "border border-amber-500 text-amber-500 hover:bg-amber-50",
      info: "border border-cyan-500 text-cyan-500 hover:bg-cyan-50",
      black: "border border-gray-900 text-gray-900 hover:bg-gray-50",
    },
    text: {
      primary: "text-blue-600 hover:bg-blue-50",
      success: "text-green-600 hover:bg-green-50",
      danger: "text-red-600 hover:bg-red-50",
      warning: "text-amber-500 hover:bg-amber-50",
      info: "text-cyan-500 hover:bg-cyan-50",
      black: "text-gray-900 hover:bg-gray-100",
    }
  };

  const sharedClasses = `
    relative inline-flex items-center justify-center font-medium transition-all duration-200 
    rounded-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none
    ${sizeMap[size]}
    ${variantMap[variant][color]}
    ${className}
  `;

  const content = (
    <>
      {loading && (
        <span className="mr-2 animate-spin material-symbols-rounded !text-[18px]">progress_activity</span>
      )}
      {!loading && icon && iconPosition === "before" && (
        <span className="mr-2 material-symbols-rounded !text-[18px]">{icon}</span>
      )}
      <span className="whitespace-nowrap">{title}</span>
      {!loading && icon && iconPosition === "after" && (
        <span className="ml-2 material-symbols-rounded !text-[18px]">{icon}</span>
      )}
    </>
  );

  
  if (type === "link" && to) return <Link to={to} className={sharedClasses}>{content}</Link>;
  if (type === "link" && href) return <a href={href} target="_blank" rel="noreferrer" className={sharedClasses}>{content}</a>;

  return (
    <button
      ref={buttonRef}
      type={type === "submit" ? "submit" : type === "reset" ? "reset" : "button"}
      className={sharedClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;