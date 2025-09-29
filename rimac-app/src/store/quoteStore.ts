import { create } from 'zustand';
import axios from 'axios';

export type Plan = {
  name: string;
  price: number;
  description: string[];
  age: number;
};

type QuoteState = {
  step: number;
  selectedFor: 'me' | 'other' | null;
  plans: Plan[];
  selectedPlan?: Plan | null;
  loading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  setSelectedFor: (v: 'me' | 'other') => void;
  setSelectedPlan: (p: Plan) => void;
};

export const useQuoteStore = create<QuoteState>((set) => ({
  step: 1,
  selectedFor: null,
  plans: [],
  selectedPlan: null,
  loading: false,
  error: null,
  async fetchPlans() {
    set({ loading: true, error: null });
    try {
      const res = await axios.get<{ list: Plan[] }>('https://rimac-front-end-challenge.netlify.app/api/plans.json');
      console.log('[quoteStore] fetched plans', res.data.list?.length);
      set({ plans: res.data.list, loading: false });
    } catch (e: any) {
      set({ error: e?.message ?? 'Error', loading: false });
    }
  },
  setSelectedFor(v) {
    set({ selectedFor: v });
  },
  setSelectedPlan(p) {
    set({ selectedPlan: p, step: 2 });
  },
}));


