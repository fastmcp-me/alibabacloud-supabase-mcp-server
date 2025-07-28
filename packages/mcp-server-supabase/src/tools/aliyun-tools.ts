import type { SupabasePlatform } from '../platform/types.js';
import { type Tool, tool } from '@supabase/mcp-utils';
import { z } from 'zod';

export type AliyunToolsOptions = {
  platform: SupabasePlatform;
};

export async function getAliyunTools({ platform }: AliyunToolsOptions): Promise<Record<string, Tool>> {
  return {
    list_aliyun_supabase_projects: tool({
      description: 'Lists Supabase projects on Aliyun platform',
      parameters: z.object({
        region_id: z.string().optional().describe('Region ID'),
        next_token: z.string().optional().describe('Next token for pagination'),
        max_results: z.number().optional().describe('Maximum number of results to return')
      }),
      execute: async (options) => {
        try {
          const result = await platform.listAliyunSupabaseProjects(options);
          return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          // 类型检查确保 error 是 Error 实例
          const message = error instanceof Error ? error.message : 'Unknown error occurred';
          return {
            content: [{ type: 'text', text: `Error: ${message}` }]
          };
        }
      }
    }),

    get_supabase_project: tool({
      description: 'Gets details for a specific Supabase project on Aliyun platform.',
      parameters: z.object({
        project_id: z.string().describe('The ID of the Supabase project.'),
        region_id: z.string().optional().describe('Region ID'),
      }),
      execute: async (options) => {
        try {
          // 这里的 options 将是 { project_id: '...' }
          const result = await platform.getAliyunSupabaseProject(options);
          // 返回 JSON 格式的结果，让 AI 自己去解析和总结
          return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error occurred';
          return {
            content: [{ type: 'text', text: `Error: ${message}` }]
          };
        }
      }
    }),

    get_supabase_project_dashboard_account: tool({
      description: 'Gets the Supabase project dashboard account information.',
      parameters: z.object({
        project_id: z.string().describe('The Supabase instance ID.'),
        region_id: z.string().optional().describe('Region ID'),
      }),
      execute: async (options) => {
        try {
          const result = await platform.getAliyunSupabaseProjectDashboardAccount(options);
          
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }]
          };
        } catch (error) {
          throw new Error(`Failed to get dashboard account: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
    }),

  };
}