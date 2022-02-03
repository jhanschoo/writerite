import { Button, Divider, SxProps } from "@mui/material";
import { Flex } from "../core/basic/Flex"
import useFacebookSignin from "../core/signin/facebookSignin/useFacebookSignin";
import useGoogleSignin from "../core/signin/googleSignin/useGoogleSignin";

interface Props {
	sx?: SxProps;
}

export const Signin = ({ sx }: Props) => {
	const [, facebookSignin] = useFacebookSignin();
	const [, googleSignin] = useGoogleSignin();
	return (
		<Flex sx={{ flexDirection: "column", alignItems: "stretch", ...sx }}>
			<Button variant="contained" onClick={googleSignin}>
				Sign in with Google
			</Button>
			<Button variant="contained" onClick={facebookSignin}>
				Sign in with Facebook
			</Button>
			<Divider>or</Divider>
			<Button variant="contained">
				Sign in with Username/Email and Password
			</Button>
		</Flex>
	);
};