import dayjs from 'dayjs';

export const formatDateTimeOrNull = (value) => {
	return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null;
};
