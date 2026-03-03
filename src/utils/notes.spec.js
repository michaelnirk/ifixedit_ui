import { describe, expect, it } from 'vitest';
import { sanitizeNotesForPayload } from '@/utils/notes';

describe('sanitizeNotesForPayload', () => {
	it('returns an empty array when input is not an array', () => {
		expect(sanitizeNotesForPayload(null)).toEqual([]);
		expect(sanitizeNotesForPayload(undefined)).toEqual([]);
		expect(sanitizeNotesForPayload('not-an-array')).toEqual([]);
	});

	it('keeps only note_id and note_text fields', () => {
		const notes = [
			{
				created_at: '2026-03-03T10:00:00Z',
				note_id: 101,
				note_text: 'Existing note',
				parent_id: 555
			}
		];

		expect(sanitizeNotesForPayload(notes)).toEqual([
			{
				note_id: 101,
				note_text: 'Existing note'
			}
		]);
	});

	it('applies safe defaults for missing fields', () => {
		const notes = [
			{},
			{ note_id: undefined, note_text: undefined },
			{ note_id: null, note_text: null }
		];

		expect(sanitizeNotesForPayload(notes)).toEqual([
			{ note_id: null, note_text: '' },
			{ note_id: null, note_text: '' },
			{ note_id: null, note_text: '' }
		]);
	});
});
