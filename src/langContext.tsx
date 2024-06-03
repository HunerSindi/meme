// LangContext.tsx
import { createContext, useState, ReactNode, useContext } from 'react';

interface LangContextType {
  currentLang: string;
  lang: string;
  langUrl: string;
  changeName: (newLang: string, newUrl: string,newCurrentLang: string) => void;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [currentLang, setCurrentLang] = useState<string>('krd');
  const [lang, setLang] = useState<string>('KURDISH');
  const [langUrl, setLangUrl] = useState<string>('https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Flag_of_Kurdistan.svg/1200px-Flag_of_Kurdistan.svg.png');

  const changeName = (newLang: string, newUrl: string, newCurrentLang: string) => {
    setLang(newLang);
    setLangUrl(newUrl);
    setCurrentLang(newCurrentLang);
  };

  return (
    <LangContext.Provider value={{ currentLang, lang, langUrl, changeName }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => {
  const context = useContext(LangContext);
  if (context === undefined) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
};
