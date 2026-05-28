import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
export const countriesCode = [
  { code: "+1", flag: "🇺🇸", name: "United States", maxSize: 10 },
  { code: "+7", flag: "🇷🇺", name: "Russia", maxSize: 10 },
  { code: "+20", flag: "🇪🇬", name: "Egypt", maxSize: 10 },
  { code: "+27", flag: "🇿🇦", name: "South Africa", maxSize: 10 },
  { code: "+30", flag: "🇬🇷", name: "Greece", maxSize: 10 },
  { code: "+31", flag: "🇳🇱", name: "Netherlands", maxSize: 10 },
  { code: "+32", flag: "🇧🇪", name: "Belgium", maxSize: 10 },
  { code: "+33", flag: "🇫🇷", name: "France", maxSize: 10 },
  { code: "+34", flag: "🇪🇸", name: "Spain", maxSize: 10 },
  { code: "+36", flag: "🇭🇺", name: "Hungary", maxSize: 10 },
  { code: "+39", flag: "🇮🇹", name: "Italy", maxSize: 10 },
  { code: "+40", flag: "🇷🇴", name: "Romania", maxSize: 10 },
  { code: "+41", flag: "🇨🇭", name: "Switzerland", maxSize: 10 },
  { code: "+43", flag: "🇦🇹", name: "Austria", maxSize: 10 },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom", maxSize: 10 },
  { code: "+45", flag: "🇩🇰", name: "Denmark", maxSize: 10 },
  { code: "+46", flag: "🇸🇪", name: "Sweden", maxSize: 10 },
  { code: "+47", flag: "🇳🇴", name: "Norway", maxSize: 10 },
  { code: "+48", flag: "🇵🇱", name: "Poland", maxSize: 10 },
  { code: "+49", flag: "🇩🇪", name: "Germany", maxSize: 10 },
  { code: "+51", flag: "🇵🇪", name: "Peru", maxSize: 10 },
  { code: "+52", flag: "🇲🇽", name: "Mexico", maxSize: 10 },
  { code: "+53", flag: "🇨🇺", name: "Cuba", maxSize: 10 },
  { code: "+54", flag: "🇦🇷", name: "Argentina", maxSize: 10 },
  { code: "+55", flag: "🇧🇷", name: "Brazil", maxSize: 10 },
  { code: "+56", flag: "🇨🇱", name: "Chile", maxSize: 10 },
  { code: "+57", flag: "🇨🇴", name: "Colombia", maxSize: 10 },
  { code: "+58", flag: "🇻🇪", name: "Venezuela", maxSize: 10 },
  { code: "+60", flag: "🇲🇾", name: "Malaysia", maxSize: 10 },
  { code: "+61", flag: "🇦🇺", name: "Australia", maxSize: 10 },
  { code: "+62", flag: "🇮🇩", name: "Indonesia", maxSize: 10 },
  { code: "+63", flag: "🇵🇭", name: "Philippines", maxSize: 10 },
  { code: "+64", flag: "🇳🇿", name: "New Zealand", maxSize: 10 },
  { code: "+65", flag: "🇸🇬", name: "Singapore", maxSize: 10 },
  { code: "+66", flag: "🇹🇭", name: "Thailand", maxSize: 10 },
  { code: "+81", flag: "🇯🇵", name: "Japan", maxSize: 10 },
  { code: "+82", flag: "🇰🇷", name: "South Korea", maxSize: 10 },
  { code: "+84", flag: "🇻🇳", name: "Vietnam", maxSize: 10 },
  { code: "+86", flag: "🇨🇳", name: "China", maxSize: 10 },
  { code: "+90", flag: "🇹🇷", name: "Turkey", maxSize: 10 },
  { code: "+91", flag: "🇮🇳", name: "India", maxSize: 10 },
  { code: "+92", flag: "🇵🇰", name: "Pakistan", maxSize: 10 },
  { code: "+93", flag: "🇦🇫", name: "Afghanistan", maxSize: 10 },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka", maxSize: 10 },
  { code: "+95", flag: "🇲🇲", name: "Myanmar", maxSize: 10 },
  { code: "+98", flag: "🇮🇷", name: "Iran", maxSize: 10 },
  { code: "+211", flag: "🇸🇸", name: "South Sudan", maxSize: 10 },
  { code: "+212", flag: "🇲🇦", name: "Morocco", maxSize: 10 },
  { code: "+213", flag: "🇩🇿", name: "Algeria", maxSize: 10 },
  { code: "+216", flag: "🇹🇳", name: "Tunisia", maxSize: 10 },
  { code: "+218", flag: "🇱🇾", name: "Libya", maxSize: 10 },
  { code: "+220", flag: "🇬🇲", name: "Gambia", maxSize: 10 },
  { code: "+221", flag: "🇸🇳", name: "Senegal", maxSize: 10 },
  { code: "+222", flag: "🇲🇷", name: "Mauritania", maxSize: 10 },
  { code: "+223", flag: "🇲🇱", name: "Mali", maxSize: 10 },
  { code: "+225", flag: "🇨🇮", name: "Ivory Coast", maxSize: 10 },
  { code: "+230", flag: "🇲🇺", name: "Mauritius", maxSize: 10 },
  { code: "+233", flag: "🇬🇭", name: "Ghana", maxSize: 10 },
  { code: "+234", flag: "🇳🇬", name: "Nigeria", maxSize: 10 },
  { code: "+235", flag: "🇹🇩", name: "Chad", maxSize: 10 },
  { code: "+237", flag: "🇨🇲", name: "Cameroon", maxSize: 10 },
  { code: "+240", flag: "🇬🇶", name: "Equatorial Guinea", maxSize: 10 },
  { code: "+254", flag: "🇰🇪", name: "Kenya", maxSize: 10 },
  { code: "+255", flag: "🇹🇿", name: "Tanzania", maxSize: 10 },
  { code: "+256", flag: "🇺🇬", name: "Uganda", maxSize: 10 },
  { code: "+260", flag: "🇿🇲", name: "Zambia", maxSize: 10 },
  { code: "+263", flag: "🇿🇼", name: "Zimbabwe", maxSize: 10 },
  { code: "+268", flag: "🇸🇿", name: "Eswatini", maxSize: 10 },
  { code: "+290", flag: "🇸🇭", name: "Saint Helena", maxSize: 10 },
  { code: "+375", flag: "🇧🇾", name: "Belarus", maxSize: 10 },
  { code: "+420", flag: "🇨🇿", name: "Czech Republic", maxSize: 10 },
  { code: "+421", flag: "🇸🇰", name: "Slovakia", maxSize: 10 },
  { code: "+423", flag: "🇱🇮", name: "Liechtenstein", maxSize: 10 },
  { code: "+500", flag: "🇫🇰", name: "Falkland Islands", maxSize: 10 },
  { code: "+501", flag: "🇧🇿", name: "Belize", maxSize: 10 },
  { code: "+502", flag: "🇬🇹", name: "Guatemala", maxSize: 10 },
  { code: "+503", flag: "🇸🇻", name: "El Salvador", maxSize: 10 },
  { code: "+504", flag: "🇭🇳", name: "Honduras", maxSize: 10 },
  { code: "+505", flag: "🇳🇮", name: "Nicaragua", maxSize: 10 },
  { code: "+506", flag: "🇨🇷", name: "Costa Rica", maxSize: 10 },
  { code: "+507", flag: "🇵🇦", name: "Panama", maxSize: 10 },
  { code: "+509", flag: "🇭🇹", name: "Haiti", maxSize: 10 },
  { code: "+598", flag: "🇺🇾", name: "Uruguay", maxSize: 10 },
];

const sizeClasses = {
  xs: "px-2 py-0",
  sm: "px-3 py-1.5",
  md: "px-3 py-2",
  lg: "px-4 py-2.5",
  xl: "px-5 py-3",
};

const fontSizeClasses = {
  xs: "text-[12px]",
  sm: "text-[12px]",
  md: "text-[14px]",
  lg: "text-[16px]",
  xl: "text-[18px]",
};

const countries = countriesCode;

const topCountries = [
  { code: "+1", flag: "🇺🇸", name: "United States", maxSize: 10 },
  { code: "+91", flag: "🇮🇳", name: "India", maxSize: 10 },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom", maxSize: 10 },
  { code: "+43", flag: "🇦🇹", name: "Austria", maxSize: 10 },
];

const allCountries = [
  ...topCountries,
  ...countries.filter(
    (country) =>
      !topCountries.some((topCountry) => topCountry.code === country.code)
  ),
];

const CustomPhoneInput = ({
  value = "",
  onChange,
  placeholder = "Enter phone number...",
  size = "md",
  rounded = "rounded",
  selectedCountryCode = "+1",
}) => {

  const validatePhoneNumber = (input, flag = 'IN') => {
    const phoneNumber = parsePhoneNumberFromString(input, flag);
    if (phoneNumber && phoneNumber.isValid()) {
      setError(false);
      return {
        valid: true,
        formatted: phoneNumber.formatInternational(),
        e164: phoneNumber.number,
        country: phoneNumber.country,
      };
    }
    setError(true);
    return { valid: false, message: 'Invalid phone number' };
  }
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const country =
      allCountries.find((c) => c.code === selectedCountryCode) || countries[0];
    return country;
  });

  const [error, setError] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownMaxHeight, setDropdownMaxHeight] = useState(300);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - buttonRect.bottom;
      const minHeight = 150;
      const maxHeight = Math.max(minHeight, Math.min(300, spaceBelow - 10));
      setDropdownMaxHeight(maxHeight);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, [isOpen]);

  const handleCountrySelect = (country) => {
    const stringValue = String(value || "");
    const numberOnly = stringValue.replace(selectedCountry.code, "");
    setSelectedCountry(country);
    const newValue = country.code + numberOnly;
    onChange(newValue, {
      countryCode: country.code,
      number: numberOnly,
      fullNumber: newValue,
      flag: country.flag,
      error: validatePhoneNumber(`${country.code}${numberOnly}`, country.flag)
    });

    setIsOpen(false);
    setSearchQuery("");
  };


  const phoneValue = String(value || "");

  const handlePhoneChange = (e) => {
    const phoneNumber = e.target.value.replace(/\D/g, "");
    let maxSize = selectedCountry.maxSize || 10;
    const limitedNumber = phoneNumber.slice(0, maxSize);
    const newValue = selectedCountry.code + limitedNumber;
    onChange(newValue, {
      countryCode: selectedCountry.code,
      number: limitedNumber,
      fullNumber: newValue,
      flag: selectedCountry.flag,
      error: validatePhoneNumber(`${selectedCountry.code}${limitedNumber}`, selectedCountry.flag)
    });
  };
  const filteredCountries = allCountries.filter((country) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      country.name.toLowerCase().includes(searchLower) ||
      country.code.includes(searchQuery) ||
      country.flag.includes(searchQuery)
    );
  });


  useEffect(() => {
    const country =
      allCountries.find((c) => c.code === selectedCountryCode) || countries[0];
    setSelectedCountry(country);
  }, [selectedCountryCode]);

  return (
    <div
      className={`flex-1 relative flex rounded border border-gray-300 hover:border-primary focus:border-primary focus:outline-none ${isFocused ? "border-primary outline-none" : ""
        } `}
    >
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsFocused(false);
            }
          }}
          className={`flex items-center justify-between bg-white border-0  ${sizeClasses[size]} ${fontSizeClasses[size]} ${rounded}  rounded-r-none border-r-0 w-[80px] `}
        >
          <span className="flex items-center justify-center gap-1 flex-1">
            {/* <span>{selectedCountry.flag}</span> */}
            <span>{selectedCountry.code}</span>
          </span>
          <FaChevronDown className="ml-1 text-gray-400" />
        </button>
        {isOpen && (
          <div
            className="list absolute z-10 min-w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg whitespace-nowrap"
            style={{ maxHeight: `${dropdownMaxHeight}px` }}
          >
            <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country..."
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-primary"
              />
            </div>
            <div
              className="overflow-y-auto"
              style={{ maxHeight: `${dropdownMaxHeight - 53}px` }}
            >
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="flex items-center w-full gap-2 px-3 py-2 text-left hover:bg-gray-100"
                >
                  <span>{country.flag}</span>
                  <span>{country.code}</span>
                  <span className="text-sm text-gray-600">{country.name}</span>
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <input
        type="tel"
        value={phoneValue.replace(selectedCountry.code, "")}
        onChange={handlePhoneChange}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          if (!dropdownRef.current?.contains(e.relatedTarget)) {
            setIsFocused(false);
          }
        }}
        placeholder={placeholder}
        className={`flex-1 bg-white pl-0 border-0 focus:outline-none ${sizeClasses[size]} ${fontSizeClasses[size]} ${rounded} 
        ${error  
              ? "border-red-200 bg-red-50 focus:border-red-500" 
              : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            }
        rounded-l-none`}
      />
      {/* Success Icon: Shows when name is valid and entered */}
        {!error  && (
          <span className="absolute right-3 text-green-500 material-symbols-rounded !text-[20px] animate-in fade-in zoom-in my-auto py-2">
            verified
          </span>
        )}

    </div>
  );
};

export default CustomPhoneInput;
