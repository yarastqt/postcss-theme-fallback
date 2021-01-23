import { readFileSync } from 'fs'
import { resolve } from 'path'
import postcss from 'postcss'
import postcssImport from 'postcss-import'

type Variables = Record<string, string>

/**
 * Load theme from source and return object with variables.
 */
export async function getVariablesFromTheme(source: string): Promise<Variables> {
  const resolvedSource = resolve(source)
  const content = readFileSync(resolvedSource, 'utf-8')
  const variables = await getCssVariables({ css: content, from: resolvedSource })

  return variables
}

function getCssVariables({ css, from }: { css: string; from: string }): Promise<Variables> {
  const result: Variables = {}
  const promise = postcss()
    .use(postcssImport() as any)
    .use((root) => {
      root.walkDecls((decl) => {
        result[decl.prop] = decl.value
      })
    })
    .process(css, { from })
    .then(() => result)

  return promise
}
