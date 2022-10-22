import * as React from 'react'
import NextHead from 'next/head'

export type HeadProps = {
  title: string
  description?: string
}
const Head: React.FC<HeadProps> = ({ title, description }) => {
  return (
    <NextHead>
      <title>{title}</title>
      <meta property="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </NextHead>
  )
}

export default Head
