import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class MaterialController {
  async listar(req: Request, res: Response) {
    try {
      const materiais = await prisma.material.findMany({
        include: {
          insumos: {
            include: {
              insumo: true,
            },
          },
        },
        orderBy: {
          nome: 'asc',
        },
      });

      return res.json(materiais);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar materiais' });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const material = await prisma.material.findUnique({
        where: { id },
        include: {
          insumos: {
            include: {
              insumo: true,
            },
          },
          produtos: {
            include: {
              produto: true,
            },
          },
        },
      });

      if (!material) {
        return res.status(404).json({ error: 'Material não encontrado' });
      }

      return res.json(material);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar material' });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const { nome, descricao, insumos } = req.body;

      const material = await prisma.material.create({
        data: {
          nome,
          descricao,
          insumos: {
            create: insumos?.map((i: any) => ({
              insumoId: i.insumoId,
              quantidade: i.quantidade,
            })),
          },
        },
        include: {
          insumos: {
            include: {
              insumo: true,
            },
          },
        },
      });

      return res.status(201).json(material);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar material' });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;

      const material = await prisma.material.update({
        where: { id },
        data: {
          nome,
          descricao,
        },
        include: {
          insumos: {
            include: {
              insumo: true,
            },
          },
        },
      });

      return res.json(material);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar material' });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.material.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar material' });
    }
  }
}
