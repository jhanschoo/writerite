import styled from 'styled-components';

const Main = styled.main`
grid-area: 2 / 5 / 3 / 14;
align-items: stretch;
overflow-y: auto;

padding: 0 ${({ theme }) => theme.space[3]};
display: flex;
flex-direction: column;

@media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
  grid-area: 2 / 2 / 3 / 14;
}
`;

export default Main;
