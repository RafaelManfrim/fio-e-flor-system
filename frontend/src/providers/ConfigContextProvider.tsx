import { useEffect, useState } from "react";
import { ConfigContext } from "../contexts/ConfigContext";

interface ConfigProviderProps {
  children: React.ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [controlarEstoque, setControlarEstoque] = useState<boolean>(() => {
    const saved = localStorage.getItem('controlarEstoque');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('controlarEstoque', JSON.stringify(controlarEstoque));
  }, [controlarEstoque]);

  const toggleControleEstoque = () => {
    setControlarEstoque((prev) => !prev);
  };

  return (
    <ConfigContext.Provider
      value={{
        controlarEstoque,
        toggleControleEstoque,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}