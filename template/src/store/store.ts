import createStore from 'zustand';

import {} from '../modules';

type StateFromFunctions<T extends [...any]> = T extends [infer F, ...infer R]
  ? F extends (...args: any) => object
    ? StateFromFunctions<R> & ReturnType<F>
    : unknown
  : unknown;

export type AppState = StateFromFunctions<[]>;

export const useStore = createStore((set, get) => ({}));
