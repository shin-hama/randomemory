import dayjs from 'dayjs'
import { format } from 'prettier'

import { BlockObject, PropertyObject } from '../notion/types'
import * as md from './markdown'

function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

function formatDate(date: string) {
  const formatStr = 'YYYY/MM/DD HH:mm'
  return dayjs(date).format(formatStr)
}

export function renderProperty(content: PropertyObject): Array<string> {
  const stringify = (node: PropertyObject[string]): string | undefined | null => {
    switch (node.type) {
      case 'rich_text':
        return md.plainText(node.rich_text)
      case 'number':
        return node.number?.toString() || ''
      case 'select':
        return node.select?.name || ''
      case 'multi_select':
        return node.multi_select.map((i) => i.name).join(', ')
      case 'status':
        return node.status?.name
      case 'date': {
        if (node.date) {
          const start = formatDate(node.date.start)
          if (node.date.end) {
            return `${start} ~ ${formatDate(node.date.end)}`
          } else {
            return start
          }
        } else {
          return
        }
      }
      case 'formula':
        switch (node.formula.type) {
          case 'boolean':
            return node.formula.boolean?.toString()
          case 'date':
            return node.formula.date ? stringify({ ...node.formula, id: '' }) : ''
          case 'number':
            return node.formula.number?.toString()
          case 'string':
            return node.formula.string
          default:
            throw Error(`Not implemented error: node.formula.type: ${node}`)
        }
      case 'relation':
        return `${node.relation.length} relations`
      case 'rollup':
        switch (node.rollup.type) {
          case 'array':
            return node.rollup.array.map((n) => stringify({ ...n, id: '' })).join(',')
          case 'date':
            return node.rollup.date ? stringify({ ...node.rollup, id: '' }) : ''
          case 'number':
            return node.rollup.number?.toString()
          default:
            return ''
        }
      case 'title':
        console.log(node)
        return md.plainText(node.title)
      case 'people':
        return `${node.people.length} users`
      case 'files':
        return node.files.map((n) => n.name).join(',')
      case 'checkbox':
        return node.checkbox.toString()
      case 'url':
        return `[${node.url}](${node.url})`
      case 'email':
        return node.email
      case 'phone_number':
        return node.phone_number
      case 'created_time':
        return formatDate(node.created_time)
      case 'created_by':
        return node.created_by.id
      case 'last_edited_time':
        return formatDate(node.last_edited_time)
      case 'last_edited_by':
        return node.last_edited_by.id
      default:
        return ''
    }
  }

  return Object.entries(content).map(([key, value]) => `${key}: ${stringify(value) || ''}`)
}

export function renderPage(content: Array<BlockObject>): string {
  const body = content.map((block) => renderBlock(block)).join('')

  return format(body, {
    parser: 'markdown',
    printWidth: 80,
    singleQuote: true,
    trailingComma: 'all',
  })
}

function renderBlock(block: BlockObject): string | null {
  const stringify = (node: BlockObject, contents: string[]): string | null => {
    switch (node.type) {
      case 'heading_1':
        return md.heading(node.heading_1.rich_text, 1)
      case 'heading_2':
        return md.heading(node.heading_2.rich_text, 2)
      case 'heading_3':
        return md.heading(node.heading_3.rich_text, 3)
      case 'paragraph':
        return md.paragraph(node.paragraph.rich_text)
      case 'code':
        return md.codeBlock(node.code.rich_text, node.code.language)
      case 'bulleted_list_item':
        return md.bulletedListItem(node.bulleted_list_item.rich_text, contents)
      case 'numbered_list_item':
        return md.numberedListItem(node.numbered_list_item.rich_text, contents)
      case 'quote':
        return md.quote(node.quote.rich_text)
      case 'divider':
        return md.divider()
      case 'bookmark':
        return md.linkPreview(node.bookmark.url)
      case 'link_preview':
        return md.linkPreview(node.link_preview.url)
      case 'callout': {
        const emojiIcon = node.callout.icon?.type === 'emoji' ? node.callout.icon.emoji : undefined
        return md.callout(node.callout.rich_text, emojiIcon)
      }
      case 'image':
        switch (node.image.type) {
          case 'external':
            return md.image(node.image.external.url, node.image.caption)
          case 'file':
            return md.paragraph(node.image.caption)
        }
        break
      case 'equation':
        return md.equation(node.equation.expression)
      case 'toggle':
        return md.details(node.toggle.rich_text, contents)
      case 'embed':
        return md.embed(node.embed.url)
      case 'video':
        switch (node.video.type) {
          case 'external':
            return md.video(node.video.external.url)
          case 'file':
            return md.paragraph(node.video.caption)
        }
        break
      case 'table':
      case 'table_row':
    }
    return null
  }

  const visit = (node: BlockObject) => {
    const contents: string[] = node.children?.map((child) => visit(child)).filter(isNotNull) ?? []
    return (
      stringify(node, contents) ??
      `<pre hidden data-blocktype="${node.type}">\n${JSON.stringify(node, null, 2)}\n</pre>\n\n`
    )
  }
  return visit(block)
}
