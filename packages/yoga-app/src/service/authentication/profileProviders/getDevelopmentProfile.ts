import { ExternalProfileInformationProvider } from './types';

const { NODE_ENV } = process.env;

export const getDevelopmentProfile: ExternalProfileInformationProvider = ({
  code,
}) =>
  Promise.resolve(
    NODE_ENV === 'production' ? null : { id: code, email: code, name: code }
  );
