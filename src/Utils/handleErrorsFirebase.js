import Swal from "sweetalert2";
import { toast } from 'react-toastify';

// Manejo de errores de Firebase y Backend
const handleAuthError = (error) => {
  // Si es un string de código de error de Firebase
  if (typeof error === 'string') {
    switch (error) {
      case "auth/invalid-email":
        return toast.error("Correo inválido");
      case "auth/missing-email":
        return toast.error("Debe ingresar un email");
      case "auth/missing-password":
        return toast.error("Debe ingresar una contraseña");
      case "auth/invalid-credential":
        return toast.error("Credenciales inválidas");
      case "auth/too-many-requests":
        return Swal.fire(
          "Demasiados intentos",
          "Hemos detectado demasiados intentos de inicio de sesión fallidos. Por razones de seguridad, hemos bloqueado temporalmente el acceso. Por favor, inténtalo de nuevo más tarde.",
          "error"
        );
      case "auth/weak-password":
        return toast.error("La contraseña debe tener como mínimo 6 caracteres.");
      case "auth/email-already-in-use":
        return toast.error("El usuario que quiere crear ya existe.");
      default:
        return toast.error("Algo salió mal. Intente nuevamente.");
    }
  }

  // Si es un error del backend (objeto con message o error)
  if (typeof error === 'object') {
    const backendMsg = error?.message || error?.error;

    if (backendMsg?.includes('DNI/CUIT ya está en uso')) {
      return toast.error("El DNI o CUIT ya está registrado.");
    }

    if (backendMsg?.includes('Invalid Firebase ID token')) {
      return toast.error("Sesión inválida. Intente volver a iniciar sesión.");
    }

    if (backendMsg?.includes('Unauthorized')) {
      return toast.error("No autorizado.");
    }

    return toast.error(backendMsg || "Error del servidor. Intente más tarde.");
  }

  // Fallback
  toast.error("Error inesperado.");
};

export default handleAuthError;
