'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../../public/logos/logoEshop.webp';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { signIn } from '../../lib/firebase';
import { ToastContainer } from 'react-toastify';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import { handleAuthError } from '@/Utils/handleErrorsFirebase';
import { setInLocalStorage } from '@/Hooks/localStorage';
import Image from 'next/image';


const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm(); // Usa el hook useForm

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await signIn(data); // Aquí usamos los datos del formulario (data) en lugar de usuario
      setInLocalStorage('USER', res.user)
      router.push('/Admin')
    } catch (error) {
      handleAuthError(error.code);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
      <ProtectedRoute>
        <section>
          <ToastContainer position="top-center" autoClose={3000} theme="colored" />
          <article className="bg-secondary-background h-[100vh]">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
              <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 justify-center" title="Shop Logo">
                      <Image src={logo.src} width={150} height={150} alt="eshop logo" title="eshop Logo" priority />
                  </Link>
                  <form id='formLogin' className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                      <label htmlFor="emailLogin" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                      <input type="email" id="emailLogin"className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-3 focus:ring-primary focus:border-primary block w-full p-2.5 placeholder-gray-400"
                        placeholder="nombre@empresa.com" {...register('email', { required: true })} />
                      {errors.email && <p className="text-sm text-red-600">Este campo es requerido</p>}
                    </div>
                    <div>
                      <label htmlFor="passwordLogin" className="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} id="passwordLogin" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-3 focus:ring-primary focus:border-primary block w-full p-2.5 placeholder-gray-400"
                          placeholder="••••••••" {...register('contraseña', { required: true })} />
                        <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5" aria-label="ver contraseña" >
                          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                      </div>
                      {errors.contraseña && <p className="text-sm text-red-600">Este campo es requerido</p>}
                    </div>

                    <button type="submit" className=" flex justify-center w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2" disabled={loading} aria-label="iniciar sesion">
                       {loading ? <FaSpinner className='animate-spin'/> : 'INICIAR SESION'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </article>
        </section>
      </ProtectedRoute>
  );
};

export default Login;
