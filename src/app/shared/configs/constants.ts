export const taskTypes = Object.freeze({
    TODO_TYPE: 'todo',
    INPROGRESS_TYPE: 'inProgress',
    COMPLETED_TYPE: 'completed',
});

export const errors = Object.freeze({
    dateInputErrors: {
        startDateLessThanCurrentDate: 'Start date must not be in the past',
        startDateGreaterThanDeadline:
            'Start date must not be greater than end date',
        deadlineLessThanCurrentDate: 'Deadline must not be in the past',
        deadlineLessThanStartDate: 'Deadline must be greater than start date',
    },
});

export const styleConfigs = Object.freeze({
    TextError: 'text-error',
    TextWarn: 'text-warn',
    TextInfo: 'text-info',
    TextSuccess: 'text-success',
});
