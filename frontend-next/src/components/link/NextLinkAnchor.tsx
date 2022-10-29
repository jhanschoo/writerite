import { forwardRef } from 'react';
import Link, { LinkProps } from 'next/link';
import { Anchor, AnchorProps } from '@mantine/core';

export interface NextLinkAnchorProps
  extends Omit<AnchorProps, 'href'>,
    Omit<LinkProps, 'as' | 'onClick' | 'onMouseEnter'> {
  linkAs?: LinkProps['as'];
  href: LinkProps['href'];
}

export const NextLinkAnchor = forwardRef<HTMLAnchorElement, NextLinkAnchorProps>((props, ref) => {
  const { linkAs, href, replace, scroll, shallow, prefetch, locale, ...other } = props;

  return (
    <Link
      href={href}
      prefetch={prefetch}
      as={linkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref
      locale={locale}
    >
      <Anchor ref={ref} {...other} />
    </Link>
  );
});
