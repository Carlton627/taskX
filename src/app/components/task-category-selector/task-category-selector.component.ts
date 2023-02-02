import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { globalConstants } from 'src/app/shared/configs/constants';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { UtilService } from 'src/app/shared/services/util.service';

@Component({
    selector: 'app-task-category-selector',
    templateUrl: './task-category-selector.component.html',
    styleUrls: ['./task-category-selector.component.scss'],
})
export class TaskCategorySelectorComponent implements OnInit {
    constructor(private afs: FirestoreService, private util: UtilService) {}

    @Input() taskCategories!: string[];
    @Output() selectedCategory = new EventEmitter<string>();

    toggleCategoryMenu = false;
    newCategoryMode = false;
    activeCategory = 'General';
    newCategory = '';
    DEFAULT_CATEGORY = globalConstants.DEFAULT_CATEGORY;

    spinners = {
        addCategory: false,
    };

    ngOnInit(): void {}

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

    async deleteCategory(event: Event, category: string) {
        event.stopPropagation();
        try {
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
        } catch (err) {
            console.log(err);
        }
    }

    async createNewCategory(event: Event) {
        event.stopPropagation();
        if (!this.newCategory) return;
        try {
            this.spinners.addCategory = true;
            await this.afs.addCategoryToFirestore(this.newCategory);
            this.taskCategories.push(this.newCategory);
            this.activeCategory = this.newCategory;
            this.selectedCategory.emit(this.newCategory);
        } catch (err) {
            console.log(err);
        } finally {
            this.spinners.addCategory = false;
            this.newCategoryMode = false;
            this.newCategory = '';
        }
    }
}
