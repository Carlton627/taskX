import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
    errors,
    globalConstants,
    messages,
} from 'src/app/shared/configs/constants';
import { Task } from 'src/app/shared/models/Task';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { TaskService } from 'src/app/shared/services/task.service';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { UtilService } from 'src/app/shared/services/util.service';

@Component({
    selector: 'app-task-category-selector',
    templateUrl: './task-category-selector.component.html',
    styleUrls: ['./task-category-selector.component.scss'],
})
export class TaskCategorySelectorComponent implements OnInit, OnDestroy {
    constructor(
        private afs: FirestoreService,
        private util: UtilService,
        public modalService: AppModalService,
        private toaster: ToasterService,
        private taskService: TaskService
    ) {}

    @Input() taskCategories!: string[];
    @Output() selectedCategory = new EventEmitter<string>();

    allTaskLengthSub!: Subscription;

    shiftToTaskCategories: string[] = [];
    areTasksPresent = true;
    toggleCategoryMenu = false;
    newCategoryMode = false;
    activeCategory = 'General';
    categoryInputHelpText = '';
    newCategory = '';
    shiftToCategory = globalConstants.DEFAULT_CATEGORY.toString();
    showCategoryShiftMenu = false;
    disableActionsOnShiftMenu = false;

    DEFAULT_CATEGORY = globalConstants.DEFAULT_CATEGORY;
    warningMessage = errors.warningMessages.categoryDelete;
    modalTypes = globalConstants.ModalTypes;

    spinners = {
        addCategory: false,
    };

    ngOnInit(): void {
        this.allTaskLengthSub = this.taskService.allTasksLength$.subscribe(
            (length: number) => {
                this.areTasksPresent = length > 0;
            }
        );
    }

    ngOnDestroy(): void {
        this.allTaskLengthSub.unsubscribe();
    }

    private async deleteCategory(
        category: string,
        shiftScreenToCategory?: string
    ) {
        try {
            await this.afs.removeCategoryFromFirestore(category);
            const index = this.util.getElementIndex(
                this.taskCategories,
                category
            );
            this.taskCategories.splice(index, 1);
            // INFO: if active category is the one being deleted, change category to default category
            if (this.activeCategory === category) {
                this.activeCategory =
                    shiftScreenToCategory || this.DEFAULT_CATEGORY;
                this.selectedCategory.emit(this.activeCategory);
            }
        } catch (error) {
            console.error(error);
        }
    }

    onMenuItemSelect(category: string) {
        this.toggleCategoryMenu = false;
        if (this.activeCategory === category) return;
        this.activeCategory = category;
        this.selectedCategory.emit(category);
    }

    toggleAddCategory(event: Event, action: string) {
        event.stopPropagation();
        this.toggleCategoryMenu = false;
        if (action === 'open') {
            this.newCategoryMode = true;
            return;
        }
        this.newCategoryMode = false;
        this.newCategory = '';
    }

    async handleDeleteCategory(event: Event, category: string) {
        event.stopPropagation();
        let isShowModal = false;
        let tasks: Task[] | undefined;
        let saveState = true;
        const isDeleteActiveCategory = this.activeCategory === category;
        try {
            if (isDeleteActiveCategory && this.areTasksPresent) {
                isShowModal = true;
            }

            if (!isDeleteActiveCategory) {
                saveState = false;
                tasks = await this.taskService.getAllTasks(category, saveState);
                if (!tasks?.length) {
                    await this.deleteCategory(category);
                    return;
                } else {
                    isShowModal = true;
                }
            }

            if (isShowModal) {
                const modal = globalConstants.ModalTypes.IS_CATEGORY_DELETE;
                let appModalSub: Subscription;
                this.modalService.showModal(modal.id);
                appModalSub = this.modalService
                    .getAction()
                    .subscribe(async (action: number) => {
                        appModalSub?.unsubscribe();
                        if (action === modal.actions.deleteAll) {
                            // handle delete all tasks and category
                            await this.taskService.deleteAllTasks(
                                tasks || [],
                                saveState
                            );
                            await this.deleteCategory(category);
                            this.toaster.showInfo(
                                `Category ${category} deleted along with all the tasks`
                            );
                            this.modalService.closeModal();
                        }

                        if (action === modal.actions.transfer) {
                            // handle transfer tasks and delete category
                            let shiftScreenToCategory = '';
                            let shiftMenuSub: Subscription;
                            this.showCategoryShiftMenu = true;
                            this.shiftToTaskCategories =
                                this.taskCategories.filter(
                                    (taskCategory: string) =>
                                        taskCategory !== category
                                );
                            shiftMenuSub = this.modalService
                                .getOption()
                                .subscribe(async (_: number) => {
                                    // INFO: Beware of this code
                                    shiftMenuSub?.unsubscribe();
                                    if (this.shiftToCategory) {
                                        this.disableActionsOnShiftMenu = true;
                                        await this.taskService.updateTasksCategory(
                                            tasks || [],
                                            this.activeCategory ===
                                                this.shiftToCategory,
                                            { category: this.shiftToCategory }
                                        );
                                        if (this.activeCategory === category) {
                                            shiftScreenToCategory =
                                                this.shiftToCategory;
                                        }
                                        await this.deleteCategory(
                                            category,
                                            shiftScreenToCategory
                                        );
                                        this.toaster.showInfo(
                                            `Category ${category} deleted and all the tasks are transferred to ${this.shiftToCategory}`
                                        );
                                        this.showCategoryShiftMenu = false;
                                        this.disableActionsOnShiftMenu = false;
                                        this.shiftToCategory =
                                            this.DEFAULT_CATEGORY.toString();
                                        this.modalService.closeModal();
                                    }
                                });
                        }
                    });
            } else {
                await this.deleteCategory(category);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async createNewCategory(event: Event) {
        event.stopPropagation();
        if (!this.newCategory) {
            this.categoryInputHelpText =
                errors.errorMessages.categoryInputBlank;
            return;
        }

        if (this.taskCategories.includes(this.newCategory)) {
            this.categoryInputHelpText = errors.errorMessages.categoryDuplicate;
            return;
        }

        try {
            if (this.categoryInputHelpText) this.categoryInputHelpText = '';
            this.spinners.addCategory = true;
            await this.afs.addCategoryToFirestore(this.newCategory);
            this.taskCategories.push(this.newCategory);
            this.activeCategory = this.newCategory;
            this.selectedCategory.emit(this.newCategory);
            this.toaster.showSuccess(messages.toastMessages.categoryCreated);
        } catch (err) {
            console.log(err);
        } finally {
            this.spinners.addCategory = false;
            this.newCategoryMode = false;
            this.newCategory = '';
        }
    }
}
