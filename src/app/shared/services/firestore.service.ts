import { Injectable } from '@angular/core';
import {
    doc,
    getDoc,
    setDoc,
    Timestamp,
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    deleteDoc,
    writeBatch,
    Firestore,
    orderBy,
    arrayUnion,
    arrayRemove,
    DocumentReference,
    DocumentData,
} from '@angular/fire/firestore';
import { Task } from '../models/Task';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {
    userId: string = '';
    constructor(private afs: Firestore, private auth: AuthService) {
        this.auth.getUserSubscription().subscribe((user: any) => {
            this.userId = user?.uid;
        });
    }

    getUser(id?: string) {
        // INFO: returns a promise
        const docRef = doc(this.afs, 'users', id || this.userId);
        return getDoc(docRef);
    }

    addUserToFirestore(docId: string, userData: any) {
        const userDoc = doc(this.afs, 'users', docId);
        return setDoc(userDoc, userData);
    }

    addTaskToFirestore(taskData: any) {
        const task = {
            ...taskData,
            author: this.userId,
            createdAt: Timestamp.fromDate(new Date()),
        };
        const taskDocRef = doc(this.afs, `users/${this.userId}/tasks`, task.id);
        return setDoc(taskDocRef, task);
    }

    getTasksFromFirestore(categoryFilter: string) {
        const q = query(
            collection(this.afs, `users/${this.userId}/tasks`),
            where('author', '==', this.userId),
            where('category', '==', categoryFilter),
            orderBy('createdAt', 'desc')
        );
        return getDocs(q);
    }

    deleteTaskFromFirestore(taskId: string) {
        const taskDocRef = doc(this.afs, `users/${this.userId}/tasks`, taskId);
        return deleteDoc(taskDocRef);
    }

    updateTaskStatus(taskId: string, toTaskType: string) {
        const taskDocRef = doc(this.afs, `users/${this.userId}/tasks`, taskId);
        return updateDoc(taskDocRef, { status: toTaskType });
    }

    deleteAllTasksFirestore(taskList: Task[]) {
        const batch = writeBatch(this.afs);
        const taskDocRefs = taskList.map((task: Task) =>
            doc(this.afs, `users/${this.userId}/tasks`, task.id)
        );
        taskDocRefs.forEach((taskDoc: DocumentReference<DocumentData>) =>
            batch.delete(taskDoc)
        );
        return batch.commit();
    }

    updateAllTasksFirestore(taskList: Task[], updateObject: any) {
        const batch = writeBatch(this.afs);
        const taskDocRefs = taskList.map((task: Task) =>
            doc(this.afs, `users/${this.userId}/tasks`, task.id)
        );
        taskDocRefs.forEach((taskDoc: DocumentReference<DocumentData>) => {
            batch.update(taskDoc, updateObject);
        });
        return batch.commit();
    }

    addTeamToFirestore() {}

    addCategoryToFirestore(category: string) {
        const userDocRef = doc(this.afs, 'users', this.userId);
        return updateDoc(userDocRef, {
            taskCategories: arrayUnion(category),
        });
    }

    removeCategoryFromFirestore(category: string) {
        const userDocRef = doc(this.afs, 'users', this.userId);
        return updateDoc(userDocRef, { taskCategories: arrayRemove(category) });
    }
}
