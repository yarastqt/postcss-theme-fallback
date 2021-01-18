import postcss, { AcceptedPlugin } from 'postcss'

function stripIndents(content: string) {
  return content.replace(/\s+/g, ' ').trim()
}

export function configureRunner(plugins: AcceptedPlugin[]) {
  return (input: string, output: string, warning?: string) => {
    return postcss(plugins)
      .process(input, { from: 'source.css' })
      .then((result) => {
        expect(stripIndents(result.css)).toEqual(stripIndents(output))
        if (warning) {
          expect(result.warnings()).toHaveLength(1)
          expect(result.warnings()[0].text).toEqual(warning)
        } else {
          expect(result.warnings()).toHaveLength(0)
        }
        return result
      })
  }
}
