import { Declaration, plugin } from 'postcss'

export interface ThemeFallbackOptions {
  /**
   * Object with theme variables
   * @default {}
   */
  theme: Record<string, string>
  /**
   * Disable warnings output
   * @default false
   */
  silent?: boolean
}

export default plugin<ThemeFallbackOptions>('postcss-theme-fallback', (options = { theme: {} }) => {
  return async (root, result) => {
    root.walkDecls((decl) => {
      if (!decl.value.match(VARIABLE_USE_RE)) return
      const variables = getDeclarationVariables(decl)

      for (const variable of variables) {
        if (variable in options.theme) {
          decl.value = decl.value.replace(VARIABLE_FULL_RE, `var(${variable}, ${options.theme[variable]})`)
        } else if (!options.silent) {
          decl.warn(result, `[postcss-theme-fallback]: Variable "${variable}" not exists in theme`)
        }
      }
    })
  }
})

const VARIABLE_USE_RE = /var\(\s*(--[^,\s)]+)/g
const VARIABLE_FULL_RE = /var\((--[\w-]+)\)/

function getDeclarationVariables(decl: Declaration): string[] {
  const result = []
  let executed = null
  while ((executed = VARIABLE_USE_RE.exec(decl.value)) !== null) {
    // Avoid infinite loops with zero-width matches.
    if (executed.index === VARIABLE_USE_RE.lastIndex) {
      VARIABLE_USE_RE.lastIndex++
    }
    result.push(executed[1])
  }
  return result
}
