import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class ClienteController {
  async listar(req: Request, res: Response) {
    try {
      const clientes = await prisma.cliente.findMany({
        orderBy: {
          nome: 'asc',
        },
      });

      return res.json(clientes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar clientes' });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const cliente = await prisma.cliente.findUnique({
        where: { id },
        include: {
          vendas: {
            orderBy: {
              data: 'desc',
            },
          },
        },
      });

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      return res.json(cliente);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const { nome, telefone, endereco } = req.body;

      const cliente = await prisma.cliente.create({
        data: {
          nome,
          telefone,
          endereco,
        },
      });

      return res.status(201).json(cliente);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar cliente' });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, telefone, endereco } = req.body;

      const cliente = await prisma.cliente.update({
        where: { id },
        data: {
          nome,
          telefone,
          endereco,
        },
      });

      return res.json(cliente);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.cliente.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
  }
}
