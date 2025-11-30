import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class InsumoController {
  async listar(req: Request, res: Response) {
    try {
      const insumos = await prisma.insumo.findMany({
        orderBy: {
          nome: 'asc',
        },
      });

      return res.json(insumos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar insumos' });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const insumo = await prisma.insumo.findUnique({
        where: { id },
        include: {
          materiais: {
            include: {
              material: true,
            },
          },
        },
      });

      if (!insumo) {
        return res.status(404).json({ error: 'Insumo não encontrado' });
      }

      return res.json(insumo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar insumo' });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const { nome, estoque, unidade, categoria } = req.body;

      const insumo = await prisma.insumo.create({
        data: {
          nome,
          estoque: parseFloat(estoque),
          unidade,
          categoria: categoria || 'Haste',
        },
      });

      return res.status(201).json(insumo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar insumo' });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, estoque, unidade, categoria } = req.body;

      const insumo = await prisma.insumo.update({
        where: { id },
        data: {
          nome,
          estoque: estoque !== undefined ? parseFloat(estoque) : undefined,
          unidade,
          categoria,
        },
      });

      return res.json(insumo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar insumo' });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.insumo.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar insumo' });
    }
  }

  async adicionarEstoque(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantidade, motivo } = req.body;

      if (!quantidade || quantidade <= 0) {
        return res.status(400).json({ error: 'Quantidade inválida' });
      }

      const insumo = await prisma.insumo.findUnique({
        where: { id },
      });

      if (!insumo) {
        return res.status(404).json({ error: 'Insumo não encontrado' });
      }

      const insumoAtualizado = await prisma.insumo.update({
        where: { id },
        data: {
          estoque: insumo.estoque + parseFloat(quantidade),
        },
      });

      return res.json({
        ...insumoAtualizado,
        movimentacao: {
          tipo: 'entrada',
          quantidade: parseFloat(quantidade),
          motivo: motivo || 'Entrada de estoque',
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao adicionar estoque' });
    }
  }

  async removerEstoque(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantidade, motivo } = req.body;

      if (!quantidade || quantidade <= 0) {
        return res.status(400).json({ error: 'Quantidade inválida' });
      }

      const insumo = await prisma.insumo.findUnique({
        where: { id },
      });

      if (!insumo) {
        return res.status(404).json({ error: 'Insumo não encontrado' });
      }

      const qtd = parseFloat(quantidade);
      if (qtd > insumo.estoque) {
        return res.status(400).json({ error: 'Quantidade maior que o estoque disponível' });
      }

      const insumoAtualizado = await prisma.insumo.update({
        where: { id },
        data: {
          estoque: insumo.estoque - qtd,
        },
      });

      return res.json({
        ...insumoAtualizado,
        movimentacao: {
          tipo: 'saida',
          quantidade: qtd,
          motivo: motivo || 'Saída de estoque',
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao remover estoque' });
    }
  }
}
