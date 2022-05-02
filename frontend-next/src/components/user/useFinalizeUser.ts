import { useState } from 'react';
import { useMutation } from 'urql';
import { UserEditDocument } from '@generated/graphql';

export function useFinalizeUser(handleSuccessfulNameChange: () => void) {
	const [, updateUserName] = useMutation(UserEditDocument);
	const [name, setName] = useState('');
	const finalize = async () => {
		const result = await updateUserName({ name });
		if (result.data?.userEdit.name === name) {
			handleSuccessfulNameChange();
		}
	}
	return [name, setName, finalize] as const;
}
