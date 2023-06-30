import { Task, TaskMetaData, TaskStateModel } from '../../models/Task';

export class AddTask {
    static readonly type = '[Task] Add';
    constructor(public task: Task) {}
}

export class DeleteTask {
    static readonly type = '[Task] Delete';
    constructor(public taskMetaData: TaskMetaData) {}
}

export class GetTasks {
    static readonly type = '[Task] Get All';
    constructor(public tasks: TaskStateModel) {}
}

export class ClearTasks {
    static readonly type = '[Task] Clear';
}

export class TransitionTask {
    static readonly type = '[Task] Transition';
    constructor(public taskMetaData: TaskMetaData) {}
}

export class DeleteAllTasks {
    static readonly type = '[Task] Delete All';
    constructor(public status?: string) {}
}

export class ShiftTasks {
    static readonly type = '[Task] Shift All';
    constructor(public tasks: Task[]) {}
}
