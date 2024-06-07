import { create } from "zustand";

const useCartStore = create((set) => ({
  items: [],
  setItems: (newItems) => set({ items: newItems }),
}));

export default useCartStore;
