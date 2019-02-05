export interface IRwCard {
  id: string;
  front: string;
  back: string;
}

export interface IRedisConfig {
  HOST: string;
  PORT: string;
}

export interface IGraphQLConfig {
  HTTP: string;
  WS: string;
}
