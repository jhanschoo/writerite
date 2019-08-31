import styled from 'styled-components';

export const Button = styled.button`
display: flex;
justify-content: center;
align-items: center;
border: 1px solid ${({ theme }) => theme.edge[1]};
margin: 0;
padding: 0;
font-weight: bold;
font-size: inherit;
font-family: inherit;
outline: none;
cursor: pointer;
${({ theme }) => theme.fgbg[1]}

&.active, :hover {
  ${({ theme }) => theme.bgfg[1]}
}
`;

export const BorderlessButton = styled.button`
display: flex;
justify-content: center;
align-items: center;
background: none;
border: none;
margin: 0;
padding: 0;
font-weight: bold;
font-size: inherit;
font-family: inherit;
outline: none;
cursor: pointer;
color: inherit;

&.active, :hover {
  ${({ theme }) => theme.bgfg[2]}
}
`;

export const AnchorButton = styled.button`
display: inline;
background: none;
border: none;
margin: 0;
padding: 0;
font-weight: inherit;
font-size: inherit;
font-family: inherit;
outline: none;
text-decoration: underline;
color: inherit;

:hover {
  cursor: pointer;
}
`;

export const AuxillaryButton = styled.button`
display: flex;
justify-content: center;
align-items: center;
background: none;
border: none;
margin: 0;
padding: 0;
font-weight: inherit;
font-size: inherit;
font-family: inherit;
outline: none;
color: ${({ theme }) => theme.color.fg2};

:hover {
  cursor: pointer;
  color: ${({ theme }) => theme.color.fg1};
}
`;

export const MinimalButton = styled.button`
display: flex;
justify-content: center;
align-items: center;
background: none;
border: none;
margin: 0;
padding: 0;
font-weight: bold;
font-size: inherit;
font-family: inherit;
outline: none;
color: inherit;

:hover {
  cursor: pointer;
}

:disabled {
  visibility: hidden;
}
`;

export default Button;
