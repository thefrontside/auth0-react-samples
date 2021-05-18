import cors from "cors";

export const createCors = () =>
  cors({
    origin: (origin, cb) => {
      if (typeof origin === "string") {
        return cb(null, [origin]);
      }

      cb(null, "*");
    },
    credentials: true,
  });
