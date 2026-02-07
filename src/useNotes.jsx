import React, { useRef, useEffect } from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import Note from '@/components/Note.jsx';
import NotesFieldset from '@/components/NotesFieldset.jsx';
import { useConfirm } from 'material-ui-confirm';
import { useSelector, useDispatch } from 'react-redux';
import { useDeleteNoteMutation } from '@/state/api/rootApi.js';
import { selectUserId } from '@/state/features/authSlice';
import { showNotification } from './state/features/notificationSlice';

export function useNotes({ control, name = 'notes' }) {
	const { fields, append, remove } = useFieldArray({ control, name });
	const dispatch = useDispatch();
	const confirm = useConfirm();
	const userId = useSelector(selectUserId);
	const [deleteNote] = useDeleteNoteMutation();
	const newNoteRef = useRef(null);
	const shouldFocusNewNote = useRef(false);

	const handleDeleteNote = async (index) => {
		try {
			await confirm({
				cancellationText: 'Cancel',
				confirmationText: 'Delete',
				description: 'Are you sure you want to delete this note?',
				title: 'Confirm Deletion'
			});
			const note = fields[index];
			if (note && note.note_id) {
				try {
					await deleteNote({ id: note.note_id, userId }).unwrap();
					dispatch(showNotification({
						alertVariant: 'filled',
						autoCloseDuration: 3000,
						message: 'Note deleted successfully',
						severity: 'success'
					}));
				} catch {
					dispatch(showNotification({
						alertVariant: 'filled',
						message: 'Failed to delete note',
						severity: 'error'
					}));
				}
			}
			remove(index);
		} catch {
			// User cancelled, do nothing
		}
	};

	useEffect(() => {
		if (shouldFocusNewNote.current && newNoteRef.current) {
			newNoteRef.current.focus();
			shouldFocusNewNote.current = false;
		}
	}, [fields.length]);

	const NotesSection = (
		<NotesFieldset onAddNote={
			() => {
				shouldFocusNewNote.current = true;
				append({ note_id: null, note_text: '' });
			}
		}>
			{
				fields.length === 0 ? (
					<div style={{ color: '#888', fontStyle: 'italic', padding: '8px 0' }}>
						There are currently no notes.
					</div>
				) : (
					fields.map((note, index) => (
						<Controller
							key={note.id || note.note_id || index}
							name={`${name}.${index}.note_text`}
							control={control}
							defaultValue={note.note_text}
							render={
								({ field }) => (
									<Note
										ref={index === fields.length - 1 ? newNoteRef : null}
										value={field.value}
										onChange={field.onChange}
										onDeleteNote={() => handleDeleteNote(index)} />
								)
							} />
					))
				)
			}
		</NotesFieldset>
	);

	return { NotesSection };
}
