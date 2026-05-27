import { Request, Response } from 'express';
import { readData, writeData } from '../storage/index.js';
import { PageConfig } from '../../../shared/types/index.js';
import { generateId, getTimestamp } from '../../../shared/utils/index.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const PAGES_FILE = 'content/pages.json';

export const createPage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, slug, blocks, isPublished } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!slug) {
      res.status(400).json({ error: 'Slug is required' });
      return;
    }

    const pages = await readData<PageConfig>(PAGES_FILE);
    if (pages.find(p => p.slug === slug)) {
      res.status(400).json({ error: 'Slug already in use' });
      return;
    }

    const newPage: PageConfig = {
      id: generateId(),
      userId: req.user.id,
      slug,
      title: title || '',
      description: description || '',
      blocks: blocks || [],
      viewCount: 0,
      isPublished: isPublished ?? false,
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };

    pages.push(newPage);
    await writeData(PAGES_FILE, pages);

    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const pages = await readData<PageConfig>(PAGES_FILE);
    const userPages = pages.filter(p => p.userId === req.user!.id);

    res.json(userPages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPageBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const pages = await readData<PageConfig>(PAGES_FILE);
    const page = pages.find(p => p.slug === slug);

    if (!page || !page.isPublished) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    page.viewCount += 1;
    await writeData(PAGES_FILE, pages);

    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const pages = await readData<PageConfig>(PAGES_FILE);
    const pageIndex = pages.findIndex(p => p.id === id);

    if (pageIndex === -1) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    if (pages[pageIndex].userId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const updatedPage = {
      ...pages[pageIndex],
      ...req.body,
      id, // ensure id is not overwritten
      userId: pages[pageIndex].userId, // ensure userId is not overwritten
      updatedAt: getTimestamp()
    };

    pages[pageIndex] = updatedPage;
    await writeData(PAGES_FILE, pages);

    res.json(updatedPage);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPageById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const pages = await readData<PageConfig>(PAGES_FILE);
    const page = pages.find(p => p.id === id);

    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    if (page.userId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
