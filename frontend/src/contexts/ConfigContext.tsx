import { createContext } from 'react';

export interface ConfigContextData {
  controlarEstoque: boolean;
  toggleControleEstoque: () => void;
}

export const ConfigContext = createContext<ConfigContextData>({} as ConfigContextData);
