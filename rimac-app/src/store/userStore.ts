import { create } from 'zustand';
import axios from 'axios';

type User = {
  name: string;
  birthDay?: string;
  age?: number;
};

type UserStore = {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  async fetchUser() {
    set({ loading: true, error: null });
    try {
      const res = await axios.get<any>('https://rimac-front-end-challenge.netlify.app/api/user.json');
      const data = res.data;
      const rawBirth = (data?.birthDay || data?.birthdate || data?.birthDate) as string | undefined;

      let age: number | undefined = undefined;
      if (rawBirth) {
        const parts = rawBirth.split(/[\/\-]/);
        if (parts.length === 3) {
          const dd = parseInt(parts[0], 10);
          const mm = parseInt(parts[1], 10);
          const yyyy = parseInt(parts[2], 10);
          const b = new Date(yyyy, mm - 1, dd);
          if (!isNaN(b.getTime())) {
            const now = new Date();
            let a = now.getFullYear() - b.getFullYear();
            const mDiff = now.getMonth() - b.getMonth();
            if (mDiff < 0 || (mDiff === 0 && now.getDate() < b.getDate())) a -= 1;
            age = a;
          }
        }
      }
      if (age === undefined || age < 0 || age > 120) {
        age = undefined; 
      }
      const fullName = [data?.name, data?.lastName, data?.motherLastName].filter(Boolean).join(' ').trim() || data?.name || '';
      console.log('[userStore] fetched user', { name: fullName, birthDay: rawBirth, age });
      set({ user: { name: fullName, birthDay: rawBirth, age }, loading: false });
    } catch (e: any) {
      set({ error: e?.message ?? 'Error', loading: false });
    }
  },
}));


