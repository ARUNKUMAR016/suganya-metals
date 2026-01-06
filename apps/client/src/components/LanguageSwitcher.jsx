import React from "react";
import { useLanguage } from "../context/LanguageContext";

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`
        px-3 py-1.5 rounded-lg border font-medium text-sm transition-all duration-200
        ${
          language === "ta"
            ? "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
            : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        }
      `}
    >
      {language === "en" ? "தமிழ்" : "English"}
    </button>
  );
};

export default LanguageSwitcher;
