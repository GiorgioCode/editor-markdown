# Editor de Markdown con Vista Previa en Tiempo Real

Este proyecto implementa un editor de Markdown con vista previa en tiempo real utilizando React, TypeScript y Vite.

## Características Principales

-   **Editor de Texto:** Un área de texto para escribir y editar contenido en formato Markdown.
-   **Barra de Herramientas (Opcional):** (Aunque no implementada en la versión actual, se mencionó como una posible mejora futura) Una barra de herramientas para aplicar formatos básicos como negrita, cursiva, etc.
-   **Vista Previa en Tiempo Real:** Un panel que muestra el contenido Markdown renderizado como HTML a medida que se escribe.
-   **Soporte para GitHub Flavored Markdown (GFM):** La vista previa utiliza `react-markdown` con el plugin `remark-gfm` para soportar la sintaxis extendida de GFM (tablas, tachado, etc.).
-   **Diseño Responsivo con Paneles Redimensionables:** Se utiliza `react-resizable-panels` para crear dos paneles (editor y vista previa) separados por un divisor que el usuario puede arrastrar para ajustar el tamaño de cada panel.
-   **Estilo Personalizado:** Se aplicaron estilos CSS para lograr una apariencia inspirada en el tema Gruvbox, con un diseño limpio y enfocado.

## Tecnologías Utilizadas

-   **React:** Biblioteca de JavaScript para construir interfaces de usuario.
-   **TypeScript:** Superset de JavaScript que añade tipado estático.
-   **Vite:** Herramienta de construcción rápida para el desarrollo web moderno.
-   **react-markdown:** Componente React para renderizar Markdown como HTML.
-   **remark-gfm:** Plugin para `react-markdown` que añade soporte para GitHub Flavored Markdown.
-   **react-resizable-panels:** Biblioteca para crear layouts con paneles redimensionables.
-   **CSS:** Para estilizar los componentes y la apariencia general.

## Cómo Ejecutar el Proyecto

1.  **Clonar el repositorio (si aplica):**
    ```bash
    git clone <url-del-repositorio>
    cd <nombre-del-directorio>
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    # o
    yarn install
    ```
3.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    # o
    yarn dev
    ```
    Esto abrirá la aplicación en tu navegador, generalmente en `http://localhost:5173`.

## Estructura del Proyecto

```
/proyecto-nuevo
├── public/
├── src/
│   ├── components/
│   │   └── MarkdownEditor.tsx  # Componente del editor
│   ├── App.css                 # Estilos globales y del layout
│   ├── App.tsx                 # Componente principal de la aplicación
│   ├── main.tsx                # Punto de entrada de la aplicación
│   └── vite-env.d.ts           # Definiciones de tipos para Vite
├── index.html                  # Plantilla HTML principal
├── package.json                # Dependencias y scripts del proyecto
├── README.md                   # Este archivo
├── tsconfig.json               # Configuración de TypeScript
├── tsconfig.node.json          # Configuración de TypeScript para Node
└── vite.config.ts              # Configuración de Vite
```

## Funcionamiento del Código

La aplicación se centra en el componente `App.tsx`, que orquesta la interfaz y la lógica principal:

1.  **Estado del Markdown:** Se utiliza el hook `useState` de React para almacenar el contenido actual del editor de Markdown en la variable de estado `markdown`. La función `setMarkdown` se usa para actualizar este estado cada vez que el usuario escribe en el editor.
    ```typescript
    const [markdown, setMarkdown] = useState<string>(/* Contenido inicial */);
    ```

2.  **Layout con Paneles Redimensionables:** El layout principal se construye con `PanelGroup`, `Panel` y `PanelResizeHandle` de la biblioteca `react-resizable-panels`. Esto crea dos paneles verticales (`direction="horizontal"`) que ocupan inicialmente el 50% del espacio (`defaultSize={50}`) y pueden redimensionarse arrastrando el `PanelResizeHandle`. Se establece un tamaño mínimo (`minSize={20}`) para evitar que los paneles colapsen por completo.

3.  **Componente Editor:**
    *   El panel izquierdo contiene el componente `MarkdownEditor` (definido en `src/components/MarkdownEditor.tsx`).
    *   Este componente recibe el valor actual del estado `markdown` como `prop` (`value={markdown}`).
    *   También recibe la función `setMarkdown` como `prop` (`onChange={setMarkdown}`). Internamente, `MarkdownEditor` probablemente usa un elemento `<textarea>` o un editor más avanzado. Cuando el contenido del editor cambia, llama a la función `onChange` (que es `setMarkdown`), actualizando así el estado `markdown` en el componente `App`.

4.  **Componente Vista Previa:**
    *   El panel derecho se encarga de mostrar la vista previa.
    *   Utiliza el componente `ReactMarkdown` de la biblioteca `react-markdown`.
    *   Se le pasa el estado `markdown` como contenido (`children`): `<ReactMarkdown>{markdown}</ReactMarkdown>`.
    *   Se incluye el plugin `remarkGfm` (`remarkPlugins={[remarkGfm]}`) para habilitar el soporte de la sintaxis GitHub Flavored Markdown (tablas, tachado, enlaces automáticos, etc.). `ReactMarkdown` se encarga de convertir el texto Markdown en elementos HTML que se renderizan en el navegador.

5.  **Estilos:** Los estilos definidos en `App.css` se aplican para dar la apariencia deseada (colores, fuentes, espaciado, estilo del divisor, etc.), incluyendo la temática inspirada en Gruvbox.

En resumen, la aplicación mantiene el texto Markdown en un estado de React. Este estado se pasa al editor para su modificación y a la vista previa para su renderización en tiempo real. Los paneles redimensionables proporcionan una interfaz de usuario flexible.