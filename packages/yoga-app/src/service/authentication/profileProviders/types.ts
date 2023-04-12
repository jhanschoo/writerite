export interface ExternalProfileInformation {
  id: string;
  email?: string;
  name: string;
}

export type ExternalProfileInformationProvider = (params: {
  code: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  redirect_uri: string;
}) => Promise<ExternalProfileInformation | null>;
