const estoqueClasses = {
  baixo: 'bg-red-100 text-red-800',
  medio: 'bg-yellow-100 text-yellow-800',
  alto: 'bg-green-100 text-green-800',
};

function getEstoqueBadgeAttributes(quantidade: number) {
  if (quantidade < 100) {
    return {
      attrs: estoqueClasses.baixo,
      label: 'Estoque Baixo',
    }
  } else if (quantidade < 200) {
    return {
      attrs: estoqueClasses.medio,
      label: 'Atenção',
    }
  } else {
    return {
      attrs: estoqueClasses.alto,
      label: 'Normal',
    }
  }
}

interface EstoqueBadgeProps {
  quantidade: number;
}

export function EstoqueBadge({ quantidade }: EstoqueBadgeProps) {
  const { attrs, label } = getEstoqueBadgeAttributes(quantidade);

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${attrs}`}>
      {label}
    </span>
  )
}