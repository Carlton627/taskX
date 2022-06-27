/* eslint-disable no-useless-catch */
import {
	GoogleAuthProvider,
	getAuth,
	signInWithPopup,
	signOut,
	onAuthStateChanged
} from 'firebase/auth';
import { userExists, addUserToFirestore } from './firestore';

const auth = getAuth();

export const checkAuthState = function (callback) {
	onAuthStateChanged(auth, callback);
};

export const getUser = function () {
	return auth.currentUser;
};

/**
 * Function to sign in user with their Google accounts.
 * @author Carlton Rodrigues
 */
export const googleSignIn = async function () {
	try {
		const credential = await signInWithPopup(auth, new GoogleAuthProvider());
		const userDocSnap = await userExists(credential.user.uid);
		if (!userDocSnap.exists()) {
			// store doc in users
			await addUserToFirestore(credential.user.uid, credential.user);
		}
	} catch (err) {
		throw err;
	}
};

/**
 * Function to signout user from the app
 * @author Carlton Rodrigues
 */
export const signOutUser = async function () {
	try {
		await signOut(auth);
	} catch (err) {
		throw err;
	}
};
