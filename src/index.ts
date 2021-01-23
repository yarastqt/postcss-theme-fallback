import { Declaration, plugin } from 'postcss'

import { getVariablesFromTheme } from './theme-loader'

export type Variables = Record<string, string>

export interface ThemeFallbackOptions {
  /**
   * Object with theme variables
   */
  variables: Promise<Variables> | Variables
  /**
   * A source path to theme, uses for extract css-variables
   */
  themeSource?: string;
  /**
   * Disable warnings output
   * @default false
   */
  silent?: boolean
}

/**
 * This plugin set fallback values for css-variables from "variables" or "theme".
 *
 * @example
 * require('postcss-theme-fallback')({ variables: variablesObject })
 * require('postcss-theme-fallback')({ themeSource: themeSourcePath })
 */
export default plugin<ThemeFallbackOptions>('postcss-theme-fallback', (options) => {
  if (options?.themeSource !== undefined) {
    options.variables = getVariablesFromTheme(options.themeSource)
  }

  if (options?.variables === undefined) {
    throw new Error('Option "variables" is not set')
  }

  return async (root, result) => {
    const variables = await options.variables

    root.walkDecls((decl) => {
      if (!decl.value.match(VARIABLE_USE_RE)) return
      const declVariables = getDeclarationVariables(decl)

      for (const variable of declVariables) {
        if (variable in variables) {
          decl.value = decl.value.replace(
            VARIABLE_FULL_RE,
            `var(${variable}, ${variables[variable]})`,
          )
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
