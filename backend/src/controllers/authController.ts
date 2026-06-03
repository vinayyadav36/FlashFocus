import { Request, Response } from 'express';
import { readData, writeData } from '../storage/index.js';
import { User } from '../shared/types/index.js';
import { generateId, getTimestamp } from '../shared/utils/index.js';
import { isEmailValid } from '../shared/schemas/index.js';
import { hashPassword, verifyPassword } from '../auth/hash.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'flashfocus-saltedhash-super-secret-key';
const USERS_FILE = 'users/users.json';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password || !isEmailValid(email)) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const users = await readData<User>(USERS_FILE);
    if (users.find(u => u.email === email)) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: generateId(),
      email,
      passwordHash,
      role: 'user',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };

    users.push(newUser);
    await writeData(USERS_FILE, users);

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    // Do not return passwordHash
    const { passwordHash: _, ...userWithoutHash } = newUser;
    res.status(201).json({ user: userWithoutHash, token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const users = await readData<User>(USERS_FILE);
    const user = users.find(u => u.email === email);

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const { passwordHash: _, ...userWithoutHash } = user;
    res.json({ user: userWithoutHash, token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
