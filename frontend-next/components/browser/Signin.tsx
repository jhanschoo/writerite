import { Button, Divider, SxProps } from "@mui/material";
import { Flex } from "../core/basic/Flex"

interface Props {
	sx?: SxProps;
}

export const Signin = ({ sx }: Props) => {
	return (
		<Flex sx={{ flexDirection: "column", alignItems: "stretch", ...sx }}>
			<Button variant="contained">
				Sign in with Google
			</Button>
			<Button variant="contained">
				Sign in with Facebook
			</Button>
			<Divider>or</Divider>
			<Button variant="contained">
				Sign in with Username/Email and Password
			</Button>
		</Flex>
	);
};