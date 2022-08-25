import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

interface USERAUTH {
  id: string;
  role: Role;
  iat: number;
  exp: number;
}

const AUTH = (
  req: NextApiRequest,
  res: NextApiResponse,
  roles?: Role[]
): Promise<USERAUTH> =>
  new Promise((res, rej) => {
    const { headers } = req;

    const Authorization = headers.authorization || headers.Authorization;

    if (!Authorization) {
      return rej({ status: 401, message: "Não altorizado." });
    }

    const [_, token] = (Authorization as string).split(" ");

    if (!token) {
      return rej({ status: 401, message: "Não altorizado." });
    }

    jwt.verify(token, process.env.JWT!, (err, decoded) => {
      if (err) {
        return rej({ status: 401, message: "Não altorizado." });
      } else {
        if (roles) {
          if (!roles.includes((decoded as USERAUTH).role)) {
            return rej({ status: 401, message: "Não altorizado." });
          }
        }
        return res(decoded as USERAUTH);
      }
    });
  });

export { AUTH };
