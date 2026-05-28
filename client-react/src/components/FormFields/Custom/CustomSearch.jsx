import React from "react";

const sizeClasses = {
  sm: "pr-0 py-1.5",
  md: "pr-0 py-2",
  lg: "pr-0 py-2.5",
  xl: "pr-0 py-3",
};

const fontSizeClasses = {
  sm: "text-[12px]",
  md: "text-[14px]",
  lg: "text-[16px]",
  xl: "text-[18px]",
};

const iconSizeClasses = {
  sm: "!text-[18px]",
  md: "!text-[20px]",
  lg: "!text-[24px]",
  xl: "!text-[26px]",
};

const CustomSearch = ({
  value,
  onChange,
  placeholder = "Search...",
  size = "md",
  rounded = "rounded",
  closeBtn = false,
  disabled = false,
  keyname,
}) => {
  return (
    <div
      className={`flex items-center border border-gray-300 hover:border-primary focus-within:border-primary bg-white ${sizeClasses[size]} ${rounded} relative`}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(keyname, e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full outline-none bg-transparent ms-3 px-3 ${fontSizeClasses[size]}`}
      />
      <div className="w-7 flex justify-center items-center">
        {value && closeBtn && (
          <span
            className={`material-icons text-gray-500 px-2 cursor-pointer ${iconSizeClasses[size]}`}
            onClick={() => onChange(keyname, "")}
            size={size}
          >
            close
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomSearch;