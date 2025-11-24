import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class VendaController {
  async listar(req: Request, res: Response) {
    try {
      const vendas = await prisma.venda.findMany({
        include: {
          cliente: true,
          produtos: {
            include: {
              produto: true,
            },
          },
        },
        orderBy: {
          data: 'desc',
        },
      });

      return res.json(vendas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar vendas' });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const venda = await prisma.venda.findUnique({
        where: { id },
        include: {
          cliente: true,
          produtos: {
            include: {
              produto: true,
            },
          },
        },
      });

      if (!venda) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }

      return res.json(venda);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar venda' });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const { clienteId, produtos, data } = req.body;

      // Calcular valor total
      let valorTotal = 0;
      const produtosData = [];

      for (const item of produtos) {
        const produto = await prisma.produto.findUnique({
          where: { id: item.produtoId },
        });

        if (!produto) {
          return res.status(404).json({
            error: `Produto ${item.produtoId} não encontrado`,
          });
        }

        const precoUnit = item.precoUnit || produto.preco;
        valorTotal += precoUnit * item.quantidade;

        produtosData.push({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnit,
        });
      }

      const venda = await prisma.venda.create({
        data: {
          clienteId: clienteId || null,
          data: data ? new Date(data) : new Date(),
          valorTotal,
          produtos: {
            create: produtosData,
          },
        },
        include: {
          cliente: true,
          produtos: {
            include: {
              produto: true,
            },
          },
        },
      });

      return res.status(201).json(venda);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar venda' });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.venda.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar venda' });
    }
  }

  async relatorio(req: Request, res: Response) {
    try {
      const { dataInicio, dataFim } = req.query;

      const where = {
        data: {
          gte: dataInicio ? new Date(dataInicio as string) : undefined,
          lte: dataFim ? new Date(dataFim as string) : undefined,
        },
      };

      const vendas = await prisma.venda.findMany({
        where,
        include: {
          produtos: {
            include: {
              produto: true,
            },
          },
        },
        orderBy: {
          data: 'desc',
        },
      });

      const totalVendas = vendas.reduce(
        (acc, venda) => acc + venda.valorTotal,
        0
      );

      const produtosMaisVendidos = await prisma.vendaProduto.groupBy({
        by: ['produtoId'],
        _sum: {
          quantidade: true,
        },
        orderBy: {
          _sum: {
            quantidade: 'desc',
          },
        },
        take: 10,
      });

      return res.json({
        totalVendas,
        quantidadeVendas: vendas.length,
        vendas,
        produtosMaisVendidos,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao gerar relatório' });
    }
  }
}
