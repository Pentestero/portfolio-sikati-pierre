import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: "light",
      toggleTheme: () =>
        set(state => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    {
      name: "theme-storage",
    }
  )
);

interface PortfolioState {
  isLoading: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
  setLoading: (loading: boolean) => void;
}

export const usePortfolioStore = create<PortfolioState>(set => ({
  isLoading: false,
  activeSection: "hero",
  setActiveSection: section => set({ activeSection: section }),
  setLoading: loading => set({ isLoading: loading }),
}));
