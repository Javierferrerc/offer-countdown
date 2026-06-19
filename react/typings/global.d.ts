import { FunctionComponent } from 'react'

declare global {
  /**
   * Componente de storefront VTEX: un FunctionComponent que además puede
   * exponer `schema` para volverse editable desde el Site Editor.
   */
  interface StorefrontFunctionComponent<P = Record<string, unknown>>
    extends FunctionComponent<P> {
    schema?: Record<string, unknown>
  }
}

// CSS Modules: cada import de .css devuelve un mapa { clase: nombreGenerado }.
declare module '*.css' {
  const content: { readonly [className: string]: string }
  export default content
}
