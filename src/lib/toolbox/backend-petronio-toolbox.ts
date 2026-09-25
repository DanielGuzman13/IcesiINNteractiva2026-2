export const backendToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Pedidos y respuestas',
      colour: '210',
      contents: [
        { kind: 'block', type: 'api_endpoint' },
        { kind: 'block', type: 'http_response' }
      ]
    },
    {
      kind: 'category',
      name: 'Despensa',
      colour: '30',
      contents: [
        { kind: 'block', type: 'db_get_stock' },
        { kind: 'block', type: 'db_update_stock' }
      ]
    },
    {
      kind: 'category',
      name: 'Decisiones',
      colour: '120',
      contents: [{ kind: 'block', type: 'controls_if_stock' }]
    }
  ]
};
