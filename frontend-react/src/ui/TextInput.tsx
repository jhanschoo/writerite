import styled from 'styled-components';

// TODO: make generic argument stricter in props that it accepts
export const TextInput = styled.input`
font-size: 100%;
height: ${({ theme }) => theme.space[4]};
padding: 0 ${({ theme }) => theme.space[2]};
border: 1px solid ${({ theme }) => theme.edge[1]};
${({ theme }) => theme.fgbg[1]}

:hover, :focus {
  outline: none;
}

&.error {
  border-color: ${({ theme }) => theme.color.red};
}

&.valid {
  border-color: ${({ theme }) => theme.color.green};
}
`;

export const MinimalTextInput = styled.input`
font-weight: inherit;
font-size: inherit;
font-family: inherit;
color: inherit;
height: ${({ theme }) => theme.space[4]};
padding: 0 ${({ theme }) => theme.space[2]};
border: none;
background: none;

:focus {
  outline: none;
}
`;

export default TextInput;
