import { useState, useEffect } from 'react';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { FaUser, FaHome, FaUniversity } from 'react-icons/fa';
import { IoIosArrowDown } from "react-icons/io";
import { GiProgression } from "react-icons/gi";
import logo from '../assets/images/logo.png';
import { useLocation } from 'react-router-dom';
import { supabase } from '../../utils/supabase'; // Asegúrate de que el cliente de Supabase esté correctamente configurado

export default function Navbar() {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleColorMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Obtener el usuario autenticado
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div>
      {/* Navbar Version Desktop */}
      <div className='hidden md:block bg-gray-200 dark:bg-gray-800'>
        <div className='w-11/12 mx-auto flex flex-row justify-between items-center py-5'>
          <div className='flex items-center gap-5'>
            <img src={logo} alt="Logo" width={50} />
            <h3 className='text-xl font-medium'>Portal UNLaM</h3>
          </div>
          <div className='flex items-center gap-10'>
            <div className="flex gap-6">
              <a href="/" className={`flex gap-2 items-center hover:underline ${isActive('/') ? 'text-green-500 font-bold' : 'text-gray-900 dark:text-white'}`}>
                <FaHome size={16} />
                <p className="text-md">Inicio</p>
              </a>
              <a href="/carreras" className={`flex gap-2 items-center hover:underline ${isActive('/carreras') ? 'text-green-500 font-bold' : 'text-gray-900 dark:text-white'}`}>
                <FaUniversity size={16} />
                <p className="text-md">Carreras</p>
              </a>
              <a href="/progreso" className={`flex gap-2 items-center hover:underline ${isActive('/progreso') ? 'text-green-500 font-bold' : 'text-gray-900 dark:text-white'}`}>
                <GiProgression size={16} />
                <p className="text-md">Progreso</p>
              </a>
            </div>

            <div className="flex items-center gap-2">
              {/* Botón con menú desplegable */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-0 focus:ring-gray-100 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  <FaUser />
                  <IoIosArrowDown />
                </button>

                {/* Desplegable */}
                {isDropdownOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-fit bg-white dark:bg-gray-700 rounded-md shadow-lg">
                    <ul className="py-2">
                      {user ? (
                        <>
                          <li>
                            <span className="block px-4 py-2 text-gray-800 dark:text-gray-200">
                              {user.email}
                            </span>
                          </li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="block w-full px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 text-left"
                            >
                              Cerrar sesión
                            </button>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <a
                              href="/inicio-sesion"
                              className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 text-nowrap"
                            >
                              Iniciar Sesión
                            </a>
                          </li>
                          <li>
                            <a
                              href="/registro"
                              className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              Registrarse
                            </a>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Botón para alternar entre modo oscuro y claro */}
              <button
                onClick={toggleColorMode}
                className="flex items-center space-x-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-0 focus:ring-gray-100 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                {isDarkMode ? <IoSunny /> : <IoMoon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar Version Mobile */}
      <div className='fixed w-full bottom-0 md:hidden bg-gray-200 dark:bg-gray-800 z-10'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex w-full items-center justify-between'>
            <div className="flex justify-evenly w-full overflow-scroll">
              <a href="/" className={`flex flex-col gap-1 p-3 items-center hover:underline ${isActive('/') ? 'text-green-700 font-bold border border-green-700 dark:border-green-500 dark:text-green-500 border-t-4 border-r-0 border-l-0 border-b-0' : 'text-gray-900 border-gray-200 border-t-4 border-r-0 border-l-0 border-b-0 dark:border-gray-800 dark:text-white'}`}>
                <FaHome size={20} />
                <p className="text-md">Inicio</p>
              </a>
              <a href="/carreras" className={`flex flex-col gap-1 p-3 items-center hover:underline ${isActive('/carreras') ? 'text-green-700 font-bold border border-green-700 dark:border-green-500 dark:text-green-500 border-t-4 border-r-0 border-l-0 border-b-0' : 'text-gray-900 border-gray-200 border-t-4 border-r-0 border-l-0 border-b-0 dark:border-gray-800 dark:text-white'}`}>
                <FaUniversity size={20} />
                <p className="text-md">Carreras</p>
              </a>
              <a href="/progreso" className={`flex flex-col gap-1 p-3 items-center hover:underline ${isActive('/progreso') ? 'text-green-700 font-bold border border-green-700 dark:border-green-500 dark:text-green-500 border-t-4 border-r-0 border-l-0 border-b-0' : 'text-gray-900 border-gray-200 border-t-4 border-r-0 border-l-0 border-b-0 dark:border-gray-800 dark:text-white'}`}>
                <GiProgression size={20} />
                <p className="text-md">Progreso</p>
              </a>
              <button
                onClick={toggleDropdown}
                className="flex flex-col gap-1 p-3 items-center hover:underline border-gray-200 dark:border-gray-800 border-t-4 border-r-0 border-l-0 border-b-0"
              >
                <FaUser size={20} />
                <p className="text-md">Perfil</p>
                {isDropdownOpen && (
                  <div className={`absolute bottom-full mb-2 ${user ? 'mr-20' : ''} w-fit bg-white dark:bg-gray-800 rounded-md shadow-lg z-10`}>
                    <ul className="py-2">
                      {user ? (
                        <>
                          <li>
                            <span className="block px-4 py-2 text-gray-800 dark:text-gray-200 truncate">
                              {user.email}
                            </span>
                          </li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="block w-full px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                            >
                              Cerrar sesión
                            </button>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <a
                              href="/inicio-sesion"
                              className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Iniciar Sesión
                            </a>
                          </li>
                          <li>
                            <a
                              href="/registro"
                              className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Registrarse
                            </a>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </button>
              <button
                onClick={toggleColorMode}
                className="flex flex-col gap-1 p-3 items-center hover:underline border-gray-200 dark:border-gray-800 border-t-4 border-r-0 border-l-0 border-b-0"
              >
                {isDarkMode ? <IoSunny size={20} /> : <IoMoon size={20} />}
                <p className="text-md">{isDarkMode ? 'Oscuro' : 'Claro'}</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
