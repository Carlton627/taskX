import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyB8jxEM9WEHfpDV2nH8Rj_OdhsbnjbVq5c',
	authDomain: 'fir-learn-b37a3.firebaseapp.com',
	projectId: 'fir-learn-b37a3',
	storageBucket: 'fir-learn-b37a3.appspot.com',
	messagingSenderId: '953774839776',
	appId: '1:953774839776:web:8220cb3ab9921b99cbfd85',
	measurementId: 'G-GQYD6Y3M3J'
};

export const app = initializeApp(firebaseConfig);
