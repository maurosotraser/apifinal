import { Request, Response } from 'express';
import { TokenService } from '../services/token.service';
import { z } from 'zod';

const tokenService = new TokenService();

// Validation schemas
const createTokenSchema = z.object({
  id_usuario: z.number(),
  token: z.string().min(1),
  fecha_expiracion: z.date(),
  fecha_creacion: z.date(),
  fecha_validacion: z.date().nullable(),
  ind_validado: z.string(),
  inserted_by: z.string().min(1),
  inserted_at: z.string().min(1),
  updated_at: z.string().min(1),
  updated_by: z.string().min(1)
});

const updateTokenSchema = z.object({
  token: z.string().min(1).optional(),
  fecha_expiracion: z.date().optional(),
  updated_by: z.string().min(1)
});

export class TokenController {
  async createToken(req: Request, res: Response) {
    try {
      const tokenData = createTokenSchema.parse(req.body);
      const token = await tokenService.createToken(tokenData);
      res.status(201).json(token);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTokenById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const token = await tokenService.getTokenById(id);
      
      if (!token) {
        res.status(404).json({ error: 'Token not found' });
        return;
      }
      
      res.json(token);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTokenByValue(req: Request, res: Response) {
    try {
      const token = req.params.token;
      const tokenData = await tokenService.getTokenByValue(token);
      
      if (!tokenData) {
        res.status(404).json({ error: 'Token not found' });
        return;
      }
      
      res.json(tokenData);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateToken(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const tokenData = updateTokenSchema.parse(req.body);
      const token = await tokenService.updateToken(id, tokenData);
      
      if (!token) {
        res.status(404).json({ error: 'Token not found' });
        return;
      }
      
      res.json(token);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteToken(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await tokenService.deleteToken(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Token not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteExpiredTokens(_req: Request, res: Response) {
    try {
      await tokenService.deleteExpiredTokens();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTokensByUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const tokens = await tokenService.getTokensByUser(userId);
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async validateToken(req: Request, res: Response) {
    try {
      const token = req.params.token;
      const isValid = await tokenService.validateToken(token);
      res.json({ isValid });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 