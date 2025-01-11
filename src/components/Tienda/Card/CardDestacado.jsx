import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import IconShoopingCart from '../ShoopingCart/IconShoopingCart';
import userData from '@/app/constants/userData';
import { CartContext } from '@/components/Context/ShoopingCartContext';

const CardDestacado = ({ selectedProduct, handleProductSelect }) => {
  const [cart, setCart] = useContext(CartContext);

  const handleAddToCart = (e, selectedProduct) => {
    e.preventDefault();
    e.stopPropagation();

    // Verificamos si el producto ya existe en el carrito actual
    const isProductInCart = cart.some(item => item.cod_producto === selectedProduct.cod_producto);
    if (isProductInCart) {
      toast.error(`El producto ${selectedProduct.nombre}, cod:${selectedProduct.cod_producto} ya se encuentra en el carrito.`);
      return;
    }
    setCart((currItems) => {
      return [...currItems, { ...selectedProduct, quantity: 1 }];
    });
    toast.success(`Agregando ${selectedProduct.nombre}, cod:${selectedProduct.cod_producto} al carrito.`);
  };

  const icon = {
    ancho: 20,
    alto: 20,
    color: '#ffffff'
  };

  const texto =` Hola, queria consultar por ${selectedProduct.nombre} (${selectedProduct.cod_producto}), `;
  const enviar = `https://wa.me/+${userData.codigoPais}${userData.contact}?text=${encodeURIComponent(texto || userData.textoPredefinido)}`;

  return (
        <li className="relative bg-white border border-gray-200 rounded-lg shadow list-none min-h-48 w-44 md:min-w-60 md:min-h-72 ">
          <div className="flex justify-center relative" onClick={() => handleProductSelect(selectedProduct)}>
              <button onClick={(e) => handleAddToCart(e, selectedProduct)} className="absolute top-1 right-1 inline-flex items-center justify-center w-8 h-8 rounded-full text-white z-10 bg-boton-primary hover:bg-boton-primary-hover active:bg-boton-primary-active" aria-label="agregar al carrito">
                 <IconShoopingCart ancho={icon.ancho} alto={icon.alto} color={icon.color} />
              </button>
              <img src='/images/FotoDestacados.webp' width={80} height={80} className="absolute top-[-15px] left-[-15px] xl:top-[-15px] xl:left-[-15px] xl:w-14 xl:h-14 w-10  inline-flex items-center justify-center z-10" alt='producto destacado' loading='lazy' title='producto destacado' />
              <div className="rounded-lg overflow-hidden p-2 ">
                <img className="rounded-lg p-0 w-full md:w-48 md:h-48 lg:w-52 lg:h-52" src={selectedProduct.foto_1_1 ? selectedProduct.foto_1_1 : '/images/sinFoto.webp'} alt={selectedProduct.nombre} width={150} height={150} title={selectedProduct.nombre} loading="lazy" />
              </div>      
            </div>
            <div className="px-5 pb-2">
            <h2 className="text-xs md:text-sm text-start leading-tight pb-1 font-semibold tracking-tight text-gray-900 capitalize">
              {selectedProduct.titulo_de_producto.length > 26
                ? `${selectedProduct.titulo_de_producto.slice(0, 22)}...`
                : selectedProduct.titulo_de_producto}
            </h2>
              <div className=" flex items-center justify-between gap-2">
                  <p className="text-xs md:text-sm font-bold text-gray-900 ">{selectedProduct.marca}</p>
                  <a href={enviar} className="w-full text-white font-medium rounded-lg text-sm px-3 py-1.5 text-center bg-boton-primary hover:bg-boton-primary-hover active:bg-boton-primary-active" target='_blank' title='Consulta'>Consulta</a>
              </div>
            </div>
        </li>

  );
}

export default CardDestacado;




