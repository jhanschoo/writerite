import { Breadcrumbs, Button, Divider, Stack } from "@mui/material";
import router from "next/router";
import { motionThemes } from "../../../lib/core/frameworks/framer-motion/motionThemes";
import { Flex } from "../basic/Flex";
import { useMotionContext } from "../framer-motion/useMotionContext";
import { Link } from "../link/Link";

export interface BreadcrumbsNavProps {
	showBack?: boolean;
	breadcrumbs?: [string, string][];
}

const BreadcrumbsNav = ({ showBack, breadcrumbs }: BreadcrumbsNavProps) => {
	const { setMotionProps } = useMotionContext();
	const handleBack = async (_e: React.MouseEvent<HTMLButtonElement>) => {
		setMotionProps(motionThemes.back);
		router.back();
	}
	const breadcrumbLinks = breadcrumbs && breadcrumbs.length && breadcrumbs.map(([href, name], index) => (
		<Link key={index} underline="hover" href={href}>{name}</Link>
	));
	return (
		<Stack direction="row" alignItems="baseline" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
			{showBack && <Button onClick={handleBack} sx={{ minWidth: 0 }}>Back</Button>}
			{breadcrumbLinks && <Flex padding={1}><Breadcrumbs aria-label="breadcrumb" separator="»">{breadcrumbLinks}</Breadcrumbs></Flex>}
		</Stack>
	);
};

export default BreadcrumbsNav;