import { AddressInfo } from "net";
import type { Server as HTTPServer } from "http";

export type GatewayEnvironment = "proposed" | "staged" | "production";


export interface Server {
  server: HTTPServer;
  address: AddressInfo;
}

export interface ServerOptions {
  url: string;
  onListening?: (url: string) => void;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};
