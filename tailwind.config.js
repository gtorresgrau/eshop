/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        'xxs': '320px',    // Extra small devices (phones, 480px and up)
        'xs': '375px',    // Small devices (landscape phones, 640px and up)
        'sm': '425px',    // Medium devices (tablets, 768px and up)
        'md': '768px',    // Medium devices (tablets, 768px and up)
        'lg': '1024px',   // Large devices (desktops, 1024px and up)
        'xl': '1280px',   // Extra large devices (large desktops, 1280px and up)
        '2xl': '1536px',  // 2x extra large devices (larger desktops, 1536px and up)
      },
      colors: {
        primary: {
          DEFAULT: '#1a2f98',  // Color de fondo predeterminado
          hover: '#354aad',    // Nuevo color de fondo al pasar el mouse
          active: '#142579',   // Color de fondo al hacer clic
          background: '#F1F4F7', // Color de backgorun
          background2:'#FFFFFF',
          whats:'#22c55e', // Color de whatsapp y contacto
          whatsHover:'#1ca84f' // color de whats hover
        },
        secondary: {
          DEFAULT: '#AD0631',  // Color de fondo predeterminado
          hover: '#9C052B',    // Nuevo color de fondo al pasar el mouse
          active: '#870525',   // Color de fondo al hacer clic
          background:'#14294C' // Color de fondo secundario
        },
        tertiary: {
          DEFAULT: '#C85B6A',  // Color de fondo predeterminado
          hover: '#B2525F',    // Nuevo color de fondo al pasar el mouse
          active: '#9D4954',   // Color de fondo al hacer clic
        },
        boton: {
          primary: {
            DEFAULT: '#1a2f98',  // Color de fondo predeterminado
            hover: '#354aad',    // Nuevo color de fondo al pasar el mouse
            active: '#142579',   // Color de fondo al hacer clic
          },
          secondary: {
            DEFAULT: '#E2E2E2',  // Color de fondo predeterminado
            hover: '#43515E20',    // Color de fondo al pasar el mouse
            active: '#43515E50',   // Color de fondo al hacer clic
          }
        },
        text: {
          primary: {
            DEFAULT: '#43515E',  // Color de fondo predeterminado
            title:'#111827',     // Color para los titulos
            hover: '#E2E2E2',    // Nuevo color de fondo al pasar el mouse
            active: '#1a2f98',   // Color de fondo al hacer clic
          },
          secondary: {
            DEFAULT: '#E2E2E2',  // Color de fondo predeterminado
            hover: '#43515E',    // Color de fondo al pasar el mouse
            active: '#1a2f98',   // Color de fondo al hacer clic
          },
          danger: {
            DEFAULT: '#AD0631',  // Color de fondo predeterminado
            hover: '#E2E2E2',    // Color de fondo al pasar el mouse
            active: '#ffffff',   // Color de fondo al hacer clic
          }
        }
      },
    },
  },
  plugins: [],
}
