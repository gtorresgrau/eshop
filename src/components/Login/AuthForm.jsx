//src/componentes/AuthForm.jsx

'use client';
import React, { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../Hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle'
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import handleAuthError from '../../Utils/handleErrorsFirebase';
import { signIn, signUp } from '../../lib/firebase';
import { auth } from '../../lib/firebaseClient';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Loading = dynamic(() => import('../Loading/Loading'));

const AuthForm = ({ mode = 'login' }) => {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated, isAdmin, isClient } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const createUserInMongoDB = async (user, additionalData = {}) => {
    const idToken = await user.getIdToken();
    await fetch('/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        uid: user.uid,
        correo: user.email,
        nombreCompleto: additionalData.nombreCompleto || user.displayName || '',
        dniOCuit: additionalData.dniOCuit || '',
        telefono: additionalData.telefono || user.phoneNumber || '',
        direccion: additionalData.direccion || {},
      }),
    });
  };

// Nueva función reutilizable para redirigir según rol
const redirectByRole = (router, rol) => {
  if (rol === 'admin') {
    router.push('/Admin');
  } else if (rol === 'cliente') {
    router.push('/Dashboard');
  } else {
    router.push('/');
  }
};

const onSubmit = async (data) => {
  setLoading(true);
  try {
    let res;
    if (mode === 'login') {
      res = await signIn(data);
      await createUserInMongoDB(res.user);
    } else {
      res = await signUp(data);
      await createUserInMongoDB(res.user, {
        nombreCompleto: data.nombreCompleto,
        dniOCuit: data.dniOCuit,
      });
    }

    // Después de crear el usuario en Mongo, consultamos el rol real
    const meRes = await fetch('/api/auth/me', { credentials: 'include' });
    if (meRes.ok) {
      const { user } = await meRes.json();
      redirectByRole(router, user?.rol);
    } else {
      router.push('/');
    }
  } catch (error) {
    handleAuthError(error.code);
  } finally {
    setLoading(false);
  }
};

const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  setLoading(true);
  try {
    const res = await signInWithPopup(auth, provider);
    const token = await res.user.getIdToken();

    await fetch('/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        uid: res.user.uid,
        nombreCompleto: res.user.displayName,
        correo: res.user.email,
        rol: 'cliente',
      }),
    });

    // Igual que en onSubmit, consultamos el rol y redirigimos
    const meRes = await fetch('/api/auth/me', { credentials: 'include' });
    if (meRes.ok) {
            const { user } = await meRes.json();
            redirectByRole(router, user?.rol);
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error(error);
          handleAuthError(error.code);
        } finally {
          setLoading(false);
        }
  };


  if (authLoading || isAuthenticated) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <section>
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        <article className="bg-secondary-background h-[100vh]">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 justify-center">
                  <Image src="/logos/logo.webp" width={100} height={100} alt="ESHOP logo" />
                </Link>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                    <input
                      id="email"
                      type="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-3 focus:ring-primary focus:border-primary block w-full p-2.5 placeholder-gray-400"
                      placeholder="nombre@empresa.com"
                      {...register('email', { required: true })}
                    />
                    {errors.email && <p className="text-sm text-red-600">Este campo es requerido</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-3 focus:ring-primary focus:border-primary block w-full p-2.5 placeholder-gray-400"
                        placeholder="••••••••"
                        {...register('password', { required: true })}
                      />
                      <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5" aria-label="ver password">
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-600">Este campo es requerido</p>}
                  </div>

                  {mode === 'register' && (
                    <>
                      <div>
                        <label htmlFor="confirmpassword" className="block mb-2 text-sm font-medium text-gray-900">Confirmar Password</label>
                        <div className="relative">
                          <input
                            id="confirmpassword"
                            type={showPassword ? 'text' : 'password'}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-3 focus:ring-primary focus:border-primary block w-full p-2.5 placeholder-gray-400"
                            placeholder="••••••••"
                            {...register('confirmpassword', {
                              required: true,
                              validate: (value) => value === password || "Las contraseñas no coinciden"
                            })}
                          />
                          <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5" aria-label="ver password">
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                          </button>
                        </div>
                        {errors.confirmpassword && <p className="text-sm text-red-600">{errors.confirmpassword.message || "Este campo es requerido"}</p>}
                      </div>

                      <div>
                        <label htmlFor="nombreCompleto" className="block mb-2 text-sm font-medium text-gray-900">Nombre Completo</label>
                        <input
                          id="nombreCompleto"
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-3 focus:ring-primary focus:border-primary block w-full p-2.5 placeholder-gray-400"
                          placeholder="Juan Pablo Perez"
                          {...register('nombreCompleto', { required: true })}
                        />
                        {errors.nombreCompleto && <p className="text-sm text-red-600">Este campo es requerido</p>}
                      </div>

                      <div>
                        <label htmlFor="dniOCuit" className="block mb-2 text-sm font-medium text-gray-900">DNI o CUIT</label>
                        <input
                          id="dniOCuit"
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-3 focus:ring-primary focus:border-primary block w-full p-2.5 placeholder-gray-400"
                          placeholder="12345678"
                          {...register('dniOCuit', { required: true })}
                        />
                        {errors.dniOCuit && <p className="text-sm text-red-600">Este campo es requerido</p>}
                      </div>
                    </>
                  )}

                  <button type="submit" className="flex justify-center w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2" disabled={loading}>
                    {loading ? <Loading /> : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                  </button>

                  <button type="button" onClick={loginWithGoogle} className="mt-2 w-full flex justify-center items-center gap-2 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" disabled={loading}>
                    <FontAwesomeIcon icon={faGoogle} fixedWidth className="w-4 h-4 align-[-0.125em]" aria-label='Google'/>
                    {loading ? <Loading /> : mode === 'login' ? 'Iniciar sesión con Google' : 'Crear cuenta con Google'}
                  </button>

                  <p className="text-sm font-light text-gray-500">
                    {mode === 'login' ? (
                      <>¿No tienes una cuenta? <Link href="/user/Register" className="font-medium text-primary-600 hover:underline">Crear cuenta</Link></>
                    ) : (
                      <>¿Ya tienes una cuenta? <Link href="/user/Login" className="font-medium text-primary-600 hover:underline">Iniciar sesión</Link></>
                    )}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </article>
      </section>
    </Suspense>
  );
};

export default AuthForm;
