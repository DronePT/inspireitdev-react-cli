import { createContext, useState, useContext, FC } from 'react';

interface {{context}}ContextState {
  hello: string;
  setHello?: (v: string) => void;
}

const DEFAULT_STATE: {{context}}ContextState = {
  hello: 'world',
};

export const {{context}}Context = createContext<{{context}}ContextState>(DEFAULT_STATE);

export const {{context}}Provider: FC = ({ children }) => {
  const [hello, setHello] = useState('world');

  const value = { hello, setHello };

  return (
    <{{context}}Context.Provider value={value}>
      {children}
    </{{context}}Context.Provider>
  );
};

export const use{{context}}Context = () => useContext({{context}}Context);
