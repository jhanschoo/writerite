import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { FC } from "react";

interface CreateDeckDialogProps {
	open: boolean;
}

// TODO: refactor into a non-modal component
export const CreateDeckDialog: FC<CreateDeckDialogProps> = ({ open }) => {
	return (
		<Dialog open={open}>
			<DialogContent>
				Hello World
			</DialogContent>
			<DialogActions>
			</DialogActions>
		</Dialog>
	);
};
