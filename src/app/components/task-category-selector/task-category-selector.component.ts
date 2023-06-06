import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import {
    errors,
    globalConstants,
    messages,
} from 'src/app/shared/configs/constants';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { UtilService } from 'src/app/shared/services/util.service';

@Component({
    selector: 'app-task-category-selector',
    templateUrl: './task-category-selector.component.html',
    styleUrls: ['./task-category-selector.component.scss'],
})
export class TaskCategorySelectorComponent implements OnInit, OnChanges {
    constructor(
        private afs: FirestoreService,
        private util: UtilService,
        private modalService: AppModalService,
        private toaster: ToasterService
    ) {}

    @Input() taskCategories!: string[];
    @Input() areTasksPresent!: boolean;
    @Output() selectedCategory = new EventEmitter<string>();

    toggleCategoryMenu = false;
    newCategoryMode = false;
    activeCategory = 'General';
    categoryInputHelpText = '';
    newCategory = '';
    DEFAULT_CATEGORY = globalConstants.DEFAULT_CATEGORY;
    warningMessage = errors.warningMessages.categoryDelete;

    spinners = {
        addCategory: false,
    };

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        // checking whether there are tasks present in a category
        this.areTasksPresent = changes['areTasksPresent']?.currentValue;
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
        let deleteCategory = true;
        let tasks: QuerySnapshot<DocumentData>;
        try {
            if (this.activeCategory === category && this.areTasksPresent) {
                isShowModal = true;
            }

            if (this.activeCategory !== category) {
                tasks = await this.afs.getTasksFromFirestore(category);
                if (tasks.size) isShowModal = true;
            }

            if (isShowModal) {
                const modal = globalConstants.ModalTypes.IS_CATEGORY_DELETE;
                deleteCategory = false;
                this.modalService.showModal(modal.id);
                this.modalService.getAction().subscribe(async (action: any) => {
                    if (action === modal.actions.deleteAll) {
                        // handle delete all tasks and category
                        console.log('delete');
                    }

                    if (action === modal.actions.transfer) {
                        // handle transfer tasks and delete category
                        console.log('transfer');
                    }
                });
            }

            if (deleteCategory) {
                await this.afs.removeCategoryFromFirestore(category);
                const index = this.util.getElementIndex(
                    this.taskCategories,
                    category
                );
                this.taskCategories.splice(index, 1);
                // INFO: if active category is the one being deleted, change category to default category
                if (this.activeCategory === category) {
                    this.activeCategory = this.DEFAULT_CATEGORY;
                    this.selectedCategory.emit(this.DEFAULT_CATEGORY);
                }
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
