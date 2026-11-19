/**
 * Entrada de una parte de la página al hacer scroll (la animación vive en globals.css: .reveal).
 * `delay` escalona las partes de una sección (60–90 ms entre cada una, expresado en la misma escala).
 * Es un componente de servidor: no suma JavaScript al navegador.
 */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }) {
  return (
    <Tag className={`reveal ${className}`} style={{ '--d': delay / 10 }}>
      {children}
    </Tag>
  );
}
