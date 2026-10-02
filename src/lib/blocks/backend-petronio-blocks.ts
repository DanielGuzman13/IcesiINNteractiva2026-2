import { Block, Blocks, FieldDropdown, FieldNumber, Workspace } from 'blockly';

export const INGREDIENTS = ['Jaiba', 'Coco', 'Camarón'] as const;

export type Ingredient = (typeof INGREDIENTS)[number];

export type Inventory = Record<Ingredient, number>;

export const INITIAL_INVENTORY: Inventory = {
  Jaiba: 0,
  Coco: 3,
  Camarón: 5
};

export const BACKEND_BLOCK_TYPES = [
  'api_endpoint',
  'db_get_stock',
  'controls_if_stock',
  'db_update_stock',
  'http_response'
] as const;

const INGREDIENT_OPTIONS: [string, string][] = INGREDIENTS.map((name) => [name, name]);

const OPERATOR_OPTIONS: [string, string][] = [
  ['por lo menos', '>='],
  ['más de', '>'],
  ['menos de', '<'],
  ['exactamente', '==']
];

const RESPONSE_OPTIONS: [string, string][] = [
  ['¡Todo listo, plato servido!', '201'],
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

export function defineBackendBlocks() {
  Blocks['api_endpoint'] = {
    init: function () {
      this.appendDummyInput().appendField('Cuando llega un pedido a la caseta');
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
        .appendField('Consultar cuánt@')
        .appendField(new FieldDropdown(INGREDIENT_OPTIONS), 'INGREDIENT')
        .appendField('quedan en la despensa');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(30);
      this.setTooltip('Consulta cuántas unidades quedan del ingrediente en la despensa.');
      this.setHelpUrl('');
    }
  };

  Blocks['controls_if_stock'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Si todavía hay')
        .appendField(new FieldDropdown(INGREDIENT_OPTIONS), 'INGREDIENT')
        .appendField('para')
        .appendField(new FieldDropdown(OPERATOR_OPTIONS), 'OP')
        .appendField(new FieldNumber(1, 0, 99, 1), 'AMOUNT')
        .appendField('plato(s)');
      this.appendStatementInput('DO').appendField('entonces');
      this.appendStatementInput('ELSE').appendField('si no');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip(
        'Decide qué hacer según lo que quede del ingrediente en la despensa.'
      );
      this.setHelpUrl('');
    }
  };

  Blocks['db_update_stock'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Quitar de la despensa')
        .appendField(new FieldNumber(1, 1, 20, 1), 'AMOUNT')
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
  pseudo: string;
  issues: string[];
  hasValidation: boolean;
  updateCount: number;
  responseCount: number;
}

export type RunKind =
  | 'no-endpoint'
  | 'invalid'
  | 'created'
  | 'conflict'
  | 'db-error'
  | 'no-response'
  | 'no-updates';

export interface BackendRunResult {
  kind: RunKind;
  inventory: Inventory;
  committed: boolean;
  targetIngredient: string | null;
  logs: BackendLog[];
  tip: string | null;
}

const ARCHITECTURE_TIP =
  'Consejo: consulta cuánto hay en la despensa antes de descontar o de responderle al comensal.';

function chainToPseudo(start: Block | null, indent: string, lines: string[]) {
  let block: Block | null = start;
  while (block) {
    blockToPseudo(block, indent, lines);
    block = block.getNextBlock();
  }
}

function collectChain(start: Block | null): Block[] {
  const blocks: Block[] = [];
  let block: Block | null = start;
  while (block) {
    blocks.push(block);
    block = block.getNextBlock();
  }
  return blocks;
}

export function validateBackendSemantics(workspace: Workspace): {
  valid: boolean;
  errors: string[];
} {
  const endpoints = workspace.getBlocksByType('api_endpoint', false);
  const errors: string[] = [];

  if (endpoints.length === 0) {
    return {
      valid: false,
      errors: ['Debes comenzar tu flujo con el bloque "Cuando llega un pedido a la caseta".']
    };
  }

  const endpoint = endpoints[0];
  const descendants = endpoint.getDescendants(true);
  const conditional = descendants.find((block) => block.type === 'controls_if_stock');

  if (!conditional) {
    errors.push(
      'Falta la condición "Si todavía hay...": debes validar el inventario antes de servir el plato.'
    );
    return { valid: false, errors };
  }

  const ingredient = String(conditional.getFieldValue('INGREDIENT'));
  const op = String(conditional.getFieldValue('OP'));
  const amount = Number(conditional.getFieldValue('AMOUNT'));

  if (op === '<') {
    errors.push(
      'Error lógico: No puedes servir el plato si quedan MENOS ingredientes de los necesarios.'
    );
  } else if (op !== '>=' && op !== '>') {
    errors.push('El operador de la condición debe ser "por lo menos" (>=) o "más de" (>).');
  }

  const thenChain = collectChain(conditional.getInputTargetBlock('DO'));
  const elseChain = collectChain(conditional.getInputTargetBlock('ELSE'));

  const thenUpdates = thenChain.filter((block) => block.type === 'db_update_stock');
  const elseUpdates = elseChain.filter((block) => block.type === 'db_update_stock');
  const thenLast = thenChain[thenChain.length - 1];
  const elseLast = elseChain[elseChain.length - 1];

  if (thenUpdates.length === 0) {
    errors.push(
      'En la rama "entonces" debe ir el bloque "Quitar de la despensa" para descontar el ingrediente.'
    );
  } else if (thenUpdates.length > 1) {
    errors.push('El ingrediente de la condición solo debe descontarse una vez en la rama "entonces".');
  } else {
    const update = thenUpdates[0];
    const updateIngredient = String(update.getFieldValue('INGREDIENT'));
    const updateAmount = Number(update.getFieldValue('AMOUNT'));
    if (updateIngredient !== ingredient) {
      errors.push(
        `Validaste ${ingredient} pero descontaste ${updateIngredient}: deben ser el mismo ingrediente.`
      );
    }
    if (updateAmount !== amount) {
      errors.push(
        `Validaste ${amount} plato(s) de ${ingredient} pero descontaste ${updateAmount}: deben coincidir.`
      );
    }
  }

  const thenHasRejection = thenChain.some(
    (block) => block.type === 'http_response' && Number(block.getFieldValue('STATUS')) === 409
  );
  if (thenHasRejection) {
    errors.push('En la rama "entonces" no se puede enviar un mensaje de rechazo: ahí se sirve el plato.');
  }

  if (!thenLast || !(thenLast.type === 'http_response' && Number(thenLast.getFieldValue('STATUS')) === 201)) {
    errors.push('La rama "entonces" debe terminar con el mensaje "¡Todo listo, plato servido!".');
  }

  if (elseUpdates.length > 0) {
    errors.push('En la rama "si no" nunca se debe descontar inventario.');
  }

  if (!elseLast || !(elseLast.type === 'http_response' && Number(elseLast.getFieldValue('STATUS')) === 409)) {
    errors.push('La rama "si no" debe terminar con el mensaje "Lo sentimos, hoy no hay de eso".');
  }

  return { valid: errors.length === 0, errors };
}

function blockToPseudo(block: Block, indent: string, lines: string[]) {
  switch (block.type) {
    case 'api_endpoint': {
      lines.push(`${indent}Cuando llega un pedido a la caseta: {`);
      chainToPseudo(block.getInputTargetBlock('DO'), `${indent}  `, lines);
      lines.push(`${indent}}`);
      break;
    }
    case 'controls_if_stock': {
      const ingredient = String(block.getFieldValue('INGREDIENT'));
      const op = String(block.getFieldValue('OP'));
      const word = OPERATOR_WORD[op] ?? op;
      const amount = block.getFieldValue('AMOUNT');
      lines.push(`${indent}Si todavía hay ${ingredient} para ${word} ${amount} plato(s) {`);
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
      lines.push(`${indent}Quitar ${amount} ${ingredient} de la despensa`);
      break;
    }
    case 'db_get_stock': {
      const ingredient = String(block.getFieldValue('INGREDIENT'));
      lines.push(`${indent}Consultar cuántos ${ingredient} quedan en la despensa`);
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

  const lines: string[] = [];
  blockToPseudo(endpoint, '', lines);

  const descendants = endpoint.getDescendants(true);
  const descendantSet = new Set<Block>(descendants);
  const loose = looseBlocks.filter((block) => !descendantSet.has(block));

  const hasValidation = descendants.some((block) => block.type === 'controls_if_stock');
  const updateCount = descendants.filter((block) => block.type === 'db_update_stock').length;
  const responseCount = descendants.filter((block) => block.type === 'http_response').length;
  const bodyEmpty = !endpoint.getInputTargetBlock('DO');

  const issues: string[] = [];
  if (bodyEmpty) {
    issues.push('El flujo está vacío: agrega una condición, un descuento y una respuesta.');
  }
  if (updateCount > 0 && !hasValidation) {
    issues.push(
      'Descuentas ingredientes sin consultar primero cuánto hay: podrías vender sin insumos.'
    );
  }
  if (responseCount === 0 && !bodyEmpty) {
    issues.push('Falta el mensaje final: agrega un bloque "Decirle al comensal".');
  }
  if (loose.length > 0) {
    issues.push(`${loose.length} bloque(s) quedaron fuera del punto de inicio y no se ejecutarán.`);
  }

  const semantic = validateBackendSemantics(workspace);
  issues.push(...semantic.errors);

  return {
    hasEndpoint: true,
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
      inventory,
      committed: false,
      targetIngredient: null,
      logs: [
        {
          tone: 'error',
          text: 'Aún no hay un punto de inicio: arrastra el bloque "Cuando llega un pedido" y vuelve a probar.'
        }
      ],
      tip: ARCHITECTURE_TIP
    };
  }

  const endpoint = endpoints[0];

  const logs: BackendLog[] = [];

  const semantic = validateBackendSemantics(workspace);
  if (!semantic.valid) {
    return {
      kind: 'invalid',
      inventory,
      committed: false,
      targetIngredient: null,
      logs: [
        { tone: 'info', text: 'Un comensal hizo un pedido en la caseta: tu flujo tiene errores de lógica.' },
        ...semantic.errors.map((text, i) => ({
          tone: (i === 0 ? 'error' : 'warn') as BackendLog['tone'],
          text
        }))
      ],
      tip: 'Revisa los errores de lógica del flujo y vuelve a probar cuando sea correcto.'
    };
  }

  logs.push(
    { tone: 'info', text: 'Un comensal hizo un pedido en la caseta: empieza tu flujo.' }
  );

  const working: Inventory = { ...inventory };
  const updates: { ingredient: string; delta: number; before: number; after: number }[] = [];
  let responded: { status: number } | null = null;
  let fatalError = false;
  let targetIngredient: string | null = null;

  const evaluateCondition = (block: Block): boolean => {
    const ingredient = String(block.getFieldValue('INGREDIENT')) as Ingredient;
    const op = String(block.getFieldValue('OP'));
    const amount = Number(block.getFieldValue('AMOUNT'));
    const value = inventory[ingredient] ?? 0;
    targetIngredient = targetIngredient ?? ingredient;

    let result: boolean;
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
      text: `Validando ${ingredient}: hay ${value} - ${result ? 'sí alcanza' : 'no alcanza'}`
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
      case 'db_get_stock': {
        const ingredient = String(block.getFieldValue('INGREDIENT')) as Ingredient;
        const value = inventory[ingredient] ?? 0;
        logs.push({
          tone: 'info',
          text: `En la despensa hay ${value} de ${ingredient}`
        });
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
          text: `Quitar ${amount} de ${ingredient}: quedan ${after}`
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
      inventory,
      committed: false,
      targetIngredient,
      logs: [
        ...logs,
        {
          tone: 'error',
          text: 'Error en la despensa: intentaste quitar más ingredientes de los que hay. Eso no se puede.'
        },
        {
          tone: 'warn',
          text: 'Se revirtió todo: el inventario no cambió.'
        }
      ],
      tip: ARCHITECTURE_TIP
    };
  }

  if (!responded) {
    return {
      kind: 'no-response',
      inventory,
      committed: false,
      targetIngredient,
      logs: [
        ...logs,
        {
          tone: 'warn',
          text: 'Le faltaste el respeto al comensal: no encontré el bloque "Decirle al comensal" en tu flujo.'
        }
      ],
      tip: 'Agrega el bloque "Decirle al comensal" al final de tu flujo para responderle al cliente.'
    };
  }

  const { status } = responded;

  if (status === 409) {
    return {
      kind: 'conflict',
      inventory,
      committed: false,
      targetIngredient,
      logs: [
        ...logs,
        {
          tone: 'error',
          text: 'Pedido rechazado: no quedan suficientes ingredientes para preparar el plato.'
        },
        { tone: 'info', text: 'Inventario intacto: no se descontó nada.' }
      ],
      tip: null
    };
  }

  if (status >= 200 && status < 300) {
    if (updates.length === 0) {
      return {
        kind: 'no-updates',
        inventory,
        committed: false,
        targetIngredient,
        logs: [
          ...logs,
          { tone: 'warn', text: 'Se respondió al comensal, pero nadie descontó los ingredientes del plato.' }
        ],
        tip: ARCHITECTURE_TIP
      };
    }

    return {
      kind: 'created',
      inventory: working,
      committed: true,
      targetIngredient,
      logs: [
        ...logs,
        {
          tone: 'success' as const,
          text: 'Pedido completado con éxito: la cocina preparó el plato y se lo entregó al comensal.'
        }
      ],
      tip: null
    };
  }

  return {
    kind: 'no-updates',
    inventory,
    committed: false,
    targetIngredient,
    logs: [
      ...logs,
      { tone: 'error', text: 'La caseta respondió con un mensaje de error.' }
    ],
    tip: null
  };
}
