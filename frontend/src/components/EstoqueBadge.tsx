const idealQuantityPerCategory = {
  "Haste": {
    baixo: 100,
    medio: 200,
  },
  "Ferro": {
    baixo: 16,
    medio: 30,
  },
  "Embrulho": {
    baixo: 5,
    medio: 15,
  },
  "Outros": {
    baixo: 10,
    medio: 20,
  }
}

const estoqueClasses = {
  baixo: 'bg-red-100 text-red-800',
  medio: 'bg-yellow-100 text-yellow-800',
  alto: 'bg-green-100 text-green-800',
};

function getEstoqueBadgeAttributes(quantidade: number, categoria: keyof typeof idealQuantityPerCategory = 'Outros') {
  if (quantidade < idealQuantityPerCategory[categoria].baixo) {
    return {
      attrs: estoqueClasses.baixo,
      label: 'Estoque Baixo',
    }
  } else if (quantidade < idealQuantityPerCategory[categoria].medio) {
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
  categoria?: keyof typeof idealQuantityPerCategory;
}

export function EstoqueBadge({ quantidade, categoria = 'Outros' }: EstoqueBadgeProps) {
  const { attrs, label } = getEstoqueBadgeAttributes(quantidade, categoria);
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${attrs}`}>
      {label}
    </span>
  )
}