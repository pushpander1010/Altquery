export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Schema {
  tableName: string;
  columns: string[];
  description: string;
}

export interface Question {
  id: string;
  title: string;
  difficulty: Difficulty;
  topic: string;
  description: string;
  hint: string;
  schema: Schema[];
  seedSQL: string;
  expectedQuery: string;
  solutionSQL: string;
  expectedColumns: string[];
  dialect?: string; // sqlite, mysql, postgresql
}

export const TOPICS = [
  'SELECT Basics',
  'Filtering',
  'Aggregation',
  'JOINs',
  'Subqueries',
  'Window Functions',
  'CTEs',
  'String Functions',
  'Date Functions',
  'CASE Statements',
] as const;

export type Topic = typeof TOPICS[number];

export { QUESTIONS_DATA as QUESTIONS } from './questions-data';
