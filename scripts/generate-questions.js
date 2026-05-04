// Script to generate 500+ SQL practice questions
const fs = require('fs');

const questions = [];

// Helper function to create a question
function createQuestion(id, title, difficulty, topic, description, hint, schema, seedSQL, expectedQuery, solutionSQL, expectedColumns) {
  return {
    id,
    title,
    difficulty,
    topic,
    description,
    hint,
    schema,
    seedSQL,
    expectedQuery,
    solutionSQL,
    expectedColumns
  };
}

// ===== BASIC SELECT (50 questions) =====
const basicSelectQuestions = [
  // Questions 1-10: Simple SELECT
  ...Array.from({ length: 10 }, (_, i) => {
    const num = i + 1;
    const tables = ['employees', 'products', 'customers', 'orders', 'students', 'books', 'movies', 'songs', 'cities', 'countries'];
    const table = tables[i];
    return createQuestion(
      `q${num}`,
      `Select All from ${table.charAt(0).toUpperCase() + table.slice(1)}`,
      'easy',
      'SELECT Basics',
      `Write a query to select all columns from the ${table} table.`,
      'Use SELECT * to select all columns',
      [{ tableName: table, columns: ['id', 'name', 'value'], description: `${table} information` }],
      `CREATE TABLE ${table} (id INTEGER PRIMARY KEY, name TEXT, value INTEGER);
INSERT INTO ${table} VALUES (1, 'Item 1', 100);
INSERT INTO ${table} VALUES (2, 'Item 2', 200);
INSERT INTO ${table} VALUES (3, 'Item 3', 300);`,
      `SELECT * FROM ${table};`,
      `SELECT * FROM ${table};`,
      ['id', 'name', 'value']
    );
  }),

  // Questions 11-20: SELECT specific columns
  ...Array.from({ length: 10 }, (_, i) => {
    const num = i + 11;
    const tables = ['employees', 'products', 'customers', 'orders', 'students', 'books', 'movies', 'songs', 'cities', 'countries'];
    const table = tables[i];
    return createQuestion(
      `q${num}`,
      `Select Name from ${table.charAt(0).toUpperCase() + table.slice(1)}`,
      'easy',
      'SELECT Basics',
      `Select only the name column from the ${table} table.`,
      'List the column name after SELECT',
      [{ tableName: table, columns: ['id', 'name', 'value'], description: `${table} information` }],
      `CREATE TABLE ${table} (id INTEGER PRIMARY KEY, name TEXT, value INTEGER);
INSERT INTO ${table} VALUES (1, 'Item 1', 100);
INSERT INTO ${table} VALUES (2, 'Item 2', 200);
INSERT INTO ${table} VALUES (3, 'Item 3', 300);`,
      `SELECT name FROM ${table};`,
      `SELECT name FROM ${table};`,
      ['name']
    );
  }),

  // Questions 21-30: SELECT with DISTINCT
  ...Array.from({ length: 10 }, (_, i) => {
    const num = i + 21;
    const tables = ['employees', 'products', 'customers', 'orders', 'students', 'books', 'movies', 'songs', 'cities', 'countries'];
    const table = tables[i];
    return createQuestion(
      `q${num}`,
      `Select Distinct Values from ${table.charAt(0).toUpperCase() + table.slice(1)}`,
      'easy',
      'SELECT Basics',
      `Select distinct values from the value column in ${table}.`,
      'Use DISTINCT keyword',
      [{ tableName: table, columns: ['id', 'name', 'value'], description: `${table} information` }],
      `CREATE TABLE ${table} (id INTEGER PRIMARY KEY, name TEXT, value INTEGER);
INSERT INTO ${table} VALUES (1, 'Item 1', 100);
INSERT INTO ${table} VALUES (2, 'Item 2', 100);
INSERT INTO ${table} VALUES (3, 'Item 3', 200);`,
      `SELECT DISTINCT value FROM ${table};`,
      `SELECT DISTINCT value FROM ${table};`,
      ['value']
    );
  }),

  // Questions 31-40: SELECT with ORDER BY
  ...Array.from({ length: 10 }, (_, i) => {
    const num = i + 31;
    const tables = ['employees', 'products', 'customers', 'orders', 'students', 'books', 'movies', 'songs', 'cities', 'countries'];
    const table = tables[i];
    return createQuestion(
      `q${num}`,
      `Order ${table.charAt(0).toUpperCase() + table.slice(1)} by Value`,
      'easy',
      'SELECT Basics',
      `Select all from ${table} ordered by value descending.`,
      'Use ORDER BY with DESC',
      [{ tableName: table, columns: ['id', 'name', 'value'], description: `${table} information` }],
      `CREATE TABLE ${table} (id INTEGER PRIMARY KEY, name TEXT, value INTEGER);
INSERT INTO ${table} VALUES (1, 'Item 1', 100);
INSERT INTO ${table} VALUES (2, 'Item 2', 300);
INSERT INTO ${table} VALUES (3, 'Item 3', 200);`,
      `SELECT * FROM ${table} ORDER BY value DESC;`,
      `SELECT * FROM ${table} ORDER BY value DESC;`,
      ['id', 'name', 'value']
    );
  }),

  // Questions 41-50: SELECT with LIMIT
  ...Array.from({ length: 10 }, (_, i) => {
    const num = i + 41;
    const tables = ['employees', 'products', 'customers', 'orders', 'students', 'books', 'movies', 'songs', 'cities', 'countries'];
    const table = tables[i];
    return createQuestion(
      `q${num}`,
      `Top 2 ${table.charAt(0).toUpperCase() + table.slice(1)}`,
      'easy',
      'SELECT Basics',
      `Select top 2 records from ${table} ordered by value.`,
      'Use LIMIT clause',
      [{ tableName: table, columns: ['id', 'name', 'value'], description: `${table} information` }],
      `CREATE TABLE ${table} (id INTEGER PRIMARY KEY, name TEXT, value INTEGER);
INSERT INTO ${table} VALUES (1, 'Item 1', 100);
INSERT INTO ${table} VALUES (2, 'Item 2', 300);
INSERT INTO ${table} VALUES (3, 'Item 3', 200);`,
      `SELECT * FROM ${table} ORDER BY value DESC LIMIT 2;`,
      `SELECT * FROM ${table} ORDER BY value DESC LIMIT 2;`,
      ['id', 'name', 'value']
    );
  })
];

// ===== FILTERING (100 questions) =====
const filteringQuestions = [
  // Questions 51-100: WHERE with various operators
  ...Array.from({ length: 50 }, (_, i) => {
    const num = i + 51;
    const operators = ['>', '<', '>=', '<=', '=', '!='];
    const op = operators[i % operators.length];
    const threshold = [100, 200, 150, 250, 200, 100][i % 6];
    return createQuestion(
      `q${num}`,
      `Filter Products Where Value ${op} ${threshold}`,
      'easy',
      'Filtering',
      `Select products where value ${op} ${threshold}.`,
      `Use WHERE clause with ${op} operator`,
      [{ tableName: 'products', columns: ['id', 'name', 'value'], description: 'Product information' }],
      `CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, value INTEGER);
INSERT INTO products VALUES (1, 'Product A', 100);
INSERT INTO products VALUES (2, 'Product B', 200);
INSERT INTO products VALUES (3, 'Product C', 300);
INSERT INTO products VALUES (4, 'Product D', 150);`,
      `SELECT * FROM products WHERE value ${op} ${threshold};`,
      `SELECT * FROM products WHERE value ${op} ${threshold};`,
      ['id', 'name', 'value']
    );
  }),

  // Questions 101-150: WHERE with AND/OR
  ...Array.from({ length: 50 }, (_, i) => {
    const num = i + 101;
    const logic = i % 2 === 0 ? 'AND' : 'OR';
    return createQuestion(
      `q${num}`,
      `Filter with ${logic} Condition`,
      'medium',
      'Filtering',
      `Select products where value > 100 ${logic} name LIKE 'Product%'.`,
      `Use ${logic} to combine conditions`,
      [{ tableName: 'products', columns: ['id', 'name', 'value'], description: 'Product information' }],
      `CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, value INTEGER);
INSERT INTO products VALUES (1, 'Product A', 150);
INSERT INTO products VALUES (2, 'Item B', 200);
INSERT INTO products VALUES (3, 'Product C', 50);
INSERT INTO products VALUES (4, 'Item D', 300);`,
      `SELECT * FROM products WHERE value > 100 ${logic} name LIKE 'Product%';`,
      `SELECT * FROM products WHERE value > 100 ${logic} name LIKE 'Product%';`,
      ['id', 'name', 'value']
    );
  })
];

// ===== AGGREGATION (100 questions) =====
const aggregationQuestions = [
  // Questions 151-200: COUNT, SUM, AVG, MIN, MAX
  ...Array.from({ length: 50 }, (_, i) => {
    const num = i + 151;
    const funcs = ['COUNT(*)', 'SUM(value)', 'AVG(value)', 'MIN(value)', 'MAX(value)'];
    const func = funcs[i % funcs.length];
    const alias = ['count', 'total', 'average', 'minimum', 'maximum'][i % 5];
    return createQuestion(
      `q${num}`,
      `Calculate ${alias.charAt(0).toUpperCase() + alias.slice(1)} of Products`,
      'easy',
      'Aggregation',
      `Calculate the ${alias} using ${func}.`,
      `Use ${func} function`,
      [{ tableName: 'products', columns: ['id', 'name', 'value'], description: 'Product information' }],
      `CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, value INTEGER);
INSERT INTO products VALUES (1, 'Product A', 100);
INSERT INTO products VALUES (2, 'Product B', 200);
INSERT INTO products VALUES (3, 'Product C', 300);
INSERT INTO products VALUES (4, 'Product D', 400);`,
      `SELECT ${func} as ${alias} FROM products;`,
      `SELECT ${func} as ${alias} FROM products;`,
      [alias]
    );
  }),

  // Questions 201-250: GROUP BY with aggregation
  ...Array.from({ length: 50 }, (_, i) => {
    const num = i + 201;
    const funcs = ['COUNT(*)', 'SUM(value)', 'AVG(value)', 'MIN(value)', 'MAX(value)'];
    const func = funcs[i % funcs.length];
    const alias = ['count', 'total', 'average', 'minimum', 'maximum'][i % 5];
    return createQuestion(
      `q${num}`,
      `Group Products by Category with ${alias.charAt(0).toUpperCase() + alias.slice(1)}`,
      'medium',
      'Aggregation',
      `Calculate ${alias} for each category.`,
      'Use GROUP BY with aggregation function',
      [{ tableName: 'products', columns: ['id', 'name', 'category', 'value'], description: 'Product information' }],
      `CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, value INTEGER);
INSERT INTO products VALUES (1, 'Product A', 'Electronics', 100);
INSERT INTO products VALUES (2, 'Product B', 'Electronics', 200);
INSERT INTO products VALUES (3, 'Product C', 'Clothing', 150);
INSERT INTO products VALUES (4, 'Product D', 'Clothing', 250);`,
      `SELECT category, ${func} as ${alias} FROM products GROUP BY category;`,
      `SELECT category, ${func} as ${alias} FROM products GROUP BY category;`,
      ['category', alias]
    );
  })
];

// ===== JOINS (150 questions) =====
const joinQuestions = [
  // Questions 251-350: INNER JOIN variations
  ...Array.from({ length: 100 }, (_, i) => {
    const num = i + 251;
    const scenarios = [
      { table1: 'customers', table2: 'orders', col1: 'customer_name', col2: 'order_amount' },
      { table1: 'employees', table2: 'departments', col1: 'employee_name', col2: 'dept_name' },
      { table1: 'students', table2: 'courses', col1: 'student_name', col2: 'course_name' },
      { table1: 'products', table2: 'categories', col1: 'product_name', col2: 'category_name' },
      { table1: 'books', table2: 'authors', col1: 'book_title', col2: 'author_name' }
    ];
    const scenario = scenarios[i % scenarios.length];
    return createQuestion(
      `q${num}`,
      `Join ${scenario.table1.charAt(0).toUpperCase() + scenario.table1.slice(1)} with ${scenario.table2.charAt(0).toUpperCase() + scenario.table2.slice(1)}`,
      'medium',
      'JOINs',
      `Show ${scenario.col1} with their ${scenario.col2}.`,
      'Use INNER JOIN with ON clause',
      [
        { tableName: scenario.table1, columns: ['id', 'name', 'ref_id'], description: `${scenario.table1} information` },
        { tableName: scenario.table2, columns: ['id', 'name'], description: `${scenario.table2} information` }
      ],
      `CREATE TABLE ${scenario.table2} (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO ${scenario.table2} VALUES (1, 'Item 1');
INSERT INTO ${scenario.table2} VALUES (2, 'Item 2');

CREATE TABLE ${scenario.table1} (id INTEGER PRIMARY KEY, name TEXT, ref_id INTEGER);
INSERT INTO ${scenario.table1} VALUES (1, 'Record 1', 1);
INSERT INTO ${scenario.table1} VALUES (2, 'Record 2', 2);
INSERT INTO ${scenario.table1} VALUES (3, 'Record 3', 1);`,
      `SELECT ${scenario.table1}.name as ${scenario.col1}, ${scenario.table2}.name as ${scenario.col2} FROM ${scenario.table1} INNER JOIN ${scenario.table2} ON ${scenario.table1}.ref_id = ${scenario.table2}.id;`,
      `SELECT ${scenario.table1}.name as ${scenario.col1}, ${scenario.table2}.name as ${scenario.col2} FROM ${scenario.table1} INNER JOIN ${scenario.table2} ON ${scenario.table1}.ref_id = ${scenario.table2}.id;`,
      [scenario.col1, scenario.col2]
    );
  }),

  // Questions 351-400: LEFT JOIN and aggregation
  ...Array.from({ length: 50 }, (_, i) => {
    const num = i + 351;
    return createQuestion(
      `q${num}`,
      `Left Join with Count - Variation ${i + 1}`,
      'hard',
      'JOINs',
      'Show all customers with their order count (including customers with no orders).',
      'Use LEFT JOIN with COUNT()',
      [
        { tableName: 'customers', columns: ['id', 'name'], description: 'Customer information' },
        { tableName: 'orders', columns: ['id', 'customer_id', 'amount'], description: 'Order information' }
      ],
      `CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO customers VALUES (1, 'Customer ${i + 1}');
INSERT INTO customers VALUES (2, 'Customer ${i + 2}');
INSERT INTO customers VALUES (3, 'Customer ${i + 3}');

CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, amount REAL);
INSERT INTO orders VALUES (1, 1, ${100 + i * 10});
INSERT INTO orders VALUES (2, 1, ${150 + i * 10});`,
      'SELECT customers.name, COUNT(orders.id) as order_count FROM customers LEFT JOIN orders ON customers.id = orders.customer_id GROUP BY customers.name;',
      'SELECT customers.name, COUNT(orders.id) as order_count FROM customers LEFT JOIN orders ON customers.id = orders.customer_id GROUP BY customers.name;',
      ['name', 'order_count']
    );
  })
];

// ===== SUBQUERIES (50 questions) =====
const subqueryQuestions = Array.from({ length: 50 }, (_, i) => {
  const num = i + 401;
  return createQuestion(
    `q${num}`,
    `Subquery - Find Above Average ${i + 1}`,
    'hard',
    'Subqueries',
    'Find records where value is above the average.',
    'Use a subquery with AVG() in WHERE clause',
    [{ tableName: 'records', columns: ['id', 'name', 'value'], description: 'Record information' }],
    `CREATE TABLE records (id INTEGER PRIMARY KEY, name TEXT, value INTEGER);
INSERT INTO records VALUES (1, 'Record 1', ${100 + i * 10});
INSERT INTO records VALUES (2, 'Record 2', ${200 + i * 10});
INSERT INTO records VALUES (3, 'Record 3', ${150 + i * 10});
INSERT INTO records VALUES (4, 'Record 4', ${50 + i * 10});`,
    'SELECT * FROM records WHERE value > (SELECT AVG(value) FROM records);',
    'SELECT * FROM records WHERE value > (SELECT AVG(value) FROM records);',
    ['id', 'name', 'value']
  );
});

// ===== STRING FUNCTIONS (30 questions) =====
const stringQuestions = Array.from({ length: 30 }, (_, i) => {
  const num = i + 451;
  const funcs = ['UPPER', 'LOWER', 'LENGTH', 'SUBSTR', 'TRIM'];
  const func = funcs[i % funcs.length];
  let query, alias;
  
  switch(func) {
    case 'UPPER':
      query = 'SELECT UPPER(name) as upper_name FROM items;';
      alias = 'upper_name';
      break;
    case 'LOWER':
      query = 'SELECT LOWER(name) as lower_name FROM items;';
      alias = 'lower_name';
      break;
    case 'LENGTH':
      query = 'SELECT name, LENGTH(name) as name_length FROM items;';
      alias = 'name_length';
      break;
    case 'SUBSTR':
      query = 'SELECT SUBSTR(name, 1, 3) as short_name FROM items;';
      alias = 'short_name';
      break;
    case 'TRIM':
      query = 'SELECT TRIM(name) as trimmed_name FROM items;';
      alias = 'trimmed_name';
      break;
  }
  
  return createQuestion(
    `q${num}`,
    `String Function - ${func} ${i + 1}`,
    'easy',
    'String Functions',
    `Use ${func} function on name column.`,
    `Use ${func}() function`,
    [{ tableName: 'items', columns: ['id', 'name'], description: 'Item information' }],
    `CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO items VALUES (1, 'Item ${i + 1}');
INSERT INTO items VALUES (2, 'Item ${i + 2}');
INSERT INTO items VALUES (3, 'Item ${i + 3}');`,
    query,
    query,
    func === 'LENGTH' ? ['name', alias] : [alias]
  );
});

// ===== CASE STATEMENTS (20 questions) =====
const caseQuestions = Array.from({ length: 20 }, (_, i) => {
  const num = i + 481;
  return createQuestion(
    `q${num}`,
    `CASE Statement - Categorize ${i + 1}`,
    'medium',
    'CASE Statements',
    'Categorize values as High (>200), Medium (100-200), or Low (<100).',
    'Use CASE WHEN ... THEN ... ELSE ... END',
    [{ tableName: 'data', columns: ['id', 'name', 'value'], description: 'Data records' }],
    `CREATE TABLE data (id INTEGER PRIMARY KEY, name TEXT, value INTEGER);
INSERT INTO data VALUES (1, 'Item 1', ${50 + i * 20});
INSERT INTO data VALUES (2, 'Item 2', ${150 + i * 20});
INSERT INTO data VALUES (3, 'Item 3', ${250 + i * 20});`,
    "SELECT name, value, CASE WHEN value > 200 THEN 'High' WHEN value >= 100 THEN 'Medium' ELSE 'Low' END as category FROM data;",
    "SELECT name, value, CASE WHEN value > 200 THEN 'High' WHEN value >= 100 THEN 'Medium' ELSE 'Low' END as category FROM data;",
    ['name', 'value', 'category']
  );
});

// Combine all questions
questions.push(...basicSelectQuestions);
questions.push(...filteringQuestions);
questions.push(...aggregationQuestions);
questions.push(...joinQuestions);
questions.push(...subqueryQuestions);
questions.push(...stringQuestions);
questions.push(...caseQuestions);

// Generate TypeScript file
const output = `import { Question } from './questions';

// Auto-generated 500+ SQL practice questions
export const EXTENDED_QUESTIONS: Question[] = ${JSON.stringify(questions, null, 2)};
`;

fs.writeFileSync('lib/questions-data-extended.ts', output);
console.log(`✅ Generated ${questions.length} questions!`);
console.log(`📊 Breakdown:`);
console.log(`   - SELECT Basics: 50`);
console.log(`   - Filtering: 100`);
console.log(`   - Aggregation: 100`);
console.log(`   - JOINs: 150`);
console.log(`   - Subqueries: 50`);
console.log(`   - String Functions: 30`);
console.log(`   - CASE Statements: 20`);
console.log(`   - Total: ${questions.length}`);
