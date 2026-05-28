import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CustomSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select...", 
  size = "md" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.body.addEventListener("mousedown", handleClickOutside);
    return () => document.body.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <div className="relative  w-max-[250px]" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full bg-white border border-gray-300 
          rounded-lg shadow-sm transition-all outline-none
          hover:border-blue-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-100
          ${sizeStyles[size]}
          ${isOpen ? "border-blue-600 ring-4 ring-blue-100" : ""}
        `}
      >
        <span className={selectedOption ? "text-gray-900 font-medium" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`material-symbols-rounded transition-transform duration-200 text-[18px] text-gray-500 ${isOpen ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[100] w-max-[10px] mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    flex items-center justify-between w-max-[10px] text-left px-4 py-2 text-sm transition-colors
                    ${String(value) === String(option.value) 
                      ? "bg-blue-50 text-blue-700 font-bold" 
                      : "text-gray-700 hover:bg-gray-100"}
                  `}
                >
                  {option.label}
                  {String(value) === String(option.value) && (
                    <span className="material-symbols-rounded text-[18px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;