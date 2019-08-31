import styled from 'styled-components';

// https://bugs.chromium.org/p/chromium/issues/detail?id=375693
const Fieldset = styled.div`
border: none;
margin: 0;
padding: 0;
`;

Fieldset.defaultProps = {
  // as: 'fieldset',
  role: 'group',
};

export default Fieldset;
