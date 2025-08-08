//src/componentes/NavBar/UserMenu.jsx
import React from 'react'
import { FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const UserMenu = ({ user, isAdmin, toggleDropdown, isDropdownOpen, handleLogOut }) => {
  const router = useRouter();

  const goToPanel = () => {
    if (isAdmin) {
      router.push('/Admin');
    } else {
      router.push('/Dashboard?perfil=perfil');
    }
    toggleDropdown();
  };

  return (
    <div className="relative z-50">
      <button
        className="inline-flex items-center w-8 h-8 justify-center text-xl font-bold text-gray-900"
        onClick={toggleDropdown}
        title="Menú usuario"
        aria-label="menu usuario"
      >
        {user.photoURL ? (
                            <Image 
                                src={user.photoURL} 
                                alt={user.displayName} 
                                className="rounded-full w-8 h-8" 
                                width={32} 
                                height={32} 
                                title={user.displayName} 
                                loading='lazy'
                            />
        ) : (
          <FaUser />
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
          <button
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            onClick={goToPanel}
            aria-label="panel usuario"
          >
            {isAdmin ? 'Administrador' : 'Mi cuenta'}
          </button>
          <button
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            onClick={handleLogOut}
            aria-label="cerrar sesión"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
