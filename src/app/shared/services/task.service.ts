import { Injectable } from '@angular/core';
import { Observable, Subscription, take } from 'rxjs';
import { TaskState } from '../store/state/task.state';
import { Select, Store } from '@ngxs/store';
import {
    AddTask,
    ClearTasks,
    DeleteAllTasks,
    GetTasks,
    ShiftTasks,
    TransitionTask,
} from '../store/actions/task.actions';
import { globalConstants, taskTypes } from '../configs/constants';
import { Task } from '../models/Task';
import { FirestoreService } from './firestore.service';

@Injectable({
    providedIn: 'root',
})
export class TaskService {
    activeCategory = '';

    constructor(private store: Store, private afs: FirestoreService) {}

    @Select(TaskState.getTodoTasks) todoTasks$!: Observable<Task[]>;
    @Select(TaskState.getInProgressTasks) inProgressTasks$!: Observable<Task[]>;
    @Select(TaskState.getCompletedTasks) completedTasks$!: Observable<Task[]>;

    @Select(TaskState.getTodoTasksLength)
    todoLength$!: Observable<number>;

    @Select(TaskState.getInProgressTasksLength)
    inProgressLength$!: Observable<number>;

    @Select(TaskState.getCompletedTasksLength)
    completedLength$!: Observable<number>;

    @Select(TaskState.getAllTasks) allTasksInState$!: Observable<Task[]>;
    @Select(TaskState.getAllTasksLength) allTasksLength$!: Observable<number>;

    async getAllTasks(
        categoryFilter: string,
        saveState: boolean
    ): Promise<Task[] | undefined> {
        if (saveState) this.store.dispatch(new ClearTasks());
        this.activeCategory =
            categoryFilter || globalConstants.DEFAULT_CATEGORY;
        const fetchedTasks = await this.afs.getTasksFromFirestore(
            this.activeCategory
        );

        if (!fetchedTasks) return;

        const tasks = fetchedTasks.docs.map((task: any) => {
            const taskData = task.data();
            return { ...taskData };
        });
        const todoTasks = tasks.filter((task: any) => task.status === 'todo');
        const inProgressTasks = tasks.filter(
            (task: any) => task.status === 'inProgress'
        );
        const completedTasks = tasks.filter(
            (task: any) => task.status === 'completed'
        );

        if (saveState) {
            this.store.dispatch(
                new GetTasks({
                    todo: todoTasks,
                    inProgress: inProgressTasks,
                    completed: completedTasks,
                })
            );
        }

        return tasks;
    }

    async addNewTask(task: Task, saveState: boolean) {
        await this.afs.addTaskToFirestore(task);
        if (!saveState) return;
        this.store.dispatch(new AddTask(task));
    }

    async deleteTasksByStatus(taskStatus: string) {
        let taskList$!: Observable<Task[]>;
        if (taskStatus === taskTypes.TODO_TYPE) {
            taskList$ = this.todoTasks$;
        } else if (taskStatus === taskTypes.INPROGRESS_TYPE) {
            taskList$ = this.inProgressTasks$;
        } else if (taskStatus === taskTypes.COMPLETED_TYPE) {
            taskList$ = this.completedTasks$;
        }
        if (!taskList$) return;
        let taskListSub!: Subscription;
        taskListSub = taskList$
            .pipe(take(1))
            .subscribe(async (taskList: Task[]) => {
                taskListSub?.unsubscribe();
                await this.afs.deleteAllTasksFirestore(taskList);
                this.store.dispatch(new DeleteAllTasks(taskStatus));
            });
    }

    async deleteAllTasks(taskList: Task[], saveState: boolean) {
        if (taskList.length) {
            await this.afs.deleteAllTasksFirestore(taskList);
        } else {
            let taskListSub!: Subscription;
            taskListSub = this.allTasksInState$
                .pipe(take(1))
                .subscribe(async (taskList: Task[]) => {
                    taskListSub?.unsubscribe();
                    await this.afs.deleteAllTasksFirestore(taskList);
                });
        }
        if (saveState) this.store.dispatch(new ClearTasks());
    }

    async updateTasksCategory(
        taskList: Task[],
        saveState: boolean,
        updateObject: any
    ) {
        if (taskList.length) {
            await this.afs.updateAllTasksFirestore(taskList, updateObject);
            if (saveState) this.store.dispatch(new ShiftTasks(taskList));
        } else {
            let taskListSub!: Subscription;
            taskListSub = this.allTasksInState$
                .pipe(take(1))
                .subscribe(async (taskList: Task[]) => {
                    taskListSub?.unsubscribe();
                    await this.afs.updateAllTasksFirestore(
                        taskList,
                        updateObject
                    );
                });
        }
    }

    deleteTask() {}

    transitionTask() {}
}
