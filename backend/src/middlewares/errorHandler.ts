import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Erro:', err);

  return res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message,
  });
};
