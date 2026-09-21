import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'

function normalizeObsidian(
  md: string,
  base: string,
  files: Map<string, string>,
) {
  return md.replace(/!\[\[([^\]|]+)(?:\|(\d+))?\]\]/g, (_, name, width) => {
    const rel = files.get(name)
    if (!rel) return `<em>missing: ${name}</em>`
    const src = `${base}/${rel}`
    if (name.endsWith('.mp4')) return `<video controls src="${src}"></video>`
    return `<img src="${src}"${width ? ` width="${width}"` : ''} alt="${name}">
    </img>`
  })
}

export async function renderMarkdown(
  md: string,
  base: string,
  files: Map<string, string>,
) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(normalizeObsidian(md, base, files))
  return String(result)
}
