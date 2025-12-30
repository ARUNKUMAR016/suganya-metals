import React, { useState, useRef, useEffect } from "react";

const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Search...",
  getOptionLabel = (option) => option.name || option.label,
  getOptionValue = (option) => option.id || option.value,
  renderOption,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search term (search by ID or name)
  const filteredOptions = options.filter((option) => {
    const label = getOptionLabel(option).toLowerCase();
    const id = String(getOptionValue(option)).toLowerCase();
    const search = searchTerm.toLowerCase();
    return label.includes(search) || id.includes(search);
  });

  // Find selected option
  const selectedOption = options.find(
    (option) => getOptionValue(option) === value
  );

  const handleSelect = (option) => {
    onChange(getOptionValue(option));
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm("");
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div
        onClick={handleInputClick}
        className={`w-full border-2 rounded-xl p-3 cursor-pointer transition-all ${
          disabled
            ? "bg-gray-100 cursor-not-allowed border-gray-200"
            : isOpen
            ? "border-blue-500 ring-4 ring-blue-100"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {selectedOption ? (
          <div className="flex items-center justify-between">
            {renderOption ? (
              renderOption(selectedOption)
            ) : (
              <span className="text-gray-900 font-medium">
                {getOptionLabel(selectedOption)}
              </span>
            )}
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">{placeholder}</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-blue-500 rounded-xl shadow-2xl max-h-80 overflow-hidden animate-slideDown">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <input
              type="text"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="🔍 Search by ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-64 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={getOptionValue(option)}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-3 cursor-pointer transition-all border-l-4 ${
                    getOptionValue(option) === value
                      ? "bg-blue-50 border-blue-500 text-blue-900 font-semibold"
                      : "border-transparent hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {renderOption ? (
                    renderOption(option)
                  ) : (
                    <span className="text-gray-900">
                      {getOptionLabel(option)}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                <p>No results found</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default SearchableSelect;
