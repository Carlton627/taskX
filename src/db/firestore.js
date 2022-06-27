/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
import {
	doc,
	getDoc,
	getFirestore,
	setDoc,
	Timestamp,
	collection,
	query,
	where,
	getDocs,
	updateDoc,
	deleteDoc,
	writeBatch
} from 'firebase/firestore';

import { app } from '../configs/firebase';

const db = getFirestore(app);

/**
 * Function to check whether the logged in user is a registered user.
 * @param {string} docId document id to be fetched from cloud firestore.
 * @returns {DocumentSnapshot<documentData>} returns the document if found, or else return undefined.
 * @author Carlton Rodrigues
 */
export const userExists = function (docId) {
	const userDoc = doc(db, 'users', docId);
	return getDoc(userDoc);
};

/**
 * Function to register a user into cloud firestore
 * @param {string} docId passing the uid of the newly signed in user to be used as the document id.
 * @param {Object} userData passing the state.user property to create a new user in firestore.
 * @returns {Promise} promise which will be fulfilled in the calling function
 */
export const addUserToFirestore = function (docId, userData) {
	const userDoc = doc(db, 'users', docId);
	return setDoc(userDoc, userData);
};

/**
 * Function get all the tasks from cloud firestore.
 * @returns {Promise} this function is just used to set task state variable and doesn't return anything.
 * @author Carlton Rodrigues
 */
export const getTasksFromFirestore = function (userId) {
	try {
		const q = query(collection(db, `users/${userId}/tasks`), where('author', '==', userId));
		return getDocs(q);
	} catch (err) {
		throw err;
	}
};
