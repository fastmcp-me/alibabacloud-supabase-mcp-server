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

    get_supabase_project_api_keys: tool({
      description: 'Gets the Supabase project API keys including anon key and service role key.',
      parameters: z.object({
        project_id: z.string().describe('The Supabase instance ID.'),
        region_id: z.string().optional().describe('The region ID where the instance is located.'),
      }),
      execute: async (options) => {
        try {
          const result = await platform.getAliyunSupabaseProjectApiKeys(options);
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

    modify_supabase_project_security_ip_list: tool({
      description: 'Modify the IP whitelist for a Supabase project. You need to add the client IP address or IP address range to the whitelist before using the Supabase instance.',
      parameters: z.object({
        project_id: z.string().describe('The Supabase instance ID.'),
        region_id: z.string().optional().describe('Region ID. You can call the DescribeRegions API to view available region IDs.'),
        security_ip_list: z.string().describe('Comma-separated list of IP addresses or CIDR blocks to add to the whitelist. Up to 1000 entries. Format: 10.23.12.24 (IP) or 10.23.12.24/24 (CIDR)'),
      }),
      execute: async (options) => {
        try {
          const result = await platform.modifyAliyunSupabaseProjectSecurityIps({
            project_id: options.project_id,
            region_id: options.region_id,
            security_ip_list: options.security_ip_list.split(',').map(ip => ip.trim())
          });
          
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }]
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error occurred';
          return {
            content: [{ type: 'text', text: `Error: ${message}` }]
          };
        }
      }
    }),

    reset_supabase_project_password: tool({
      description: 'Reset the database password for a Supabase project.',
      parameters: z.object({
        project_id: z.string().describe('The Supabase instance ID.'),
        region_id: z.string().optional().describe('Instance region ID.'),
        account_password: z.string().describe('Database account password. Must contain at least three of the following: uppercase letters, lowercase letters, numbers, and special characters. Special characters include: !@#$%^&*()_+-=. Password length must be between 8 and 32 characters.'),
      }),
      execute: async (options) => {
        try {
          const result = await platform.resetAliyunSupabaseProjectPassword(options);
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

    create_supabase_project: tool({
      description: 'Create a new Supabase project on Aliyun platform.',
      parameters: z.object({
        project_name: z.string().describe('Project name. Must be 1-128 characters long. Can only contain English letters, numbers, hyphens (-) and underscores (_). Must start with an English letter or underscore (_).'),
        zone_id: z.string().describe('Zone ID. You can call the DescribeRegions API to view available zone IDs.'),
        account_password: z.string().describe('Initial account password. Must contain at least three of the following: uppercase letters, lowercase letters, numbers, and special characters. Special characters include: !@#$%^&*()_+-=. Password length must be between 8 and 32 characters.'),
        security_ip_list: z.string().describe('IP whitelist. 127.0.0.1 means禁止任何外部 IP 访问, you can modify the IP whitelist after the instance is created by calling the ModifySecurityIps API.'),
        vpc_id: z.string().describe('VPC ID. You can call the DescribeRdsVpcs API to view available VPC IDs. This parameter is required.'),
        v_switch_id: z.string().describe('vSwitch ID. vSwitchId is required. The zone where the vSwitch is located must be consistent with ZoneId.'),
        project_spec: z.string().describe('Supabase instance specification, default is 1C1G.'),
        region_id: z.string().optional().describe('Region ID. You can call the DescribeRegions API to view available region IDs.'),
        storage_size: z.number().optional().describe('Storage space size in GB, default is 1GB.'),
        disk_performance_level: z.enum(['PL0', 'PL1']).optional().describe('Cloud disk PL level, default is PL0.'),
        client_token: z.string().optional().describe('Idempotency check. For more information, see How to Ensure Idempotency.'),
      }),
      execute: async (options) => {
        try {
          const result = await platform.createAliyunSupabaseProject(options);
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

  };
}