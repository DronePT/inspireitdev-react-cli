import { GetState, SetState } from 'zustand';

interface {{store}}Slice {
  {{lStore}}: any
}

export const create{{store}}Slice = (
  set: SetState<{{store}}State>,
  get: GetState<{{store}}State>
): {{store}}State => {
  return {
    {{lStore}}: null,
    set{{store}}: ({{lStore}}: any) =>
      set((state) => void (state.{{lStore}} = {{lStore}})),
  };
};
