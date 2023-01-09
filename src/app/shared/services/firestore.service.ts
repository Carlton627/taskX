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

    getUserById(id: any) {
        // INFO: returns a promise
        const docRef = doc(this.afs, 'users', id);
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

    getTasksFromFirestore() {
        const q = query(
            collection(this.afs, `users/${this.userId}/tasks`),
            where('author', '==', this.userId),
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

    deleteAllTasksFromFirestore(taskList: Task[]) {
        const batch = writeBatch(this.afs);
        const taskDocRefs = taskList.map((task: Task) =>
            doc(this.afs, `users/${this.userId}/tasks`, task.id)
        );
        taskDocRefs.forEach((taskDoc: any) => batch.delete(taskDoc));
        return batch.commit();
    }
}
