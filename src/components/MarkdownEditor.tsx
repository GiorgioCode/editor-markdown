import React from 'react';
import { 
  FaBold, FaItalic, FaStrikethrough, FaCode, 
  FaListUl, FaListOl, FaQuoteLeft, FaHeading,
  FaLink, FaImage
} from 'react-icons/fa';

// Definición de las propiedades que espera el componente MarkdownEditor
interface MarkdownEditorProps {
  value: string; // El contenido actual del editor
  onChange: (value: string) => void; // Función para notificar cambios en el contenido
}

// Componente funcional para el editor de Markdown
const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  // Referencia al elemento textarea para manipular directamente el DOM (selección, foco)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  /**
   * Función genérica para aplicar estilos Markdown que envuelven texto (ej: **, *, ~~, `).
   * @param startSymbol Símbolo de inicio (ej: '**')
   * @param endSymbol Símbolo de fin (ej: '**', por defecto igual a startSymbol)
   */
  const applyStyle = (startSymbol: string, endSymbol: string = startSymbol) => {
    const textarea = textareaRef.current;
    if (!textarea) return; // Salir si no hay referencia al textarea

    const start = textarea.selectionStart; // Posición inicial de la selección
    const end = textarea.selectionEnd; // Posición final de la selección
    const selectedText = value.substring(start, end); // Texto seleccionado por el usuario
    
    let newText;
    if (selectedText) {
      // Si hay texto seleccionado, envolverlo con los símbolos
      newText = value.substring(0, start) + startSymbol + selectedText + endSymbol + value.substring(end);
      onChange(newText); // Notificar el cambio al componente padre
      
      // Re-seleccionar el texto recién envuelto (con los símbolos) y enfocar el textarea
      // Usamos setTimeout para asegurar que se ejecute después de la actualización del DOM
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + startSymbol.length, end + startSymbol.length);
      }, 0);
    } else {
      // Si no hay texto seleccionado, insertar los símbolos y colocar el cursor entre ellos
      newText = value.substring(0, start) + startSymbol + endSymbol + value.substring(end);
      onChange(newText);
      
      // Posicionar el cursor entre los símbolos insertados
      const newCursorPos = start + startSymbol.length;
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  // Funciones específicas para cada estilo, usando applyStyle
  const applyBold = () => applyStyle('**');
  const applyItalic = () => applyStyle('*');
  const applyStrikethrough = () => applyStyle('~~');
  const applyCode = () => applyStyle('`');
  const applyCodeBlock = () => applyStyle('```\n', '\n```'); // Bloque de código necesita saltos de línea
  
  /**
   * Aplica o reemplaza un encabezado Markdown (ej: #, ##) al inicio de la línea actual.
   * @param level Nivel del encabezado (1 a 6)
   */
  const applyHeading = (level: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd; // La selección podría abarcar parte de la línea
    
    // Encontrar el inicio de la línea donde está el cursor o la selección
    let lineStart = start;
    while (lineStart > 0 && value[lineStart - 1] !== '\n') {
      lineStart--;
    }
    
    const prefix = '#'.repeat(level) + ' '; // Prefijo del encabezado (ej: "### ")
    // Seleccionar la línea completa hasta el final de la selección original para verificar si ya es encabezado
    const lineEnd = value.indexOf('\n', lineStart) !== -1 ? value.indexOf('\n', lineStart) : value.length;
    const fullLine = value.substring(lineStart, lineEnd); // Línea completa
    const alreadyHeading = /^#{1,6}\s/.test(fullLine); // Comprobar si la línea ya empieza con #, ##, etc.
    
    let newText;
    const textAfterSelection = value.substring(end); // Texto después de la selección original

    if (alreadyHeading) {
      // Si ya es un encabezado, reemplazarlo con el nuevo nivel
      const withoutHeading = fullLine.replace(/^#{1,6}\s/, ''); // Quitar el encabezado existente
      newText = value.substring(0, lineStart) + prefix + withoutHeading + textAfterSelection;
    } else {
      // Si no es un encabezado, añadir el nuevo prefijo
      newText = value.substring(0, lineStart) + prefix + fullLine + textAfterSelection;
    }
    
    onChange(newText); // Notificar el cambio
    
    // Ajustar la posición del cursor al final del contenido modificado
    const newCursorPos = lineStart + prefix.length + (alreadyHeading ? fullLine.replace(/^#{1,6}\s/, '').length : fullLine.length);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  
  /**
   * Aplica formato de lista (ordenada o no ordenada) a las líneas seleccionadas.
   * @param ordered True para lista ordenada (1.), False para no ordenada (-)
   */
  const applyList = (ordered: boolean) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // Dividir el texto seleccionado en líneas
    const lines = selectedText.split('\n');
    // Añadir el prefijo de lista a cada línea no vacía
    const prefixedLines = lines.map((line, index) => {
      if (line.trim() === '') return line; // Mantener líneas vacías
      // Quitar prefijos existentes de lista (-, *, +, 1.) antes de añadir el nuevo
      const cleanedLine = line.replace(/^(\s*[-\*\+]\s+|\s*\d+\.\s+)/, '');
      return ordered ? `${index + 1}. ${cleanedLine}` : `- ${cleanedLine}`;
    });
    
    // Reconstruir el texto y notificar el cambio
    const newText = value.substring(0, start) + prefixedLines.join('\n') + value.substring(end);
    onChange(newText);
    
    // Intentar mantener la selección sobre el texto modificado
    const newEnd = start + prefixedLines.join('\n').length;
     setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, newEnd);
      }, 0);
  };
  
  const applyOrderedList = () => applyList(true);
  const applyUnorderedList = () => applyList(false);
  
  /**
   * Aplica formato de cita (>) a las líneas seleccionadas.
   */
  const applyBlockquote = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // Añadir '> ' al inicio de cada línea no vacía
    const lines = selectedText.split('\n');
    const prefixedLines = lines.map(line => {
      if (line.trim() === '') return line;
      // Evitar añadir '>' si ya existe
      return line.startsWith('> ') ? line : `> ${line}`;
    });
    
    const newText = value.substring(0, start) + prefixedLines.join('\n') + value.substring(end);
    onChange(newText);
    
    // Mantener selección
     const newEnd = start + prefixedLines.join('\n').length;
     setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, newEnd);
      }, 0);
  };
  
  /**
   * Inserta la sintaxis para un enlace Markdown [texto](url).
   */
  const applyLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const linkText = selectedText || 'texto del enlace'; // Usar texto seleccionado o placeholder
    const newText = value.substring(0, start) + `[${linkText}](url)` + value.substring(end);
    onChange(newText);
    
    // Posicionar el cursor en 'url' para que el usuario la reemplace fácilmente
    const urlStart = start + linkText.length + 3; // Posición después de `[texto](`
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(urlStart, urlStart + 3); // Seleccionar 'url'
    }, 0);
  };
  
  /**
   * Inserta la sintaxis para una imagen Markdown ![alt text](url).
   */
  const applyImage = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const altText = selectedText || 'alt text'; // Usar texto seleccionado o placeholder
    const newText = value.substring(0, start) + `![${altText}](url)` + value.substring(end);
    onChange(newText);
    
    // Posicionar el cursor en 'url'
    const urlStart = start + altText.length + 4; // Posición después de `![alt](`
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(urlStart, urlStart + 3); // Seleccionar 'url'
    }, 0);
  };

  // Renderizado del componente
  return (
    <div className="editor-with-toolbar">
      {/* Barra de herramientas con botones para aplicar formatos */}
      <div className="editor-toolbar">
        {/* Botones de encabezado */}
        <button onClick={() => applyHeading(1)} title="Encabezado 1" className="toolbar-button">
          <FaHeading /> 1
        </button>
        <button onClick={() => applyHeading(2)} title="Encabezado 2" className="toolbar-button">
          <FaHeading /> 2
        </button>
        <button onClick={() => applyHeading(3)} title="Encabezado 3" className="toolbar-button">
          <FaHeading /> 3
        </button>
        <span className="toolbar-divider"></span> {/* Separador visual */}
        {/* Botones de estilo de texto */}
        <button onClick={applyBold} title="Negrita" className="toolbar-button">
          <FaBold />
        </button>
        <button onClick={applyItalic} title="Cursiva" className="toolbar-button">
          <FaItalic />
        </button>
        <button onClick={applyStrikethrough} title="Tachado" className="toolbar-button">
          <FaStrikethrough />
        </button>
         <button onClick={applyCode} title="Código en línea" className="toolbar-button">
          <FaCode />
        </button>
        <span className="toolbar-divider"></span>
        {/* Botones de lista */}
        <button onClick={applyUnorderedList} title="Lista no ordenada" className="toolbar-button">
          <FaListUl />
        </button>
        <button onClick={applyOrderedList} title="Lista ordenada" className="toolbar-button">
          <FaListOl />
        </button>
        <button onClick={applyBlockquote} title="Cita" className="toolbar-button">
          <FaQuoteLeft />
        </button>
        <button onClick={applyCodeBlock} title="Bloque de código" className="toolbar-button">
          <FaCode /> Block
        </button>
        <span className="toolbar-divider"></span>
        {/* Botones de inserción */}
         <button onClick={applyLink} title="Insertar enlace" className="toolbar-button">
          <FaLink />
        </button>
         <button onClick={applyImage} title="Insertar imagen" className="toolbar-button">
          <FaImage />
        </button>
      </div>
      {/* El área de texto real donde el usuario escribe */}
      <textarea
        ref={textareaRef} // Asociar la referencia
        value={value} // Mostrar el contenido actual
        onChange={(e) => onChange(e.target.value)} // Notificar cambios al escribir
        className="editor-textarea" // Clase para estilos CSS
        placeholder="Escribe tu Markdown aquí..." // Texto de ayuda
      />
    </div>
  );
};

export default MarkdownEditor;
