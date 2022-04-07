import * as React from 'react';
import NextLink, { LinkProps } from 'next/link';
import { Anchor } from '../../../basic/Anchor';

export interface NextLinkComposedProps
	extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
		Omit<LinkProps, 'href' | 'as'> {
	to: LinkProps['href'];
	linkAs?: LinkProps['as'];
	href?: LinkProps['href'];
}

export const NextLinkComposed = React.forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
	function NextLinkComposed(props, ref) {
		const { to, linkAs, href, replace, scroll, shallow, prefetch, locale, ...other } = props;

		return (
			<NextLink
				href={to}
				prefetch={prefetch}
				as={linkAs}
				replace={replace}
				scroll={scroll}
				shallow={shallow}
				passHref
				locale={locale}
			>
				<Anchor ref={ref} {...other} />
			</NextLink>
		);
	},
);