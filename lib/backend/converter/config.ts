/**
 * ==================== 转换器配置中心 ====================
 * 
 * 统一管理各客户端转换器的默认配置、规则、策略组名称等。
 */

// --- 基础公共配置 ---

/** 默认绕过的域名/IP 列表 */
export const DEFAULT_SKIP_PROXY = [
    '127.0.0.1',
    '192.168.0.0/16',
    '10.0.0.0/8',
    '172.16.0.0/12',
    '100.64.0.0/10',
    'localhost',
    '*.local',
    '*.crashlytics.com',
    '*.adb.com'
];

/** 默认 DNS 服务器 */
export const DEFAULT_DNS = [
    '223.5.5.5',
    '114.114.114.114',
    '8.8.8.8'
];

// --- Clash 专用配置 ---

export const CLASH_CONFIG = {
    port: 7890,
    'socks-port': 7891,
    'allow-lan': false,
    mode: 'Rule',
    'log-level': 'info',
    'external-controller': '127.0.0.1:9090',
    groupNames: {
        select: '🚀 节点选择',
        auto: '♻️ 自动选择',
        direct: '🎯 全球直连'
    },
    testUrl: 'http://www.gstatic.com/generate_204'
};

// --- Sing-Box 专用配置 ---

export const SING_BOX_CONFIG = {
    groupNames: {
        proxy: '🚀 代理节点',
        auto: '♻️ 自动延迟',
        direct: '🎯 全球直连'
    }
};

// --- Surge 专用配置 ---

export const SURGE_CONFIG = {
    managedConfig: '#!MANAGED-CONFIG https://example.com/surge.conf',
    general: {
        loglevel: 'notify',
        'dns-server': DEFAULT_DNS.join(', '),
        'skip-proxy': DEFAULT_SKIP_PROXY.join(', ')
    },
    groupNames: {
        proxy: 'Proxy'
    }
};

// --- Loon 专用配置 ---

export const LOON_CONFIG = {
    general: {
        'skip-proxy': DEFAULT_SKIP_PROXY.join(','),
        'dns-server': DEFAULT_DNS.join(', ')
    },
    groupNames: {
        proxy: 'Proxy'
    }
};

// --- QuantumultX 专用配置 ---

export const QX_CONFIG = {
    dns: DEFAULT_DNS.join(', '),
    groupNames: {
        proxy: 'Proxy'
    }
};
