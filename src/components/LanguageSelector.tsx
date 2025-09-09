import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' }
];

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="font-roboto flex items-center gap-1 sm:gap-2 hover:bg-gray-100 transition-colors duration-200 px-2 sm:px-3">
          <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-base sm:text-lg">{currentLanguage.flag}</span>
          <span className="hidden sm:inline text-xs sm:text-sm">{currentLanguage.code.toUpperCase()}</span>
          <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-40 sm:w-48 bg-background border border-border shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        sideOffset={8}
      >
        <div className="p-2">
          <h3 className="text-xs sm:text-sm font-roboto font-semibold text-yp-dark mb-2 px-2">
            {t('languages.selectLanguage')}
          </h3>
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`dropdown-menu-item-override font-roboto px-2 sm:px-3 py-1.5 sm:py-2 cursor-pointer button flex items-center gap-2 sm:gap-3 transition-all duration-200 ${
                i18n.language === language.code ? "bg-yp-gray-light text-yp-blue" : "text-yp-dark hover:bg-gray-100"
              }`}
            >
              <span className="text-base sm:text-lg">{language.flag}</span>
              <span className="text-xs sm:text-sm">{language.name}</span>
              {i18n.language === language.code && (
                <span className="ml-auto text-yp-blue text-xs sm:text-sm">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 