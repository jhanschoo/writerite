import styled from 'styled-components';
import { AuxillaryButton } from '../../ui/Button';

const CardAuxillaryButton = styled(AuxillaryButton)`
margin: 0 ${({ theme }) => theme.space[1]};
`;

export default CardAuxillaryButton;
