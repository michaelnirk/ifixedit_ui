import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const useEditorLifecycle = ({ closeEditor, openEditor, openDependency }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(openEditor());
	}, [dispatch, openEditor, openDependency]);

	const onBack = useCallback(() => {
		navigate('..');
	}, [navigate]);

	const onCloseModal = useCallback(() => {
		dispatch(closeEditor());
		navigate('..');
	}, [dispatch, closeEditor, navigate]);

	return {
		onBack,
		onCloseModal
	};
};
