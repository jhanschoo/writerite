import styled from 'styled-components';

const ViewportContainer = styled.div`
  display: grid;
  height: 100vh;
  min-width: 100vw;
  grid: max-content minmax(1rem, 1fr) / minmax(1rem, auto) repeat(12, minmax(1rem, 96px)) minmax(1rem, auto);
  place-content: start stretch;
  background: ${({ theme }) => theme.colors.bg1};
`;

export default ViewportContainer;
