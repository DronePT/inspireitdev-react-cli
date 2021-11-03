import { GetState, SetState } from 'zustand';

interface {{store}}Slice {
  {{lStore}}: any;
  set{{store}}: ({{lStore}}: any) => void;
}

export const create{{store}}Slice = (set: any,  get: any): {{store}}Slice => {
  return {
    {{lStore}}: null,
    set{{store}}: ({{lStore}}: any) =>
      set((state: {{store}}Slice) => void (state.{{lStore}} = {{lStore}})),
  };
};
