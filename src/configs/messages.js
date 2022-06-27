export const errorMessages = Object.freeze({
	startDate: {
		lessThanCurrentDate: '⚠️ Start date cannot be in the past',
		startDateGreaterThanEndDate: '⚠️ Start date cannot be after deadline date'
	},
	endDate: {
		lessThanCurrentDate: '⚠️ Deadline date cannot be in the past',
		endDateLessThanStartDate: '⚠️ Deadline date cannot be before start date'
	}
});
