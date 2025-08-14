//src/lib/firebase.js
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from './firebaseClient'; 

//------------------ Auth --------------------///

// Iniciar sesión con usuario y contraseña
export const signIn = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    return { user: userCredential.user, idToken };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Crear un nuevo usuario con email y contraseña
export const signUp = async ({ email, password }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    return { user: userCredential.user, idToken };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Iniciar sesión con Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    return { user: result.user, idToken };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Cerrar sesión
export const logOutBack = async () => {
  console.log('Cerrando sesión en Firebase...');
  await fetch('/api/logout', { method: 'POST', credentials: 'include' });
  localStorage.clear();
  sessionStorage.clear();
};


