'use client'
import React, { useState, useRef, useEffect, useContext } from 'react';
import producto from '../../../../public/images/sinFoto.webp';
import Link from 'next/link';
import userData from '@/app/constants/userData';
import EmptyCart from '../EmptyCart/EmptyCart';
import { CartContext } from '@/components/Context/ShoopingCartContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ShopCart = () => {
  const [cart, setCart] = useContext(CartContext);

  const [consulta, setConsulta] = useState('');
  const [productos, setProductos] = useState([]);
  const preguntarRef = useRef(null);

  const enviar = `https://wa.me/+${userData.codigoPais}${userData.contact}?text=${encodeURIComponent(consulta || userData.textoPredefinido)}`;

  const handleConsulta = () => {
    const preguntar = preguntarRef.current.innerText;
    setConsulta(preguntar);
    setCart([]);
  };

  const handleDelete = (producto) => {
    setCart((currItems)=>{
        if(currItems.find((item)=>item.cod_producto === producto.cod_producto)?.quantity === 1){
            return currItems.filter((item) => item.cod_producto !== producto.cod_producto)
        }else{
            return currItems.map((item)=>{
                if(item.cod_producto === producto.cod_producto){
                    return{...item, quantity: item.quantity -1}
                }else{
                    return item;
                }
            })
        }
    })
    const nuevosProductos = productos;
    setProductos(nuevosProductos);
  };

  const handleDeleteAll = (e) => {
    e.preventDefault();
    try {
        Swal.fire({
            icon:'warning',
            title:"¿Estás seguro de vaciar el carrito?",
            showCancelButton:true,
            showConfirmButton:true,
            confirmButtonText:'ELIMINAR'        
        }).then((result)=>{
            if (result.isConfirmed) {
              setCart([]);
            }
        })
    } catch (error) {
        toast.error(error)
    }
  };

  useEffect(() => {
    if (consulta) {
      window.open(enviar, '_blank');
    }
  }, [consulta]);

  return (
    <section className="flex flex-col justify-start md:justify-center items-center md:items-start mb-6">
      <div
        className="w-full shadow-3xl opacity-90"
        style={{ backgroundImage: "url('/bg/bg-banner.webp')" }}
      >
        <h2
          className="text-3xl sm:text-4xl md:text-5xl text-transparent font-bold m-6 md:my-8 px-4 bg-clip-text bg-gradient-to-br from-boton-primary via-boton-secondary to-boton-primary"
          style={{ textShadow: "2px 2px 8px rgba(0, 0, 255, 0.2)" }}
        >
          CENTRAL CAM
        </h2>
      </div>
      <article className=" flex flex-col max-w-[1200px] m-2 self-center">
        <div className="flex items-end p-4">
          <Link
            href="/"
            className="text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-500 rounded-lg text-sm w-10 h-10 ms-auto inline-flex justify-center items-center"
            title='CARRITO DE CONSULTAS'
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </Link>
        </div>
        <h1 className="md:text-3xl text-xl font-bold text-primary text-center  md:mb-10 mb-6">
          CARRITO DE CONSULTAS
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col">
            {cart.length ? (
              cart.map((item, key) => {
                return (
                  <div
                    key={key}
                    className="relative items-center flex content-center shadow-xl rounded-lg bg-white border border-gray-50 gap-2 m-2"
                  >
                    <img
                      src={item.foto_1_1 ? item.foto_1_1 : producto.src}
                      width={100}
                      height={100}
                      alt={item.nombre}
                      className="bg-transparent m-2 max-h-28 max-w-28 min-h-28 min-w-28"
                      loading="lazy"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        width: "100%",
                        height: "auto",
                      }}
                      title={item.nombre}
                    />
                    <div className="flex text-sm md:text-base flex-col justify-start pt-6 px-2 pb-2">
                      <p>{item.nombre}</p>
                      <p>{item.descripcion}</p>
                      <p>{item.cod_producto}</p>
                      <button
                        className="absolute top-2 right-2 text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-500 rounded-lg text-sm w-6 h-6 ms-auto inline-flex justify-center items-center"
                        onClick={() => handleDelete(item)}
                        aria-label="quitar del carrito"
                      >
                        {" "}
                        <svg
                          className="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyCart />
            )}
            {cart.length ? ( <div className=" py-4 px-2 grid grid-cols-2">
              <button
                onClick={handleDeleteAll}
                className=" inline-flex justify-center items-center h-10 w-full  text-sm font-medium text-center text-white bg-secondary hover:bg-secondary-hover rounded-lg "
                aria-label="vaciar el carrito"
              >
                VACIAR CARRITO
              </button>
              <div></div>
              <Link
                href="/#productos"
                className={`col-span-2 underline my-5 ${cart.length ? "block" : "hidden"}`}
                title='Continuar seleccionando ITEMS'
              >
                Continuar seleccionando ITEMS
              </Link>
            </div>):null}
          </div>
          <div className="">
            <div
              id="resumen"
              className="bg-slate-100 rounded-lg shadow-xl p-7 relative flex flex-col justify-between"
              style={{ alignSelf: "start" }}
            >
              <h2 className="text-2xl mb-2">Resumen de Consulta</h2>
              <div className="grid grid-cols-1  flex-grow">
               
                <span >
                  <strong>Cant. de productos: </strong> {cart.length}
                </span>
                <span>
                  <strong>Usted va a enviar: </strong>
                </span>
                <span id="preguntar" ref={preguntarRef}>
                  Hola, me gustaría consultar precio y disponibilidad de los
                  siguientes artículos:
                  <br />
                  {cart.map((item) => (
                    <span key={item.cod_producto} className="text-right">
                      {item.nombre} - cod: {item.cod_producto} <br />
                    </span>
                  ))}
                </span>
              </div>
              <div className="flex justify-between items-center mt-4"></div>
              <button
                onClick={handleConsulta}
                className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-center text-white bg-boton-primary hover:bg-boton-primary-hover active:bg-boton-primary-active w-full rounded-lg"
                aria-label="contactar por todo el carrito"
              >
                CONTACTAR
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default ShopCart;
