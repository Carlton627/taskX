export const cardProps = Object.freeze({
	todoProps: {
		btn: 'Mark In Progress',
		tagClassName: 'is-warning',
		btnClassName: 'mark__in-progress'
	},
	inProgressProps: {
		btn: 'Mark as Completed',
		tagClassName: 'is-info',
		btnClassName: 'mark__completed'
	},
	completedProps: {
		btn: '',
		tagClassName: 'is-success'
	}
});

export const cardStatus = Object.freeze({
	todo: 'todo',
	inProgress: 'inProgress',
	completed: 'completed'
});
