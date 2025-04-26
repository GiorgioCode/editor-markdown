import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Panel,
  PanelGroup,
  PanelResizeHandle
} from 'react-resizable-panels'
import MarkdownEditor from './components/MarkdownEditor'
import './App.css'

function App() {
  const [markdown, setMarkdown] = useState<string>(`# Markdown Editor

Escribe tu contenido markdown aquí y verás la vista previa en tiempo real.

## Características

- **Negrita**
- *Cursiva*
- ~~Tachado~~
- \`Código\`

\`\`\`javascript
console.log("Hola mundo");
\`\`\`

> Cita de ejemplo

1. Lista numerada
2. Segundo elemento

- Lista con viñetas
- Otro elemento`)

  const [isCopied, setIsCopied] = useState(false); // Estado para el mensaje de copia

  // Función para copiar el contenido al portapapeles
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(markdown).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500); // Resetear después de 1.5 segundos
    }).catch(err => {
      console.error('Error al copiar al portapapeles:', err);
      // Aquí podrías mostrar un mensaje de error al usuario
    });
  }, [markdown]); // Dependencia: markdown

  return (
    <div>
      <div className="container">
        <h1>Editor Markdown (.md) simple</h1>
        
        <div className="editor-container">
          <PanelGroup direction="horizontal">
            {/* Panel que contiene el editor de Markdown */}
            <Panel defaultSize={50} minSize={20}>
              <div className="editor-pane">
                <div className="editor-header">
                  <h2>Editor</h2>
                  {/* Botón para copiar */}
                  <button onClick={handleCopy} className="copy-button">
                    {isCopied ? '¡Copiado!' : 'Copiar Markdown'}
                  </button>
                </div>
                <MarkdownEditor 
                  value={markdown} 
                  onChange={setMarkdown} 
                />
              </div>
            </Panel>
            
            <PanelResizeHandle className="resize-handle" />
            
            {/* Panel que muestra la vista previa del Markdown */}
            <Panel defaultSize={50} minSize={20}>
              <div className="preview-pane">
                <div className="preview-header">
                  <h2>Vista Previa</h2>
                </div>
                <div className="markdown-preview">
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </div>
        {/* Pie de página */}
        <footer className="app-footer">
          <p>
            Desarrollado por <a href="https://jorgepaez.vercel.app/" target="_blank" rel="noopener noreferrer">Jorge Angel Paez</a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
