import firebase from 'firebase';
import {PRO_APIKEY, PRO_AUTHDOMAIN, PRO_DATABASEURL, PRO_MESSAGINGSENDERID, PRO_STORAGEBUGKET, PRO_PROJECTID} from './config';

const config = {
	apiKey: PRO_APIKEY,
	authDomain: PRO_AUTHDOMAIN,
	databaseURL: PRO_DATABASEURL,
	projectId: PRO_PROJECTID,
	storageBucket: PRO_STORAGEBUGKET,
	messagingSenderId: PRO_MESSAGINGSENDERID,
};

if(!firebase.apps.length) {
	firebase.initializeApp(config);
}

const auth = firebase.auth();
const database = firebase.database();

export {auth, database};