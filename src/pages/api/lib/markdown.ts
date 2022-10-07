import { RichTextItem } from '../notion/types'

type RichText = Array<RichTextItem>

export const heading = (text: RichText, level: 1 | 2 | 3) =>
  `${'#'.repeat(level)} ${decorateText(text)}\n\n`
export const paragraph = (text: RichText) => `\n${decorateText(text)}\n\n`

export const codeBlock = (text: RichText, language?: string) => {
  const delimiter = '```'
  return `${delimiter}${language ?? ''}\n${plainText(text)}\n${delimiter}\n\n`
}

export const bulletedListItem = (text: RichText, contents: string[]) => {
  return `- ${decorateText(text)}\n${contents.map(indent).join('')}`
}

export const numberedListItem = (text: RichText, contents: string[]) => {
  return `1. ${decorateText(text)}\n${contents.map(indent).join('')}`
}

export const quote = (text: RichText) => `> ${decorateText(text)}\n\n`

export const divider = () => '---\n\n'

export const linkPreview = (url: string) => `{{< embed "${url}" >}}\n\n`

export const callout = (text: RichText, emojiIcon?: string) => {
  if (emojiIcon) {
    return `{{< callout "${emojiIcon}">}}\n${decorateText(text)}\n{{< /callout >}}\n\n`
  } else {
    return `{{< callout >}}\n${decorateText(text)}\n{{< /callout >}}\n\n`
  }
}

export const image = (url: string, caption: RichText) => {
  return `{{< figure src="${url}" caption="${decorateText(caption)}" >}}\n\n`
}

export const equation = (expression: string) => {
  return `$$\n${expression}\n$$\n\n`
}

export const details = (summary: RichText, contents: string[]) => {
  return `{{<details "${plainText(summary)}">}}\n\n${contents.join('')}\n\n{{< /details >}}\n\n`
}

export const embed = (url: string) => {
  const parsedUrl = new URL(url)
  // Stackblitz
  if (parsedUrl.host === 'stackblitz.com' && parsedUrl.searchParams.get('embed') === '1') {
    return `{{< stackblitz "${url}" >}}\n\n`
  }
  // Twitter status
  if (parsedUrl.host === 'twitter.com' && parsedUrl.pathname.includes('/status/')) {
    const statusId = parsedUrl.pathname.split('/')[3]
    return `{{< tweet "${statusId}" >}}\n\n`
  }
  return null
}

export const video = (url: string) => {
  const parsedUrl = new URL(url)
  // YouTube
  if (parsedUrl.host === 'www.youtube.com' && parsedUrl.searchParams.has('v')) {
    return `{{< youtube "${parsedUrl.searchParams.get('v')}" >}}\n\n`
  }
  return null
}

function indent(text: string): string {
  return `\t${text}`
}

function decorateText(text: RichText): string {
  const renderNode = (node: RichTextItem): string => {
    const { type, plain_text: plainText, href, annotations } = node
    if (type === 'mention') {
      // mention is only available in Notion
      return ''
    }
    if (type === 'equation') {
      return `$${plainText}$`
    }
    if (annotations.code) {
      return `\`${plainText}\``
    }
    if (annotations.bold) {
      return renderNode({
        ...node,
        plain_text: `**${plainText}**`,
        annotations: { ...annotations, bold: false },
      })
    }
    if (annotations.italic) {
      return renderNode({
        ...node,
        plain_text: plainText.startsWith('*') ? `_${plainText}_` : `*${plainText}*`,
        annotations: { ...annotations, italic: false },
      })
    }
    if (annotations.strikethrough) {
      return renderNode({
        ...node,
        plain_text: `~~${plainText}~~`,
        annotations: { ...annotations, strikethrough: false },
      })
    }
    if (annotations.underline) {
      return renderNode({
        ...node,
        plain_text: `__${plainText}__`,
        annotations: { ...annotations, underline: false },
      })
    }
    if (href) {
      return renderNode({ ...node, plain_text: `[${plainText}](${href})`, href: null })
    }
    if (plainText.includes('\n')) {
      return plainText.replace(/\n/g, '  \n')
    }
    return plainText
  }

  return text.map(renderNode).join('')
}

export function plainText(text: RichText): string {
  return text.map((node) => node.plain_text).join('')
}
