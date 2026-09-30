import { createContext, useContext, useState, useEffect } from 'react';

const PhoneContext = createContext();

export function PhoneProvider({ children }) {
  const [phone, setPhone] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('crow_phone');
    if (saved) {
      setPhone(saved);
      setIsRegistered(true);
    }
  }, []);

  const registerPhone = (number) => {
    setPhone(number);
    setIsRegistered(true);
    localStorage.setItem('crow_phone', number);
  };

  const clearPhone = () => {
    setPhone('');
    setIsRegistered(false);
    localStorage.removeItem('crow_phone');
  };

  return (
    <PhoneContext.Provider value={{ phone, isRegistered, registerPhone, clearPhone }}>
      {children}
    </PhoneContext.Provider>
  );
}

export function usePhone() {
  return useContext(PhoneContext);
}
