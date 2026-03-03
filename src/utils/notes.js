export const sanitizeNotesForPayload = (notes) => {
	if (!Array.isArray(notes)) {
		return [];
	}

	return notes.map((note) => ({
		note_id: note?.note_id ?? null,
		note_text: note?.note_text ?? ''
	}));
};
