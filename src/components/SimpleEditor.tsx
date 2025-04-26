import React from 'react';

// Definición de las propiedades que espera el componente SimpleEditor
interface SimpleEditorProps {
  value: string; // El contenido actual del editor
  onChange: (value: string) => void; // Función para notificar cambios en el contenido
}

// Componente funcional para un editor de texto simple (textarea básico)
const SimpleEditor: React.FC<SimpleEditorProps> = ({ value, onChange }) => {
  // Renderiza un elemento textarea estándar
  return (
    <textarea
      className="editor-textarea" // Clase CSS para aplicar estilos (definida en App.css)
      value={value} // El valor mostrado en el textarea es el que se recibe por props
      onChange={(e) => onChange(e.target.value)} // Cuando el contenido cambia, llama a la función onChange pasada por props
      placeholder="Escribe tu markdown aquí..." // Texto de ayuda visible cuando el textarea está vacío
    />
  );
};

export default SimpleEditor; // Exporta el componente para ser usado en otros lugares
