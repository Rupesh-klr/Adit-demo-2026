import React, { useState, useEffect } from "react";

/**
 * CustomEmailHandler
 * @param {string} value - Initial email value
 * @param {function} onChange - Callback returning {email, isValid}
 * @param {string} label - Field label
 */
export const CustomEmailHandler = ({ 
  value = "", 
  onChange, 
  label = "Email Address", 
  placeholder = "example@domain.com",
  disabled = false,
  required = false 
}) => {
  const [email, setEmail] = useState(value);
  const [error, setError] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  
  const emailRegex = /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/;

  useEffect(() => {
    setEmail(value);
  }, [value]);

  const validate = (val) => {
    if (!val && required) {
      return "Email is required";
    }
    if (val && !emailRegex.test(val)) {
      return "Invalid email format";
    }
    return "";
  };

  const handleChange = (e) => {
    const val = e.target.value.trim();
    setEmail(val);
    
    
    if (error && emailRegex.test(val)) {
      setError("");
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
    const validationError = validate(email);
    setError(validationError);
    
    if (onChange) {
      onChange({
        email: email,
        isValid: validationError === ""
      });
    }
  };

  return (
    <div className="flex flex-col w-full  group">
      <div className="flex justify-between items-end mb-1.5 px-0.5">
        <label className={`text-sm font-semibold transition-colors ${
          error ? "text-red-500" : "text-gray-700 group-focus-within:text-blue-600"
        }`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {error && isTouched && (
          <span className="text-[11px] font-medium text-red-500 animate-pulse flex items-center gap-1">
            <span className="material-symbols-rounded !text-[14px]">error</span>
            {error}
          </span>
        )}
      </div>

      {/* Input Wrapper */}
      <div className="relative flex items-center">
        <span className={`absolute left-3 material-symbols-rounded !text-[20px] transition-colors ${
          error ? "text-red-400" : "text-gray-400 group-focus-within:text-blue-500"
        }`}>
          mail
        </span>
        
        <input
          type="email"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-4 py-2.5 bg-white border-2 rounded-xl transition-all outline-none
            ${error && isTouched 
              ? "border-red-200 bg-red-50 focus:border-red-500" 
              : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            }
            ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "cursor-text"}
            text-gray-800 text-base sm:text-sm
          `}
        />

        {/* Success Checkmark */}
        {!error && emailRegex.test(email) && (
          <span className="absolute right-3 text-green-500 material-symbols-rounded !text-[20px] animate-in fade-in zoom-in">
            check_circle
          </span>
        )}
      </div>
    </div>
  );
};
