import { Button, Card, CardContent, Stack, SxProps, Typography } from "@mui/material";
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
		<Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', ...sx }}>
			<CardContent>
				<Typography variant="h5" textAlign="center" paddingBottom={2}>
					Sign in with...
				</Typography>
				<Stack direction="row" justifyContent="center" spacing={2}>
					<Button variant="contained" color="inverse" onClick={googleSignin}>
						Google
					</Button>
					<Button variant="contained" color="inverse" onClick={facebookSignin}>
						Facebook
					</Button>
					{
						process.env.NODE_ENV === "development" && (
							<Button variant="contained" color="inverse" onClick={developmentSignin}>
								Dev
							</Button>
						)
					}
				</Stack>
			</CardContent>
		</Card>
	);
};