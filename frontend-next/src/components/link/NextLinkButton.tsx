import { forwardRef } from 'react';
import Link, { LinkProps } from 'next/link';
import { Button, ButtonProps } from '@mantine/core';

export interface NextLinkButtonProps
  extends Omit<ButtonProps<'button'>, 'href'>,
    Omit<LinkProps, 'href' | 'as' | 'onClick' | 'onMouseEnter'> {
  to: LinkProps['href'];
  linkAs?: LinkProps['as'];
  href?: LinkProps['href'];
}

export const NextLinkButton = forwardRef<HTMLButtonElement, NextLinkButtonProps>(
  (props, ref) => {
    // href is specified to remove it from ...other
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { to, linkAs, href, replace, scroll, shallow, prefetch, locale, ...other } = props;

    return (
      <Link
        href={to}
        prefetch={prefetch}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref
        locale={locale}
      >
        <Button ref={ref} {...other} />
      </Link>
    );
  },
);
