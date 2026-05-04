// Script to generate 1000+ SQL practice questions
const fs = require('fs');

const questions = [];
let questionId = 1;

// Helper function
function createQuestion(title, difficulty, topic, description, hint, schema, seedSQL, expectedQuery, solutionSQL, expectedColumns, dialect = 'sqlite') {
  return {
    id: `q${questionId++}`,
    title,
    difficulty,
    topic,
    description,
    hint,
    schema,
    seedSQL,
    expectedQuery,
    solutionSQL,
    expectedColumns,
    dialect
  };
}

// ===== SELECT BASICS (100 questions) =====
for (let i = 0; i < 100; i++) {
  const tables = ['employees', 'products', 'customers', 'orders', 'students', 'books', 'movies', 'songs', 'cities', 'countries'];
  const table = tables[i % 10];
  const dialects = ['sqlite', 'mysql', 'postgresql'];
  const dialect = dialects[i % 3];
  
  questions.push(createQuestion(
    `Select All from ${table.charAt(0).toUpperCase() + table.slice(1)} #${i + 1}`,
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
    ['id', 'name', 'value'],
    dialect
  ));
}

// ===== FILTERING (150 questions) =====
for (let i = 0; i < 150; i++) {
  const operators = ['>', '<', '>=', '<=', '=', '!='];
  const op = operators[i % 6];
  const threshold = [100, 200, 150, 250, 200, 100][i % 6];
  const difficulty = i < 75 ? 'easy' : 'medium';
  
  questions.push(createQuestion(
    `Filter Products Where Value ${op} ${threshold} #${i + 1}`,
    difficulty,
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
    ['id', 'name', 'value'],
    'sqlite'
  ));
}

// ===== AGGREGATION (150 questions) =====
for (let i = 0; i < 150; i++) {
  const funcs = ['COUNT(*)', 'SUM(value)', 'AVG(value)', 'MIN(value)', 'MAX(value)'];
  const func = funcs[i % 5];
  const alias = ['count', 'total', 'average', 'minimum', 'maximum'][i % 5];
  const difficulty = i < 50 ? 'easy' : 'medium';
  
  if (i < 75) {
    // Simple aggregation
    questions.push(createQuestion(
      `Calculate ${alias.charAt(0).toUpperCase() + alias.slice(1)} #${i + 1}`,
      difficulty,
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
      [alias],
      'sqlite'
    ));
  } else {
    // GROUP BY aggregation
    questions.push(createQuestion(
      `Group by Category with ${alias.charAt(0).toUpperCase() + alias.slice(1)} #${i + 1}`,
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
      ['category', alias],
      'sqlite'
    ));
  }
}

// ===== JOINS (250 questions) =====
for (let i = 0; i < 250; i++) {
  const scenarios = [
    { table1: 'customers', table2: 'orders', col1: 'customer_name', col2: 'order_amount' },
    { table1: 'employees', table2: 'departments', col1: 'employee_name', col2: 'dept_name' },
    { table1: 'students', table2: 'courses', col1: 'student_name', col2: 'course_name' },
    { table1: 'products', table2: 'categories', col1: 'product_name', col2: 'category_name' },
    { table1: 'books', table2: 'authors', col1: 'book_title', col2: 'author_name' }
  ];
  const scenario = scenarios[i % 5];
  const difficulty = i < 150 ? 'medium' : 'hard';
  
  questions.push(createQuestion(
    `Join ${scenario.table1} with ${scenario.table2} #${i + 1}`,
    difficulty,
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
    [scenario.col1, scenario.col2],
    'sqlite'
  ));
}

// ===== SUBQUERIES (100 questions) =====
for (let i = 0; i < 100; i++) {
  questions.push(createQuestion(
    `Subquery - Above Average #${i + 1}`,
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
    ['id', 'name', 'value'],
    'sqlite'
  ));
}

// ===== WINDOW FUNCTIONS (100 questions) =====
for (let i = 0; i < 100; i++) {
  const funcs = ['ROW_NUMBER', 'RANK', 'DENSE_RANK', 'NTILE'];
  const func = funcs[i % 4];
  const alias = func.toLowerCase().replace('_', '_');
  
  questions.push(createQuestion(
    `${func} - Ranking #${i + 1}`,
    'hard',
    'Window Functions',
    `Use ${func}() to rank employees by salary.`,
    `Use ${func}() OVER (ORDER BY ...)`,
    [{ tableName: 'employees', columns: ['id', 'name', 'salary'], description: 'Employee information' }],
    `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER);
INSERT INTO employees VALUES (1, 'Alice', ${90000 + i * 100});
INSERT INTO employees VALUES (2, 'Bob', ${70000 + i * 100});
INSERT INTO employees VALUES (3, 'Charlie', ${95000 + i * 100});
INSERT INTO employees VALUES (4, 'Diana', ${85000 + i * 100});`,
    func === 'NTILE' 
      ? `SELECT name, salary, NTILE(4) OVER (ORDER BY salary DESC) as quartile FROM employees;`
      : `SELECT name, salary, ${func}() OVER (ORDER BY salary DESC) as ${alias} FROM employees;`,
    func === 'NTILE'
      ? `SELECT name, salary, NTILE(4) OVER (ORDER BY salary DESC) as quartile FROM employees;`
      : `SELECT name, salary, ${func}() OVER (ORDER BY salary DESC) as ${alias} FROM employees;`,
    func === 'NTILE' ? ['name', 'salary', 'quartile'] : ['name', 'salary', alias],
    'sqlite'
  ));
}

// ===== STRING FUNCTIONS (50 questions) =====
for (let i = 0; i < 50; i++) {
  const funcs = ['UPPER', 'LOWER', 'LENGTH', 'SUBSTR', 'TRIM'];
  const func = funcs[i % 5];
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
  
  questions.push(createQuestion(
    `String ${func} #${i + 1}`,
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
    func === 'LENGTH' ? ['name', alias] : [alias],
    'sqlite'
  ));
}

// ===== CASE STATEMENTS (50 questions) =====
for (let i = 0; i < 50; i++) {
  questions.push(createQuestion(
    `CASE Statement - Categorize #${i + 1}`,
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
    ['name', 'value', 'category'],
    'sqlite'
  ));
}

// ===== CTEs (50 questions) =====
for (let i = 0; i < 50; i++) {
  questions.push(createQuestion(
    `CTE - Common Table Expression #${i + 1}`,
    'hard',
    'CTEs',
    'Use a CTE to find employees with above-average salaries.',
    'Use WITH clause to create a CTE',
    [{ tableName: 'employees', columns: ['id', 'name', 'salary'], description: 'Employee information' }],
    `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER);
INSERT INTO employees VALUES (1, 'Alice', ${90000 + i * 1000});
INSERT INTO employees VALUES (2, 'Bob', ${70000 + i * 1000});
INSERT INTO employees VALUES (3, 'Charlie', ${95000 + i * 1000});
INSERT INTO employees VALUES (4, 'Diana', ${85000 + i * 1000});`,
    'WITH avg_salary AS (SELECT AVG(salary) as avg FROM employees) SELECT * FROM employees, avg_salary WHERE employees.salary > avg_salary.avg;',
    'WITH avg_salary AS (SELECT AVG(salary) as avg FROM employees) SELECT * FROM employees, avg_salary WHERE employees.salary > avg_salary.avg;',
    ['id', 'name', 'salary', 'avg'],
    'sqlite'
  ));
}

// ===== DATE FUNCTIONS (50 questions) =====
for (let i = 0; i < 50; i++) {
  questions.push(createQuestion(
    `Date Function - Extract Year #${i + 1}`,
    'easy',
    'Date Functions',
    'Extract the year from hire_date for each employee.',
    'Use STRFTIME() function',
    [{ tableName: 'employees', columns: ['id', 'name', 'hire_date'], description: 'Employee information' }],
    `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, hire_date TEXT);
INSERT INTO employees VALUES (1, 'Alice', '2020-01-15');
INSERT INTO employees VALUES (2, 'Bob', '2019-03-20');
INSERT INTO employees VALUES (3, 'Charlie', '2021-07-10');`,
    "SELECT name, STRFTIME('%Y', hire_date) as hire_year FROM employees;",
    "SELECT name, STRFTIME('%Y', hire_date) as hire_year FROM employees;",
    ['name', 'hire_year'],
    'sqlite'
  ));
}

// Generate TypeScript file
const output = `import { Question } from './questions';

// Auto-generated 1000+ SQL practice questions
export const EXTENDED_QUESTIONS: Question[] = ${JSON.stringify(questions, null, 2)};
`;

fs.writeFileSync('lib/questions-data-extended.ts', output);
console.log(`✅ Generated ${questions.length} questions!`);
console.log(`📊 Breakdown:`);
console.log(`   - SELECT Basics: 100 (Easy)`);
console.log(`   - Filtering: 150 (Easy-Medium)`);
console.log(`   - Aggregation: 150 (Easy-Medium)`);
console.log(`   - JOINs: 250 (Medium-Hard)`);
console.log(`   - Subqueries: 100 (Hard)`);
console.log(`   - Window Functions: 100 (Hard)`);
console.log(`   - String Functions: 50 (Easy)`);
console.log(`   - CASE Statements: 50 (Medium)`);
console.log(`   - CTEs: 50 (Hard)`);
console.log(`   - Date Functions: 50 (Easy)`);
console.log(`   - Total: ${questions.length}`);
