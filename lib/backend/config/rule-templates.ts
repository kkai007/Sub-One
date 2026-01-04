
/**
 * 规则模板定义系统
 * 
 * 核心设计：
 * 使用抽象的 "UniversalRule" 结构来描述规则，然后由各客户端的转换器将其“翻译”为特定格式。
 * 避免维护多份重复的配置。
 */

// ==================== 类型定义 ====================

export type RuleTarget = 'Proxy' | 'Direct' | 'Reject' | 'Auto' | string; // string 用于自定义策略组名称

export interface UniversalGroup {
    name: string;   // 策略组标识，如 "Streaming"
    type: 'select' | 'url-test' | 'fallback';
    icon?: string;  // Clash Meta 专属
    ruleProviders?: string[]; // 绑定的规则集 (可选)
}

export type RuleType =
    | 'domain'
    | 'domain_suffix'
    | 'domain_keyword'
    | 'ip_cidr'
    | 'geoip'
    | 'geosite'
    | 'process_name';

export interface UniversalRule {
    type: RuleType;
    value: string;
    target: RuleTarget; // 目标策略组
    noResolve?: boolean; // DNS 
}

export interface RuleTemplate {
    id: string;
    name: string;
    description: string;
    groups: UniversalGroup[]; // 该模板需要创建的额外策略组 (除了默认的 Proxy/Auto/Direct)
    rules: UniversalRule[];   // 具体的规则列表
}

// ==================== 预置模板 ====================

/**
 * 模板 1: 基础模式 (Minimal)
 * 仅包含 GEOIP CN 直连，其他全部走代理。最简单，不容易出错。
 */
export const TEMPLATE_MINIMAL: RuleTemplate = {
    id: 'minimal',
    name: '基础模式 (仅CN直连)',
    description: '最简单的规则，国内IP直连，其他全部代理。',
    groups: [], // 无额外策略组
    rules: [
        // 局域网和私有IP
        { type: 'domain_suffix', value: 'local', target: 'Direct' },
        { type: 'ip_cidr', value: '127.0.0.0/8', target: 'Direct', noResolve: true },
        { type: 'ip_cidr', value: '172.16.0.0/12', target: 'Direct', noResolve: true },
        { type: 'ip_cidr', value: '192.168.0.0/16', target: 'Direct', noResolve: true },
        { type: 'ip_cidr', value: '10.0.0.0/8', target: 'Direct', noResolve: true },
        // CN 直连
        { type: 'geoip', value: 'cn', target: 'Direct' },
        { type: 'geoip', value: 'private', target: 'Direct' },
        // 兜底 (Final) 逻辑由转换器处理，通常是 MATCH -> Proxy
    ]
};

/**
 * 模板 2: 标准分流 (Standard)
 * - 增加 Apple, Google, Microsoft 等常见服务的自动分流策略组
 * - 增加 广告拦截 (Reject)
 */
export const TEMPLATE_STANDARD: RuleTemplate = {
    id: 'standard',
    name: '标准分流 (推荐)',
    description: '包含苹果、微软、谷歌、Telegram等常见服务的分流策略，以及基础广告拦截。',
    groups: [
        { name: 'Apple', type: 'select', icon: '🍎' },
        { name: 'Microsoft', type: 'select', icon: '🪟' },
        { name: 'Google', type: 'select', icon: '🔍' },
        { name: 'Telegram', type: 'select', icon: '✈️' },
        { name: 'Streaming', type: 'select', icon: '🎬' }
    ],
    rules: [
        // AdBlock
        { type: 'geosite', value: 'category-ads-all', target: 'Reject' },

        // Specific Groups
        { type: 'geosite', value: 'apple', target: 'Apple' },
        { type: 'geosite', value: 'microsoft', target: 'Microsoft' },
        { type: 'geosite', value: 'google', target: 'Google' },
        { type: 'geosite', value: 'telegram', target: 'Telegram' },
        { type: 'geosite', value: 'netflix', target: 'Streaming' },
        { type: 'geosite', value: 'youtube', target: 'Streaming' },
        { type: 'geosite', value: 'disney', target: 'Streaming' },

        // CN
        { type: 'geosite', value: 'cn', target: 'Direct' },
        { type: 'geoip', value: 'cn', target: 'Direct' },
        { type: 'geoip', value: 'private', target: 'Direct' }
    ]
};

/**
 * 模板 3: ACL4SSR 精简版 (ACL4SSR_Mini)
 * 模仿经典的 ACL4SSR 分组逻辑，适合习惯该配置的用户。
 */
export const TEMPLATE_ACL4SSR: RuleTemplate = {
    id: 'acl4ssr',
    name: 'ACL4SSR 精简版',
    description: '经典的 ACL4SSR 分组策略，包含流媒体、社交网络等详细分组。',
    groups: [
        { name: 'Netflix', type: 'select', icon: '🎥' },
        { name: 'Telegram', type: 'select', icon: '📲' },
        { name: 'YouTube', type: 'select', icon: '📹' },
        { name: 'Spotify', type: 'select', icon: '🎵' }
    ],
    rules: [
        { type: 'geosite', value: 'category-ads-all', target: 'Reject' },
        { type: 'geosite', value: 'netflix', target: 'Netflix' },
        { type: 'geosite', value: 'telegram', target: 'Telegram' },
        { type: 'geosite', value: 'youtube', target: 'YouTube' },
        { type: 'geosite', value: 'spotify', target: 'Spotify' },
        { type: 'geosite', value: 'cn', target: 'Direct' },
        { type: 'geoip', value: 'cn', target: 'Direct' },
        { type: 'geoip', value: 'private', target: 'Direct' }
    ]
};

/**
 * 模板 4: 高级全能版 (Advanced)
 * 极致细分，包含 AI、各类流媒体、游戏等独立策略组。
 */
export const TEMPLATE_ADVANCED: RuleTemplate = {
    id: 'advanced',
    name: '高级全能版 (AI/流媒体细分)',
    description: '适合进阶用户，包含 OpenAI、Disney+、Prime Video、游戏等独立分组。',
    groups: [
        { name: 'AI Services', type: 'select', icon: '🤖' }, // ChatGPT, Bard, Bing
        { name: 'Netflix', type: 'select', icon: '🎥' },
        { name: 'Disney+', type: 'select', icon: '🏰' },
        { name: 'Prime Video', type: 'select', icon: '📦' },
        { name: 'YouTube', type: 'select', icon: '📹' },
        { name: 'Spotify', type: 'select', icon: '🎵' },
        { name: 'Telegram', type: 'select', icon: '✈️' },
        { name: 'Steam', type: 'select', icon: '🎮' },   // 游戏平台
        { name: 'Apple', type: 'select', icon: '🍎' },
        { name: 'Microsoft', type: 'select', icon: '🪟' },
        { name: 'PayPal', type: 'select', icon: '💳' }
    ],
    rules: [
        { type: 'geosite', value: 'category-ads-all', target: 'Reject' },

        // AI
        { type: 'geosite', value: 'openai', target: 'AI Services' },
        { type: 'geosite', value: 'anthropic', target: 'AI Services' }, // Claude

        // Streaming
        { type: 'geosite', value: 'netflix', target: 'Netflix' },
        { type: 'geosite', value: 'disney', target: 'Disney+' },
        { type: 'geosite', value: 'primevideo', target: 'Prime Video' },
        { type: 'geosite', value: 'youtube', target: 'YouTube' },
        { type: 'geosite', value: 'spotify', target: 'Spotify' },

        // Gaming
        { type: 'geosite', value: 'steam', target: 'Steam' },
        { type: 'geosite', value: 'epicgames', target: 'Steam' },

        // Common
        { type: 'geosite', value: 'telegram', target: 'Telegram' },
        { type: 'geosite', value: 'paypal', target: 'PayPal' },
        { type: 'geosite', value: 'apple', target: 'Apple' },
        { type: 'geosite', value: 'microsoft', target: 'Microsoft' },

        // CN & Final
        { type: 'geosite', value: 'cn', target: 'Direct' },
        { type: 'geoip', value: 'cn', target: 'Direct' },
        { type: 'geoip', value: 'private', target: 'Direct' }
    ]
};

export const BUILTIN_TEMPLATES = [
    TEMPLATE_MINIMAL,
    TEMPLATE_STANDARD,
    TEMPLATE_ACL4SSR,
    TEMPLATE_ADVANCED
];

export function getTemplate(id: string): RuleTemplate {
    return BUILTIN_TEMPLATES.find(t => t.id === id) || TEMPLATE_MINIMAL;
}
