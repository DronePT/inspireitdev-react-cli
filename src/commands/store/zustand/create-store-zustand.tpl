import { GetState, SetState } from 'zustand';

interface {{store}}Slice {
  {{lStore}}: any;
  set{{store}}: ({{lStore}}: any) => void;
}

export const create{{store}}Slice = (
  set: SetState<{{store}}Slice>,
  get: GetState<{{store}}Slice>
): {{store}}Slice => {
  return {
    {{lStore}}: null,
    set{{store}}: ({{lStore}}: any) =>
      set((state) => void (state.{{lStore}} = {{lStore}})),
  };
};
