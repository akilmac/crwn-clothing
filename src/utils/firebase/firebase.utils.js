
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithRedirect, 
    signInWithPopup, 
    GoogleAuthProvider,
 } from 'firebase/auth';
 import {
     getFirestore,
     doc,
     getDoc,
     setDoc
 } from 'firebase/firestore';
import { async } from '@firebase/util';

const firebaseConfig = {
    apiKey: "AIzaSyBXa2fRCRJnMeAzPh9APhey3azLcGWo-1c",
    authDomain: "crwn-clothing-db-2a19e.firebaseapp.com",
    projectId: "crwn-clothing-db-2a19e",
    storageBucket: "crwn-clothing-db-2a19e.appspot.com",
    messagingSenderId: "721577384495",
    appId: "1:721577384495:web:cddd1c97b5be895a6dc4da"
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

  const provider = new GoogleAuthProvider();
  
  provider.setCustomParameters({
      prompt: "select_account"
  });

  export const auth = getAuth();
  export const signInWithGooglePopup = () => signInWithPopup(auth,provider);

  export const db = getFirestore();

  export const createUserDocumentFromAuth = async (userAuth) => {
      const userDocRef = doc(db, 'users', userAuth.uid);

      console.log(userDocRef);

      const userSnapshot = await getDoc(userDocRef);
      

      if(!userSnapshot.exists()) {
          const { displayName, email } = userAuth;
          const createdAt = new Date();

          try {
              await setDoc(userDocRef, {
                  displayName,
                  email,
                  createdAt
              });
          } catch (error) {
              console.log('error creating the user', error.message)

          }
      }

      return userDocRef;
  };