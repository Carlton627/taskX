import { State, Action, StateContext, Selector } from '@ngxs/store';
import { TaskStateModel, Task, TaskMetaData } from '../../models/Task';
import {
    AddTask,
    GetTasks,
    ClearTasks,
    DeleteAllTasks,
    TransitionTask,
    ShiftTasks,
    DeleteTask,
} from '../actions/task.actions';
import { UtilService } from '../../services/util.service';
import { taskTypes } from '../../configs/constants';
import { Injectable } from '@angular/core';

@State<TaskStateModel>({
    name: 'task',
    defaults: {
        todo: [],
        inProgress: [],
        completed: [],
    },
})
@Injectable({
    providedIn: 'root',
})
export class TaskState {
    constructor(private util: UtilService) {}

    @Selector()
    static getTodoTasks(state: TaskStateModel): Task[] {
        return state.todo;
    }

    @Selector()
    static getInProgressTasks(state: TaskStateModel): Task[] {
        return state.inProgress;
    }

    @Selector()
    static getCompletedTasks(state: TaskStateModel): Task[] {
        return state.completed;
    }

    @Selector()
    static getTodoTasksLength(state: TaskStateModel): number {
        return state.todo.length;
    }

    @Selector()
    static getInProgressTasksLength(state: TaskStateModel): number {
        return state.inProgress.length;
    }

    @Selector()
    static getCompletedTasksLength(state: TaskStateModel): number {
        return state.completed.length;
    }

    @Selector()
    static getAllTasksLength(state: TaskStateModel): number {
        return (
            state.todo.length + state.inProgress.length + state.completed.length
        );
    }

    @Selector()
    static getAllTasks(state: TaskStateModel): Task[] {
        return [...state.todo, ...state.inProgress, ...state.completed];
    }

    @Action(ClearTasks)
    clearTasks(ctx: StateContext<TaskStateModel>) {
        ctx.patchState({
            todo: [],
            inProgress: [],
            completed: [],
        });
    }

    @Action(DeleteAllTasks)
    deleteTasksByStatus(
        ctx: StateContext<TaskStateModel>,
        { status }: DeleteAllTasks
    ) {
        const taskState = ctx.getState();
        if (status === taskTypes.TODO_TYPE) {
            ctx.patchState({
                ...taskState,
                todo: [],
            });
        } else if (status === taskTypes.INPROGRESS_TYPE) {
            ctx.patchState({
                ...taskState,
                inProgress: [],
            });
        } else if (status === taskTypes.COMPLETED_TYPE) {
            ctx.patchState({
                ...taskState,
                completed: [],
            });
        }
    }

    @Action(GetTasks)
    getTasks(ctx: StateContext<TaskStateModel>, { tasks }: GetTasks) {
        ctx.patchState({
            todo: tasks.todo,
            inProgress: tasks.inProgress,
            completed: tasks.completed,
        });
    }

    @Action(AddTask)
    addTask(ctx: StateContext<TaskStateModel>, { task }: AddTask) {
        const taskState = ctx.getState();
        const status = task.status;
        if (status === taskTypes.TODO_TYPE) {
            ctx.patchState({
                ...taskState,
                todo: [task, ...taskState.todo],
            });
        } else if (status === taskTypes.INPROGRESS_TYPE) {
            ctx.patchState({
                ...taskState,
                inProgress: [task, ...taskState.inProgress],
            });
        }
    }

    @Action(ShiftTasks)
    shiftTasksCategory(
        ctx: StateContext<TaskStateModel>,
        { tasks }: ShiftTasks
    ) {
        const taskState = ctx.getState();
        const todo: Task[] = [];
        const inProgress: Task[] = [];
        const completed: Task[] = [];
        tasks.forEach((task: Task) => {
            if (task.status === taskTypes.TODO_TYPE) {
                todo.push(task);
            }

            if (task.status === taskTypes.INPROGRESS_TYPE) {
                inProgress.push(task);
            }

            if (task.status === taskTypes.COMPLETED_TYPE) {
                completed.push(task);
            }
        });

        ctx.patchState({
            todo: [...todo, ...taskState.todo],
            inProgress: [...inProgress, ...taskState.inProgress],
            completed: [...completed, ...taskState.completed],
        });
    }

    @Action(TransitionTask)
    transitionTask(
        ctx: StateContext<TaskStateModel>,
        { taskMetaData }: TransitionTask
    ) {
        const taskState = ctx.getState();
        const fromStatus = this.util.filterTaskStateByType(
            taskMetaData.taskType
        );
        const toStatus = this.util.filterTaskStateByType(
            taskMetaData.toTaskType || ''
        );
        const transitionedTask = taskState[fromStatus].find(
            (task: Task) => task.id === taskMetaData.taskId
        );

        if (!transitionedTask) return;

        transitionedTask.status = taskMetaData.toTaskType || '';

        const updatedFromTaskList = taskState[fromStatus].filter(
            (task: Task) => task.id !== taskMetaData.taskId
        );

        // tasks with status to which task will go
        const updatedToTaskList = [transitionedTask, ...taskState[toStatus]];

        if (taskMetaData.taskType === taskTypes.TODO_TYPE) {
            ctx.patchState({
                todo: updatedFromTaskList,
                inProgress: updatedToTaskList,
                completed: taskState.completed,
            });
        } else if (taskMetaData.taskType === taskTypes.INPROGRESS_TYPE) {
            ctx.patchState({
                todo: taskState.todo,
                inProgress: updatedFromTaskList,
                completed: updatedToTaskList,
            });
        }
    }

    @Action(DeleteTask)
    deleteTask(
        ctx: StateContext<TaskStateModel>,
        { taskMetaData }: DeleteTask
    ) {
        const taskState = ctx.getState();
        const status = this.util.filterTaskStateByType(taskMetaData.taskType);

        const updatedTaskList = taskState[status].filter(
            (task: Task) => task.id !== taskMetaData.taskId
        );

        if (taskMetaData.taskType === taskTypes.TODO_TYPE) {
            ctx.patchState({
                ...taskState,
                todo: updatedTaskList,
            });
        } else if (taskMetaData.taskType === taskTypes.INPROGRESS_TYPE) {
            ctx.patchState({
                ...taskState,
                inProgress: updatedTaskList,
            });
        } else if (taskMetaData.taskType === taskTypes.COMPLETED_TYPE) {
            ctx.patchState({
                ...taskState,
                completed: updatedTaskList,
            });
        }
    }
}
