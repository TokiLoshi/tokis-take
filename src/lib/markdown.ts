import GithubSlugger from 'github-slugger'
import rehypeSlug from 'rehype-slug'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import rehypeExternallinks from 'rehype-external-links'
import { visit } from 'unist-util-visit'
import type { Root } from 'hast'

export type Toc = {
  id: string
  title: string
  talks: {
    id: string
    title: string
  }[]
}[]

function rehypeLazyMedia() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy'
        node.properties.decoding = 'async'
      }
      if (node.tagName === 'video') {
        node.properties.preload = 'metadata'
      }
    })
  }
}

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
  md = wrapTalks(md)
  md = md.replace(/!\[\[([^\]|]+)(?:\|(\d+))?\]\]/g, (_, name) => {
    const rel = files.get(name)
    if (!rel) return `<em>missing: ${name}</em>`
    const src = `${base}/${rel}`
    if (name.endsWith('.mp4')) return `<video controls src="${src}"></video>`
    const url = encodeURI(src)
    return `![${name}](${url})`
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
    .use(rehypeLazyMedia)
    .use(rehypeExternallinks, {
      target: '_blank',
      rel: ['noopener', 'noreferrer'],
    })
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(normalizeObsidian(md, base, files))
  return {
    html: String(result),
    toc: extractToc(md),
  }
}

function wrapTalks(md: string) {
  const slugger = new GithubSlugger()
  const out: string[] = []
  let inTalk = false
  const close = () => {
    if (inTalk) {
      out.push('</details>', '')
      inTalk = false
    }
  }
  for (const line of md.split('\n')) {
    if (line.startsWith('### ')) {
      close()
      const title = line.slice(4).trim()
      const id = slugger.slug(title)
      out.push(
        `<details class="talk" id="${id}">`,
        `<summary>${title}</summary>`,
      )
      inTalk = true
    } else if (line.startsWith('## ')) {
      close()
      slugger.slug(line.slice(3).trim())
      out.push(line)
    } else {
      out.push(line)
    }
  }
  close()
  return out.join('\n')
}
