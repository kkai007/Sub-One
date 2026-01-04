/**
 * ==================== 转换器配置中心 ====================
 * 
 * 统一管理各客户端转换器的默认配置、规则、策略组名称等。
 */

// --- 基础公共配置 (Basic Common Config) ---

/** 
 * 默认连接测试 URL 
 * 用于策略组的自动选择和可用性检测
 */
export const DEFAULT_TEST_URL = 'http://www.gstatic.com/generate_204';

/** 
 * 默认绕过的域名/IP 列表 
 * 包含局域网、保留地址、Tailscale、以及常见的导致回路的域名
 */
export const DEFAULT_SKIP_PROXY = [
    '127.0.0.1',
    '192.168.0.0/16',
    '10.0.0.0/8',
    '172.16.0.0/12',
    '100.64.0.0/10',
    '17.0.0.0/8', // Apple Local
    'localhost',
    '*.local',
    '*.lan',
    '*.ts.net',        // Tailscale
    '*.crashlytics.com',
    '*.adb.com',
    'passenger.t3go.cn'
];

/** 
 * 默认 DNS 服务器 
 * 包含 阿里DNS, DNSPod, Google, Cloudflare
 */
export const DEFAULT_DNS = [
    '223.5.5.5',        // AliDNS
    '119.29.29.29',     // DNSPod
    '114.114.114.114'   // 114 (兜底)
];

// --- Clash 专用配置 ---

export const CLASH_CONFIG = {
    // 基础端口设置
    port: 7890,
    'socks-port': 7891,
    'mixed-port': 7890, // 混合端口 (HTTP+SOCKS5)，现代客户端推荐使用
    'allow-lan': true,  // 允许局域网连接 (标准建议开启)
    'bind-address': '*',

    // 运行模式
    mode: 'Rule',
    'log-level': 'info',
    ipv6: false,        // 默认关闭 IPv6 以提高连接稳定性
    'external-controller': '127.0.0.1:9090',

    // DNS 设置 (Clash 的灵魂)
    // 启用 Fake-IP 模式是现代 Clash 的最佳实践，能极大提升响应速度并防止 DNS 污染
    dns: {
        enable: true,
        listen: ':1053',
        ipv6: false,
        'enhanced-mode': 'fake-ip',
        'fake-ip-range': '198.18.0.1/16',
        'fake-ip-filter': [
            '*.lan',
            'localhost.ptlogin2.qq.com'
        ],
        'default-nameserver': [
            '223.5.5.5',
            '119.29.29.29'
        ],
        nameserver: [
            'https://dns.alidns.com/dns-query',
            'https://doh.pub/dns-query'
        ],
        fallback: [
            'https://1.1.1.1/dns-query',
            'https://8.8.8.8/dns-query'
        ],
        'fallback-filter': {
            geoip: true,
            'geoip-code': 'CN',
            ipcidr: [
                '240.0.0.0/4'
            ]
        }
    },

    groupNames: {
        select: '🚀 节点选择',
        auto: '♻️ 自动选择',
        direct: '🎯 全球直连'
    },
    testUrl: DEFAULT_TEST_URL
};

// --- Sing-Box 专用配置 ---

export const SING_BOX_CONFIG = {
    // 基础日志与网络配置
    log: {
        level: 'info',
        timestamp: true
    },
    experimental: {
        clash_api: {
            external_controller: '127.0.0.1:9090',
            external_ui: 'ui',
            external_ui_download_url: '',
            external_ui_download_detour: 'select',
            default_mode: 'rule'
        },
        cache_file: {
            enabled: true,
            path: 'cache.db',
            store_fakeip: true
        }
    },
    groupNames: {
        proxy: '🚀 代理节点',
        auto: '♻️ 自动选择', // 统一名称
        direct: '🎯 全球直连'
    }
};

// --- Surge 专用配置 ---

export const SURGE_CONFIG = {
    managedConfig: '#!MANAGED-CONFIG https://example.com/surge.conf interval=86400 strict=true',
    general: {
        'loglevel': 'notify',
        'dns-server': DEFAULT_DNS.join(', '),
        'skip-proxy': DEFAULT_SKIP_PROXY.join(', '),
        'ipv6': 'false',
        'allow-wifi-access': 'true',
        'wifi-access-http-port': '6152',
        'wifi-access-socks5-port': '6153',
        'http-listen': '0.0.0.0:6152',
        'socks5-listen': '0.0.0.0:6153',
        'test-timeout': '5',
        'internet-test-url': DEFAULT_TEST_URL,
        'proxy-test-url': DEFAULT_TEST_URL
    },
    groupNames: {
        proxy: 'Proxy',
        auto: 'UrlTest',     // Surge 习惯叫 UrlTest 或 Auto
        direct: 'DIRECT'
    }
};

// --- Loon 专用配置 ---

export const LOON_CONFIG = {
    general: {
        'skip-proxy': DEFAULT_SKIP_PROXY.join(','),
        'dns-server': DEFAULT_DNS.join(', '),
        'ipv6': 'false',
        'allow-udp-proxy': 'true',
        'allow-wifi-access': 'true',
        'wifi-access-http-port': '7222',
        'wifi-access-socks5-port': '7223'
    },
    groupNames: {
        proxy: 'Proxy',
        auto: 'Auto',
        direct: 'DIRECT'
    }
};

// --- QuantumultX 专用配置 ---

export const QX_CONFIG = {
    dns: DEFAULT_DNS.join(', '),
    // QX 额外通用配置
    general: {
        'server_check_url': DEFAULT_TEST_URL,
        'resource_parser_url': 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Proxy.png' // 示例资源解析器
    },
    groupNames: {
        proxy: 'Proxy',
        auto: 'Auto',
        direct: 'direct' // QX 小写
    }
};
