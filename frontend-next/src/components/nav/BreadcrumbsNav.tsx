import { Breadcrumbs, Button, Divider, Stack } from "@mui/material";
import router from "next/router";
import { motionThemes } from "@lib/framer-motion/motionThemes";
import { Flex } from "@components/Flex";
import { useMotionContext } from "@hooks/useMotionContext";
import { Link } from "@components/link/Link";

export interface BreadcrumbsNavProps {
	showBack?: boolean;
	breadcrumbs?: [string, string | JSX.Element][];
}

const BreadcrumbsNav = ({ showBack, breadcrumbs }: BreadcrumbsNavProps) => {
	const { setMotionProps } = useMotionContext();
	const handleBack = async () => {
		setMotionProps(motionThemes.back);
		router.back();
	}
	const breadcrumbLinks = breadcrumbs && breadcrumbs.length && breadcrumbs.map(([href, name], index) => (
		<Link key={index} underline="hover" href={href}>{name}</Link>
	));
	return (
		<Stack direction="row" alignItems="baseline" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
			{showBack && <Button onClick={handleBack} sx={{ minWidth: 0 }}>Back</Button>}
			{breadcrumbLinks && <Flex padding={1}><Breadcrumbs aria-label="breadcrumbs" separator="»">{breadcrumbLinks}</Breadcrumbs></Flex>}
		</Stack>
	);
};

export default BreadcrumbsNav;