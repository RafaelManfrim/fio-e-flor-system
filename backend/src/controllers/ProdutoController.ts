import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class ProdutoController {
  async listar(req: Request, res: Response) {
    try {
      const produtos = await prisma.produto.findMany({
        include: {
          materiais: {
            include: {
              material: true,
            },
          },
          insumos: {
            include: {
              insumo: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Converter string de imagens para array
      const produtosFormatados = produtos.map((produto) => ({
        ...produto,
        imagens: JSON.parse(produto.imagens),
      }));

      return res.json(produtosFormatados);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar produtos' });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const produto = await prisma.produto.findUnique({
        where: { id },
        include: {
          materiais: {
            include: {
              material: {
                include: {
                  insumos: {
                    include: {
                      insumo: true,
                    },
                  },
                },
              },
            },
          },
          insumos: {
            include: {
              insumo: true,
            },
          },
        },
      });

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const produtoFormatado = {
        ...produto,
        imagens: JSON.parse(produto.imagens),
      };

      return res.json(produtoFormatado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const { nome, descricao, preco, custo, imagens, materiais, insumos } = req.body;

      const produto = await prisma.produto.create({
        data: {
          nome,
          descricao,
          preco: parseFloat(preco),
          custo: parseFloat(custo),
          imagens: JSON.stringify(imagens || []),
          materiais: {
            create: materiais?.map((m: any) => ({
              materialId: m.materialId,
              quantidade: m.quantidade,
            })),
          },
          insumos: {
            create: insumos?.map((i: any) => ({
              insumoId: i.insumoId,
              quantidade: i.quantidade,
            })),
          },
        },
        include: {
          materiais: true,
          insumos: true,
        },
      });

      const produtoFormatado = {
        ...produto,
        imagens: JSON.parse(produto.imagens),
      };

      return res.status(201).json(produtoFormatado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar produto' });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, descricao, preco, custo, imagens, materiais, insumos } = req.body;

      // Se materiais ou insumos forem fornecidos, deletar os existentes e criar novos
      if (materiais !== undefined) {
        await prisma.produtoMaterial.deleteMany({
          where: { produtoId: id },
        });
      }

      if (insumos !== undefined) {
        await prisma.produtoInsumo.deleteMany({
          where: { produtoId: id },
        });
      }

      const produto = await prisma.produto.update({
        where: { id },
        data: {
          nome,
          descricao,
          preco: preco ? parseFloat(preco) : undefined,
          custo: custo ? parseFloat(custo) : undefined,
          imagens: imagens ? JSON.stringify(imagens) : undefined,
          materiais: materiais ? {
            create: materiais.map((m: any) => ({
              materialId: m.materialId,
              quantidade: m.quantidade,
            })),
          } : undefined,
          insumos: insumos ? {
            create: insumos.map((i: any) => ({
              insumoId: i.insumoId,
              quantidade: i.quantidade,
            })),
          } : undefined,
        },
        include: {
          materiais: {
            include: {
              material: true,
            },
          },
          insumos: {
            include: {
              insumo: true,
            },
          },
        },
      });

      const produtoFormatado = {
        ...produto,
        imagens: JSON.parse(produto.imagens),
      };

      return res.json(produtoFormatado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.produto.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  }
}
