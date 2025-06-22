import { create } from "zustand";

const useMemory = create((set, get) => ({
	story: "",
	notes: [],
	loading: false,
	error: null,
	setStory: (story) => set({ story }),
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
	setNotes: (notes) => set({ notes }),
	addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
	updateNote: (id, updatedNote) =>
		set((state) => ({
			notes: state.notes.map((note) => (note.id === id ? updatedNote : note)),
		})),
	deleteNote: (id) =>
		set((state) => ({
			notes: state.notes.filter((note) => note.id !== id),
		})),
	getStory: () => get().story,
	getNotes: () => get().notes,
}));

export default useMemory;
