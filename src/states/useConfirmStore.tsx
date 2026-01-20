// store/useConfirmStore.ts
import { create } from 'zustand';

interface ConfirmState {
  isOpen: boolean;
  message: string;
  resolve: ((value: boolean) => void) | null;
  ask: (message: string) => Promise<boolean>;
  confirm: (result: boolean) => void;
}

const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  message: '',
  resolve: null,

  ask: (message: string) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        message,
        resolve,
      });
    });
  },

  confirm: (result: boolean) => {
    set((state) => {
      if (state.resolve) state.resolve(result);
      return { 
        isOpen: false, 
        message: '', 
        resolve: null 
      };
    });
  },
}));

export default useConfirmStore;