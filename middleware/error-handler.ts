import { Request, Response, NextFunction } from "express";

const errorHandlerMiddleware = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log(err);
  await res.status(500).json({ msg: "Something went wrong, please try again" });
  return Promise.resolve();
};

export default errorHandlerMiddleware;
