export interface NextPageParams {
  first?: number;
  after?: string;
}

export interface PreviousPageParams {
  last?: number;
  before?: string;
}

export type PageParams = NextPageParams | PreviousPageParams;
