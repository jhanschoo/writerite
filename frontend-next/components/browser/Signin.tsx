import { Button, Divider, SxProps } from "@mui/material";
import { Flex } from "../core/basic/Flex"
import useFacebookSignin from "../core/signin/facebookSignin/useFacebookSignin";
import useGoogleSignin from "../core/signin/googleSignin/useGoogleSignin";
import useDevelopmentSignin from "../core/signin/developmentSignin/useDevelopmentSignin";

interface Props {
	sx?: SxProps;
}

export const Signin = ({ sx }: Props) => {
	const [, facebookSignin] = useFacebookSignin();
	const [, googleSignin] = useGoogleSignin();
	const [, developmentSignin] = useDevelopmentSignin();
	return (
		<Flex sx={{ flexDirection: "column", alignItems: "stretch", ...sx }}>
			<Button variant="contained" onClick={googleSignin}>
				Sign in with Google
			</Button>
			<Button variant="contained" onClick={facebookSignin}>
				Sign in with Facebook
			</Button>
			{
				process.env.NODE_ENV === "development" && (
					<Button variant="contained" onClick={developmentSignin}>
						development signin
					</Button>
				)
			}
		</Flex>
	);
};