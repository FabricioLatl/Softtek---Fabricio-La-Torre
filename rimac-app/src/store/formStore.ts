import { create } from 'zustand';

export type DocumentType = 'DNI' | 'CE' | 'PASS';

export type FormData = {
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
  privacyAccepted: boolean;
  commsAccepted: boolean;
};

type Store = {
  data: FormData | null;
  setData: (d: FormData) => void;
  reset: () => void;
};

export const useFormStore = create<Store>((set) => ({
  data: null,
  setData: (d) => set({ data: d }),
  reset: () => set({ data: null }),
}));


