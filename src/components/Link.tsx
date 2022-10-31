import React from 'react'
import { Link as LinkMUI, LinkProps as LinkMUIProps } from '@mui/material'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'

export type LinkProps = Omit<LinkMUIProps, 'href' | 'classes'> &
  Pick<NextLinkProps, 'href' | 'as' | 'prefetch'>

export default React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, as, prefetch, ...props },
  ref
) {
  return (
    <NextLink href={href} as={as} prefetch={prefetch} passHref>
      <LinkMUI ref={ref} {...props} />
    </NextLink>
  )
})
