import { NextApiRequest } from "next";
let ip: any;

export default function getIp(req: NextApiRequest): string {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  return ip as string;
}
