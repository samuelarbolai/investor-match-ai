import { Request, Response } from 'express';
import { listPrompts, PromptFilters, upsertPrompt } from '../services/prompt.service';

export class PromptController {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const filters: PromptFilters = {
        agent_name: req.query.agent_name as string | undefined,
        prompt_type: req.query.prompt_type as string | undefined,
        language: req.query.language as string | undefined,
      };
      const prompts = await listPrompts(filters);
      res.json(prompts);
    } catch (error: any) {
      console.error('[Prompts] list failed', error);
      res.status(500).json({ error: error.message || 'Failed to fetch prompts' });
    }
  }

  async upsert(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body;
      if (!payload?.agent_name || !payload?.prompt_type || !payload?.content) {
        res.status(400).json({ error: 'agent_name, prompt_type, and content are required' });
        return;
      }
      const prompt = await upsertPrompt({
        agent_name: payload.agent_name,
        prompt_type: payload.prompt_type,
        language: payload.language,
        content: payload.content,
        updated_by: payload.updated_by,
      });
      res.json(prompt);
    } catch (error: any) {
      console.error('[Prompts] upsert failed', error);
      res.status(500).json({ error: error.message || 'Failed to save prompt' });
    }
  }
}

export const promptController = new PromptController();
