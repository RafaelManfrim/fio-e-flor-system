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
      const { clienteId, produtos, data, controlarEstoque } = req.body;

      // Calcular valor total
      let valorTotal = 0;
      const produtosData = [];

      for (const item of produtos) {
        const produto = await prisma.produto.findUnique({
          where: { id: item.produtoId },
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

        // Se controle de estoque estiver ativado, decrementar insumos
        if (controlarEstoque) {
          // Decrementar insumos diretos do produto
          for (const produtoInsumo of produto.insumos) {
            const quantidadeTotal =
              produtoInsumo.quantidade * item.quantidade;

            // Verificar se há estoque suficiente
            if (produtoInsumo.insumo.estoque < quantidadeTotal) {
              return res.status(400).json({
                error: `Estoque insuficiente do insumo "${produtoInsumo.insumo.nome}". Disponível: ${produtoInsumo.insumo.estoque} ${produtoInsumo.insumo.unidade}, Necessário: ${quantidadeTotal} ${produtoInsumo.insumo.unidade}`,
              });
            }

            // Decrementar estoque
            await prisma.insumo.update({
              where: { id: produtoInsumo.insumoId },
              data: {
                estoque: {
                  decrement: quantidadeTotal,
                },
              },
            });
          }

          // Decrementar insumos dos materiais do produto
          for (const produtoMaterial of produto.materiais) {
            for (const materialInsumo of produtoMaterial.material.insumos) {
              const quantidadeTotal =
                materialInsumo.quantidade *
                produtoMaterial.quantidade *
                item.quantidade;

              // Verificar se há estoque suficiente
              if (materialInsumo.insumo.estoque < quantidadeTotal) {
                return res.status(400).json({
                  error: `Estoque insuficiente do insumo "${materialInsumo.insumo.nome}" (do material "${produtoMaterial.material.nome}"). Disponível: ${materialInsumo.insumo.estoque} ${materialInsumo.insumo.unidade}, Necessário: ${quantidadeTotal} ${materialInsumo.insumo.unidade}`,
                });
              }

              // Decrementar estoque
              await prisma.insumo.update({
                where: { id: materialInsumo.insumoId },
                data: {
                  estoque: {
                    decrement: quantidadeTotal,
                  },
                },
              });
            }
          }
        }
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

  async estatisticas(req: Request, res: Response) {
    try {
      // Data do início do mês atual
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      // Total de vendas do mês
      const vendasMes = await prisma.venda.findMany({
        where: {
          data: {
            gte: inicioMes,
          },
        },
      });

      const totalVendasMes = vendasMes.reduce(
        (acc, venda) => acc + venda.valorTotal,
        0
      );

      // Total de produtos cadastrados
      const totalProdutos = await prisma.produto.count();

      // Total de clientes
      const totalClientes = await prisma.cliente.count();

      // Vendas recentes (últimas 5)
      const vendasRecentes = await prisma.venda.findMany({
        take: 5,
        orderBy: {
          data: 'desc',
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

      // Produtos mais vendidos (top 5)
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
        take: 5,
      });

      // Buscar detalhes dos produtos mais vendidos
      const produtosDetalhes = await Promise.all(
        produtosMaisVendidos.map(async (item) => {
          const produto = await prisma.produto.findUnique({
            where: { id: item.produtoId },
          });
          return {
            produto,
            quantidade: item._sum.quantidade,
          };
        })
      );

      return res.json({
        totalVendasMes,
        totalProdutos,
        totalClientes,
        vendasRecentes,
        produtosMaisVendidos: produtosDetalhes,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  }
}
