import { parse } from 'yaml';
import path from 'node:path';
import fs from 'node:fs';

export const getEnv = () => {
  return process.env.RUNNING_ENV;
};

export const getConfig = () => {
  const environment = getEnv();
  const yamlPath = path.join(process.cwd(), `./config/.${environment}.yaml`);
  const file = fs.readFileSync(yamlPath, 'utf-8');
  const config = parse(file);
  return config;
};
