import { Block, Blocks, FieldDropdown, FieldNumber, Workspace } from 'blockly';

export const INGREDIENTS = ['Jaiba', 'Coco', 'Camarón'] as const;

export type Ingredient = (typeof INGREDIENTS)[number];

export type Inventory = Record<Ingredient, number>;

export const INITIAL_INVENTORY: Inventory = {
  Jaiba: 0,
  Coco: 3,
  Camarón: 5
};

export const API_PATH = '/api/pedidos';

export const BACKEND_BLOCK_TYPES = [
  'api_endpoint',
  'db_get_stock',
  'controls_if_stock',
  'db_update_stock',
  'http_response'
] as const;

const INGREDIENT_OPTIONS: [string, string][] = INGREDIENTS.map((name) => [name, name]);

const METHOD_OPTIONS: [string, string][] = [
  ['por internet (POST)', 'POST'],
  ['por teléfono (GET)', 'GET']
];

const OPERATOR_OPTIONS: [string, string][] = [
  ['por lo menos', '>='],
  ['más de', '>'],
  ['a lo mucho', '<='],
  ['menos de', '<'],
  ['exactamente', '==']
];

const RESPONSE_OPTIONS: [string, string][] = [
  ['¡Todo listo, plato servido!', '201'],
  ['Listo, pedido confirmado', '200'],
  ['Lo sentimos, hoy no hay de eso', '409']
];

const RESPONSE_PHRASE: Record<number, string> = {
  200: 'pedido confirmado',
  201: 'plato servido',
  409: 'hoy no hay de eso'
};

const OPERATOR_WORD: Record<string, string> = {
  '>=': 'por lo menos',
  '>': 'más de',
  '<=': 'a lo mucho',
  '<': 'menos de',
  '==': 'exactamente'
};

const STATUS_LABELS: Record<number, string> = {
  200: '200 OK',
  201: '201 Created',
  409: '409 Conflict'
};

export function statusLabel(status: number): string {
  return STATUS_LABELS[status] ?? `${status}`;
}

export function defineBackendBlocks() {
  Blocks['api_endpoint'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Cuando llega un pedido')
        .appendField(new FieldDropdown(METHOD_OPTIONS), 'METHOD')
        .appendField('a la caseta, atiende el pedido así:');
      this.appendStatementInput('DO').appendField('entonces');
      this.setColour(210);
      this.setTooltip(
        'Punto de inicio: cuando un comensal pide un plato, aquí comienza todo lo que armes.'
      );
      this.setHelpUrl('');
    }
  };

  Blocks['db_get_stock'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('¿cuánto hay de')
        .appendField(new FieldDropdown(INGREDIENT_OPTIONS), 'INGREDIENT')
        .appendField('?');
      this.setOutput(true, 'Number');
      this.setColour(30);
      this.setTooltip('Pregunta cuántas unidades quedan de un ingrediente en la despensa.');
      this.setHelpUrl('');
    }
  };

  Blocks['controls_if_stock'] = {
    init: function () {
      this.appendValueInput('STOCK')
        .setCheck('Number')
        .appendField('Si con');
      this.appendDummyInput()
        .appendField('alcanza para')
        .appendField(new FieldDropdown(OPERATOR_OPTIONS), 'OP')
        .appendField(new FieldNumber(1, 0, 99, 1), 'AMOUNT')
        .appendField('plato(s)');
      this.appendStatementInput('DO').appendField('entonces');
      this.appendStatementInput('ELSE').appendField('si no');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip(
        'Decide qué hacer según lo que quede en la despensa. Conecta aquí un bloque "¿cuánto hay de...?"'
      );
      this.setHelpUrl('');
    }
  };

  Blocks['db_update_stock'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Descontar del almacén')
        .appendField(new FieldNumber(1, 1, 20, 1), 'AMOUNT')
        .appendField('de')
        .appendField(new FieldDropdown(INGREDIENT_OPTIONS), 'INGREDIENT');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(30);
      this.setTooltip('Quita ingredientes de la despensa cuando se prepara el plato.');
      this.setHelpUrl('');
    }
  };

  Blocks['http_response'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Decirle al comensal:')
        .appendField(new FieldDropdown(RESPONSE_OPTIONS), 'STATUS');
      this.setPreviousStatement(true, null);
      this.setColour(0);
      this.setTooltip('La respuesta que recibe la persona que pidió el plato.');
      this.setHelpUrl('');
    }
  };
}

export interface BackendLog {
  tone: 'info' | 'success' | 'error' | 'warn';
  text: string;
}

export interface BackendPlan {
  hasEndpoint: boolean;
  method: string;
  path: string;
  pseudo: string;
  issues: string[];
  hasValidation: boolean;
  updateCount: number;
  responseCount: number;
}

export type RunKind =
  | 'no-endpoint'
  | 'created'
  | 'conflict'
  | 'db-error'
  | 'no-response'
  | 'no-updates'
  | 'error-status';

export interface BackendRunResult {
  kind: RunKind;
  method: string;
  path: string;
  status: number | null;
  inventory: Inventory;
  committed: boolean;
  targetIngredient: string | null;
  logs: BackendLog[];
  tip: string | null;
}

const ARCHITECTURE_TIP =
  'Tip de Arquitectura: Recuerda siempre consultar y validar el inventario antes de descontar o responder al cliente';

function chainToPseudo(start: Block | null, indent: string, lines: string[]) {
  let block: Block | null = start;
  while (block) {
    blockToPseudo(block, indent, lines);
    block = block.getNextBlock();
  }
}

function blockToPseudo(block: Block, indent: string, lines: string[]) {
  switch (block.type) {
    case 'api_endpoint': {
      const method = String(block.getFieldValue('METHOD') || 'POST');
      lines.push(`${indent}Cuando llega un pedido ${method} a la caseta {`);
      chainToPseudo(block.getInputTargetBlock('DO'), `${indent}  `, lines);
      lines.push(`${indent}}`);
      break;
    }
    case 'controls_if_stock': {
      const stockBlock = block.getInputTargetBlock('STOCK');
      const ingredient = stockBlock
        ? String(stockBlock.getFieldValue('INGREDIENT'))
        : '...';
      const op = String(block.getFieldValue('OP'));
      const word = OPERATOR_WORD[op] ?? op;
      const amount = block.getFieldValue('AMOUNT');
      lines.push(`${indent}Si con ${ingredient} alcanza para ${word} ${amount} plato(s) {`);
      chainToPseudo(block.getInputTargetBlock('DO'), `${indent}  `, lines);
      const elseBlock = block.getInputTargetBlock('ELSE');
      if (elseBlock) {
        lines.push(`${indent}} si no {`);
        chainToPseudo(elseBlock, `${indent}  `, lines);
      }
      lines.push(`${indent}}`);
      break;
    }
    case 'db_update_stock': {
      const ingredient = String(block.getFieldValue('INGREDIENT'));
      const amount = block.getFieldValue('AMOUNT');
      lines.push(`${indent}Descontar ${amount} de ${ingredient}`);
      break;
    }
    case 'db_get_stock': {
      const ingredient = String(block.getFieldValue('INGREDIENT'));
      lines.push(`${indent}Consultar cuánto hay de ${ingredient}`);
      break;
    }
    case 'http_response': {
      const status = Number(block.getFieldValue('STATUS'));
      lines.push(
        `${indent}Decirle al comensal: ${RESPONSE_PHRASE[status] ?? 'respuesta enviada'}`
      );
      break;
    }
    default:
      lines.push(`${indent}// bloque no reconocido`);
  }
}

export function buildBackendPlan(workspace: Workspace): BackendPlan {
  const endpoints = workspace.getBlocksByType('api_endpoint', false);
  const allBlocks = workspace.getAllBlocks(false);
  const looseBlocks = allBlocks.filter((block) =>
    (BACKEND_BLOCK_TYPES as readonly string[]).includes(block.type)
  );

  if (endpoints.length === 0) {
    const loose = looseBlocks.length;
    return {
      hasEndpoint: false,
      method: 'POST',
      path: API_PATH,
      pseudo: '// Arrastra el bloque "Cuando llega un pedido" para empezar tu flujo',
      issues: [
        'Falta el punto de inicio: arrastra el bloque "Cuando llega un pedido".',
        ...(loose > 0
          ? [`${loose} bloque(s) están fuera del punto de inicio y no se ejecutarán.`]
          : [])
      ],
      hasValidation: false,
      updateCount: 0,
      responseCount: 0
    };
  }

  const endpoint = endpoints[0];
  const method = String(endpoint.getFieldValue('METHOD') || 'POST');
  const path = API_PATH;

  const lines: string[] = [];
  blockToPseudo(endpoint, '', lines);

  const descendants = endpoint.getDescendants(true);
  const descendantSet = new Set<Block>(descendants);
  const loose = looseBlocks.filter((block) => !descendantSet.has(block));

  const hasValidation = descendants.some((block) => block.type === 'controls_if_stock');
  const updateCount = descendants.filter((block) => block.type === 'db_update_stock').length;
  const responseCount = descendants.filter((block) => block.type === 'http_response').length;
  const bodyEmpty = !endpoint.getInputTargetBlock('DO');
  const missingPlug = descendants.some(
    (block) => block.type === 'controls_if_stock' && !block.getInputTargetBlock('STOCK')
  );

  const issues: string[] = [];
  if (bodyEmpty) {
    issues.push('El flujo está vacío: agrega una condición, un descuento y una respuesta.');
  }
  if (missingPlug) {
    issues.push('Hay una condición sin terminar: conecta un bloque "¿cuánto hay de...?" al hueco.');
  }
  if (updateCount > 0 && !hasValidation) {
    issues.push(
      'Descuentas ingredientes sin preguntar primero cuánto hay: podrías vender sin insumos.'
    );
  }
  if (responseCount === 0 && !bodyEmpty) {
    issues.push('Falta el mensaje final: agrega un bloque "Decirle al comensal".');
  }
  if (loose.length > 0) {
    issues.push(`${loose.length} bloque(s) quedaron fuera del punto de inicio y no se ejecutarán.`);
  }

  return {
    hasEndpoint: true,
    method,
    path,
    pseudo: lines.join('\n'),
    issues,
    hasValidation,
    updateCount,
    responseCount
  };
}

export function runBackendPedido(workspace: Workspace, inventory: Inventory): BackendRunResult {
  const endpoints = workspace.getBlocksByType('api_endpoint', false);

  if (endpoints.length === 0) {
    return {
      kind: 'no-endpoint',
      method: 'POST',
      path: API_PATH,
      status: null,
      inventory,
      committed: false,
      targetIngredient: null,
      logs: [
        {
          tone: 'error',
          text: '[ERROR 404] Aún no hay un "Cuando llega un pedido": arma y despliega tu flujo primero.'
        }
      ],
      tip: ARCHITECTURE_TIP
    };
  }

  const endpoint = endpoints[0];
  const method = String(endpoint.getFieldValue('METHOD') || 'POST');
  const path = API_PATH;

  const logs: BackendLog[] = [
    { tone: 'info', text: `→ ${method} ${path} · recibiendo petición del comensal...` }
  ];

  const working: Inventory = { ...inventory };
  const updates: { ingredient: string; delta: number; before: number; after: number }[] = [];
  let responded: { status: number } | null = null;
  let fatalError = false;
  let targetIngredient: string | null = null;

  const evaluateCondition = (block: Block): boolean => {
    const stockBlock = block.getInputTargetBlock('STOCK');
    if (!stockBlock || stockBlock.type !== 'db_get_stock') {
      logs.push({
        tone: 'warn',
        text: 'Falta saber cuánto hay: conecta el bloque "¿cuánto hay de...?" a la condición.'
      });
      return false;
    }

    const ingredient = String(stockBlock.getFieldValue('INGREDIENT')) as Ingredient;
    const op = String(block.getFieldValue('OP'));
    const amount = Number(block.getFieldValue('AMOUNT'));
    const value = inventory[ingredient] ?? 0;
    targetIngredient = targetIngredient ?? ingredient;

    let result = false;
    switch (op) {
      case '>=':
        result = value >= amount;
        break;
      case '>':
        result = value > amount;
        break;
      case '<=':
        result = value <= amount;
        break;
      case '<':
        result = value < amount;
        break;
      case '==':
        result = value === amount;
        break;
      default:
        result = false;
    }

    logs.push({
      tone: 'info',
      text: `Pregunta: ¿cuánto hay de ${ingredient}? → ${value} ${result ? '· sí alcanza' : '· no alcanza'}`
    });
    return result;
  };

  const execBlock = (block: Block) => {
    switch (block.type) {
      case 'controls_if_stock': {
        const passes = evaluateCondition(block);
        execChain(passes ? block.getInputTargetBlock('DO') : block.getInputTargetBlock('ELSE'));
        break;
      }
      case 'db_update_stock': {
        const ingredient = String(block.getFieldValue('INGREDIENT')) as Ingredient;
        const amount = Number(block.getFieldValue('AMOUNT'));
        targetIngredient = ingredient;
        const before = working[ingredient] ?? 0;
        const after = before - amount;
        if (after < 0) {
          fatalError = true;
          return;
        }
        working[ingredient] = after;
        updates.push({ ingredient, delta: -amount, before, after });
        logs.push({
          tone: 'info',
          text: `Descontar ${amount} de ${ingredient}: quedan ${after}`
        });
        break;
      }
      case 'http_response': {
        responded = { status: Number(block.getFieldValue('STATUS')) };
        break;
      }
      default:
        break;
    }
  };

  function execChain(start: Block | null) {
    let block: Block | null = start;
    while (block && !fatalError && !responded) {
      execBlock(block);
      block = block.getNextBlock();
    }
  }

  execChain(endpoint.getInputTargetBlock('DO'));

  if (fatalError) {
    return {
      kind: 'db-error',
      method,
      path,
      status: null,
      inventory,
      committed: false,
      targetIngredient,
      logs: [
        ...logs,
        {
          tone: 'error',
          text: '[DATABASE ERROR] Integridad violada: Stock negativo no permitido'
        },
        {
          tone: 'warn',
          text: 'ROLLBACK: la transacción se revirtió, el inventario no cambió.'
        }
      ],
      tip: ARCHITECTURE_TIP
    };
  }

  if (!responded) {
    return {
      kind: 'no-response',
      method,
      path,
      status: null,
      inventory,
      committed: false,
      targetIngredient,
      logs: [
        ...logs,
        {
          tone: 'warn',
          text: '[ERROR 504] Nadie respondió al comensal: falta el bloque "Decirle al comensal".'
        }
      ],
      tip: 'Agrega el bloque "Decirle al comensal" al final de tu flujo para responderle al cliente.'
    };
  }

  const { status } = responded;
  const label = statusLabel(status);

  if (status === 409) {
    return {
      kind: 'conflict',
      method,
      path,
      status,
      inventory,
      committed: false,
      targetIngredient,
      logs: [
        ...logs,
        {
          tone: 'error',
          text: `[${method} 409 Conflict] - Pedido rechazado: Stock insuficiente`
        },
        { tone: 'info', text: 'Inventario intacto: no se aplicó ningún descuento.' }
      ],
      tip: null
    };
  }

  if (status >= 200 && status < 300) {
    if (updates.length === 0) {
      return {
        kind: 'no-updates',
        method,
        path,
        status,
        inventory,
        committed: false,
        targetIngredient,
        logs: [
          ...logs,
          { tone: 'warn', text: `[${method} ${label}] - Respuesta enviada sin descontar inventario.` }
        ],
        tip: ARCHITECTURE_TIP
      };
    }

    return {
      kind: 'created',
      method,
      path,
      status,
      inventory: working,
      committed: true,
      targetIngredient,
      logs: [
        ...logs,
        ...updates.map((update) => ({
          tone: 'success' as const,
          text: `DESCUENTO aplicado: ${update.ingredient} ${update.before} → ${update.after}`
        })),
        {
          tone: 'success' as const,
          text: `[${method} ${label}] - Transacción completada con éxito`
        }
      ],
      tip: null
    };
  }

  return {
    kind: 'error-status',
    method,
    path,
    status,
    inventory,
    committed: false,
    targetIngredient,
    logs: [
      ...logs,
      { tone: 'error', text: `[${method} ${label}] - El servidor rechazó la petición.` }
    ],
    tip: null
  };
}
