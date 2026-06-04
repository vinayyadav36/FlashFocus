import { Request, Response } from 'express';
import { readData } from '../storage/index.js';
import { BlockTemplate } from '../shared/types/index.js';

const TEMPLATES_FILE = 'seed/templates.json';

export const getTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const templates = await readData<BlockTemplate>(TEMPLATES_FILE);
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
