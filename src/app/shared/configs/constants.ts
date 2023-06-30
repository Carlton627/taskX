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

    warningMessages: {
        categoryDelete: `Oops, looks like the category you want to delete has tasks
                present in it. You can choose to
                <b>delete all</b> the tasks in the category,
                <b>transfer these tasks under another category.</b> or
                <b>cancel this action</b>`,
    },

    errorMessages: {
        categoryInputBlank: 'Please enter a name for your new category',
        categoryDuplicate: 'You already have a category with the same name',
    },
});

export const messages = Object.freeze({
    toastMessages: {
        categoryCreated:
            'Category added: You can now add tasks to this category',
        taskAddedToCategory: 'Your task was added to category ',
    },
});

export const styleConfigs = Object.freeze({
    TextError: 'text-error',
    TextWarn: 'text-warn',
    TextInfo: 'text-info',
    TextSuccess: 'text-success',
});

export const globalConstants = Object.freeze({
    TeamCardsPerPage: 3,

    DEFAULT_CATEGORY: 'General',

    NotificationTypes: {
        TEAM_INVITE: 'team-invite',
        INFO: 'info',
        ERROR: 'error',
        SUCCESS: 'success',
    },

    ModalTypes: {
        IS_CATEGORY_DELETE: {
            id: 'IS_CATEGORY_DELETE',
            actions: {
                deleteAll: 0,
                transfer: 1,
            },
        },

        SELECT_CATEGORY: {
            id: 'SELECT_CATEGORY',
            actions: {
                transfer: 0,
            },
        },
    },
});
