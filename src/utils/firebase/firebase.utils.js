
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithRedirect, 
    signInWithPopup, 
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signout,
    signOut,
    onAuthStateChanged
 } from 'firebase/auth';
 import {
     getFirestore,
     doc,
     getDoc,
     setDoc,
     collection,
     writeBatch,
     query,
     getDocs
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

  const googleProvider = new GoogleAuthProvider();
  
  googleProvider.setCustomParameters({
      prompt: "select_account"
  });

  export const auth = getAuth();
  export const signInWithGooglePopup = () => signInWithPopup(auth,googleProvider);
  export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

  export const db = getFirestore();

  export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
      const collectionRef = collection(db, collectionKey);
      const batch = writeBatch(db);

      objectsToAdd.forEach((object) => {
          const docRef = doc(collectionRef, object.title.toLowerCase());
          batch.set(docRef, object)
      });

      await batch.commit();
      console.log('Done');
  };

  export const getCategoriesAndDocuments = async () => {
      const collectionRef = collection(db, 'categories');
      const q = query(collectionRef);

      const querySnapshot = await getDocs(q);
      const categoryMap = querySnapshot.docs.reduce((acc, docSnapShot) => {
          const { title, items } = docSnapShot.data();
          acc[title.toLowerCase()] = items;
          return acc;
      }, {});

      return categoryMap;
  }

  export const createUserDocumentFromAuth = async (userAuth, additionalInfomation = {}) => {
      if (!userAuth) return;


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
                  createdAt,
                  ...additionalInfomation,
              });
          } catch (error) {
              console.log('error creating the user', error.message)

          }
      }

      return userDocRef;
  };

  export const createAuthUserWithEmailAndPassword = async (email, password) => {
      if(!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password)
  };

  export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if(!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password)
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListner = (callback) => 
    onAuthStateChanged(auth, callback);