import { Router } from 'express';
import { produtoRouter } from './produto.routes';
import { clienteRouter } from './cliente.routes';
import { vendaRouter } from './venda.routes';
import { insumoRouter } from './insumo.routes';
import { materialRouter } from './material.routes';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'API Fio e Flor' });
});

router.use('/produtos', produtoRouter);
router.use('/clientes', clienteRouter);
router.use('/vendas', vendaRouter);
router.use('/insumos', insumoRouter);
router.use('/materiais', materialRouter);

export { router };
