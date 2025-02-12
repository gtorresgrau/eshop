import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../pages/api/firebase'; 

//------------------ Auth--------------------///

// Función para iniciar sesión con usuario y contraseña
export const signIn = async(data)=>{
    const {email, contraseña} = data
    return await signInWithEmailAndPassword(auth, email, contraseña);
}

// Función para cerrar sesión
export const logOut = () =>{
    signOut(auth);
    return {message:'Cerro la sesion exitosamente'};
}