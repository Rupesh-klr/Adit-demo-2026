import React, { useState, useEffect } from "react";

const CustomNameHandler = ({ 
  value = "", 
  onChange, 
  name = "name", 
  label = "Full Name", 
  placeholder = "Enter full name",
  disabled = false,
  required = false 
}) => {
  const [val, setVal] = useState(value);
  const [error, setError] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const validate = (text) => {
    if (required && !text.trim()) {
      return "Name is required";
    }
    if (text.trim() && text.trim().length < 2) {
      return "Name is too short";
    }
    
    if (/[0-9]/.test(text)) {
      return "Names should not contain numbers";
    }
    return "";
  };

  const handleChange = (e) => {
    const text = e.target.value;
    setVal(text);
    
    
    if (error && !validate(text)) {
      setError("");
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
    const validationError = validate(val);
    setError(validationError);
    
    if (onChange) {
      
      onChange({
        target: {
          name: name,
          value: val.trim(),
          isValid: validationError === ""
        }
      });
    }
  };

  return (
    <div className="flex flex-col w-full group">
      {/* Header with Label and Error message */}
      <div className="flex justify-between items-end mb-1.5 px-0.5">
        <label className={`text-sm font-semibold transition-colors ${
          error ? "text-red-500" : "text-gray-700 group-focus-within:text-blue-600"
        }`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {error && isTouched && (
          <span className="text-[11px] font-medium text-red-500 flex items-center gap-1">
            <span className="material-symbols-rounded !text-[14px]">info</span>
            {error}
          </span>
        )}
      </div>

      {/* Input Box */}
      <div className="relative flex items-center">
        <span className={`absolute left-3 material-symbols-rounded !text-[20px] transition-colors ${
          error ? "text-red-400" : "text-gray-400 group-focus-within:text-blue-500"
        }`}>
          person
        </span>
        
        <input
          type="text"
          name={name}
          value={val}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 py-2.5 bg-white border-2 rounded-xl transition-all outline-none
            ${error && isTouched 
              ? "border-red-200 bg-red-50 focus:border-red-500" 
              : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            }
            ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "cursor-text"}
            text-gray-800 text-sm
          `}
        />

        {/* Success Icon: Shows when name is valid and entered */}
        {!error && val.trim().length >= 2 && (
          <span className="absolute right-3 text-green-500 material-symbols-rounded !text-[20px] animate-in fade-in zoom-in">
            verified
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomNameHandler;