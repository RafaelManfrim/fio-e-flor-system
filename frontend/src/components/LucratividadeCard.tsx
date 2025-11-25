interface LucratividadeCardProps {
  preco: number;
  custo: number;
}

export function LucratividadeCard({ preco, custo }: LucratividadeCardProps) {
  const margem = custo > 0 ? (((preco - custo) / custo) * 100) : 0;
  
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Margem de Lucro:</span>
        <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
          {margem.toFixed(1)}%
        </span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-blue-700 dark:text-blue-300">Lucro por unidade:</span>
        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
          R$ {(preco - custo).toFixed(2)}
        </span>
      </div>
    </div>
  )
}