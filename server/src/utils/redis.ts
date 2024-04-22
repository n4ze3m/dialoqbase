// copied from https://github.com/glani/parse-redis-url-simple/blob/master/src/index.ts
import { parse } from "url";

const redisDefaultPort = 6379;
const sentinelDefaultPort = 26379;

export interface IRedisUrl {
  database?: string;
  host: string;
  password?: string;
  port: number;
}

const predefinedSeparatorRegexp = /,|;|\s/;

function preparePassword(auth: string | null, encoding?: BufferEncoding) {
  if (!auth) {
    return undefined;
  }

  const vv = (encoding ? Buffer.from(auth, encoding).toString() : auth).split(
    ":"
  );
  return vv.length > 1 ? vv[1] : vv[0];
}

function prepareResult(
  v: string,
  sentinel: boolean,
  encoding?: BufferEncoding
): IRedisUrl {
  if (v.search("://") === -1) {
    v = "redis://" + v;
  }
  const urlWithStringQuery = parse(v);

  return {
    database: sentinel
      ? undefined
      : (urlWithStringQuery.pathname || "/0").substr(1) || "0",
    host: urlWithStringQuery.hostname || "localhost",
    password: sentinel
      ? undefined
      : preparePassword(urlWithStringQuery.auth, encoding),
    port: Number(
      urlWithStringQuery.port ||
        (sentinel ? sentinelDefaultPort : redisDefaultPort)
    ),
  };
}

export function parseRedisUrl(
  value?: string,
  sentinel: boolean = false,
  separatorRegexp: RegExp = predefinedSeparatorRegexp,
  encoding?: BufferEncoding
): IRedisUrl | undefined {
  if (!value) {
    return {
      database: sentinel ? undefined : "0",
      host: "localhost",
      port: sentinel ? sentinelDefaultPort : redisDefaultPort,
    };
  }

  const result = new Array<IRedisUrl>();
  const urlValues = value
    .split(separatorRegexp)
    .map((value1) => value1.trim())
    .filter((value1) => value1 && value1.length);

  for (const urlValue of urlValues) {
    const parsedResult = prepareResult(urlValue, sentinel, encoding);
    result.push(parsedResult);
  }

  return result.length > 0 ? result[0] : undefined;
}
