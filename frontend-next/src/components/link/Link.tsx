import * as React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { LinkProps as NextLinkProps } from 'next/link';
import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { Anchor } from '@components/Anchor';
import { NextLinkComposed, NextLinkComposedProps } from './adapters/NextLinkComposed';

export type LinkProps = {
	activeClassName?: string;
	as?: NextLinkProps['as'];
	href: NextLinkProps['href'];
	linkAs?: NextLinkProps['as']; // Useful when the as prop is shallow by styled().
	noLinkStyle?: boolean;
} & Omit<NextLinkComposedProps, 'to' | 'linkAs' | 'href'> &
	Omit<MuiLinkProps, 'href'>;

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/api-reference/next/link
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
	const {
		activeClassName = 'active',
		as: linkAs,
		className: classNameProps,
		href,
		noLinkStyle,
		...other
	} = props;

	const router = useRouter();
	const pathname = typeof href === 'string' ? href : href.pathname;
	const className = clsx(classNameProps, {
		[activeClassName]: router.pathname === pathname && activeClassName,
	});

	const isExternal =
		typeof href === 'string' && (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0);

	if (isExternal) {
		if (noLinkStyle) {
			return <Anchor className={className} href={href} ref={ref} {...other} />;
		}

		return <MuiLink className={className} href={href} ref={ref} {...other} />;
	}

	if (noLinkStyle) {
		return <NextLinkComposed className={className} ref={ref} to={href} {...other} />;
	}

	return (
		<MuiLink
			component={NextLinkComposed}
			linkAs={linkAs}
			className={className}
			ref={ref}
			to={href}
			{...other}
		/>
	);
});
