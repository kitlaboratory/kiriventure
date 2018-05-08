import {auth} from './firebase';

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>{
    return new Promise((resolve, reject) => {
        auth.signInWithEmailAndPassword(email, password)
        .then(response => {
            resolve(response);
        })  
        .catch(error => {
            reject(error);
        });
    })
}

// IsAuthenticated
export const isAuthenticated = () => {
    return new Promise((resolve, reject) => {
        resolve(false);
    })
}