import GithubSlugger from 'github-slugger'
import rehypeSlug from 'rehype-slug'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'

export type Toc = {
  id: string
  title: string
  talks: {
    id: string
    title: string
  }[]
}[]

export function extractToc(md: string): Toc {
  const slugger = new GithubSlugger()
  const toc: Toc = []
  for (const line of md.split('\n')) {
    const m = line.match(/^(##|###) (.+)$/)
    if (!m) continue
    const [, level = '', title = ''] = m
    const id = slugger.slug(title.trim())
    if (level === '##') {
      toc.push({
        id,
        title,
        talks: [],
      })
    } else if (toc.length) {
      toc.at(-1)!.talks.push({
        id,
        title,
      })
    }
  }
  return toc
}

function normalizeObsidian(
  md: string,
  base: string,
  files: Map<string, string>,
) {
  md = convertCallouts(md)
  md = md.replace(/!\[\[([^\]|]+)(?:\|(\d+))?\]\]/g, (_, name, width) => {
    const rel = files.get(name)
    if (!rel) return `<em>missing: ${name}</em>`
    const src = `${base}/${rel}`
    if (name.endsWith('.mp4')) return `<video controls src="${src}"></video>`
    return `<img src="${src}"${width ? ` width="${width}"` : ''} alt="${name}">`
  })
  return md
}

function convertCallouts(md: string) {
  const out: string[] = []
  let open = false
  for (const line of md.split('\n')) {
    const m = line.match(/^> \[!(\w+)\]([+-]?) ?(.*)$/)
    if (m) {
      const [, type = '', fold = '', title = ''] = m
      const attrs = fold === '-' ? '' : ' open'
      out.push(
        `> <details class="callout" data-type="${type}"${attrs}><summary>${title || type}</summary>`,
      )
      open = true
    } else if (open && !line.startsWith('>')) {
      out.push('> </details>', line)
      open = false
    } else {
      out.push(line)
    }
  }
  if (open) {
    out.push('> </details>')
  }
  return out.join('\n')
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
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(normalizeObsidian(md, base, files))
  return {
    html: String(result),
    toc: extractToc(md),
  }
}
