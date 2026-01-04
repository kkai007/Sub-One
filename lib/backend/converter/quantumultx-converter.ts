import { ProxyNode, ConverterOptions, VmessNode, VlessNode, TrojanNode, ShadowsocksNode } from '../../shared/types';
import { QX_CONFIG } from './config';

export function toQuantumultX(nodes: ProxyNode[], _options: ConverterOptions = {}): string {
    const lines: string[] = [];

    lines.push('[general]');
    lines.push('server_check_url=http://www.apple.com/generate_204');
    lines.push(`dns_server=${QX_CONFIG.dns}`);
    lines.push('');
    lines.push('[server_local]');

    for (const node of nodes) {
        const line = nodeToQuantumultXLine(node);
        if (line) {
            lines.push(line);
        }
    }

    lines.push('');
    lines.push('[filter_local]');
    lines.push('host-suffix, local, direct');
    lines.push('geoip, cn, direct');
    lines.push(`final, ${QX_CONFIG.groupNames.proxy}`);
    lines.push('');
    lines.push('[policy]');

    return lines.join('\n');
}

function nodeToQuantumultXLine(node: ProxyNode): string | null {
    try {
        switch (node.type) {
            case 'vmess': return buildVmess(node as VmessNode);
            case 'vless': return buildVless(node as VlessNode);
            case 'trojan': return buildTrojan(node as TrojanNode);
            case 'ss': return buildShadowsocks(node as ShadowsocksNode);
            default:
                // QX 不支持 Hy2, Tuic, WG 原生配置行格式 (或者比较非标准)
                return null;
        }
    } catch (e) {
        console.warn(`QuantumultX 转换失败: ${node.name}`, e);
        return null;
    }
}

function buildVmess(node: VmessNode): string {
    const parts: string[] = [];
    parts.push(`vmess=${node.server}:${node.port}`);
    parts.push(`method=${node.cipher || 'none'}`);
    parts.push(`password=${node.uuid}`);

    const hasTLS = node.tls?.enabled;
    const network = node.transport?.type || 'tcp';

    if (network === 'ws') {
        parts.push(hasTLS ? 'obfs=wss' : 'obfs=ws');
        if (node.transport?.headers?.Host) parts.push(`obfs-host=${node.transport.headers.Host}`);
        if (node.transport?.path) parts.push(`obfs-uri=${node.transport.path}`);
    } else if (network === 'tcp') {
        if (hasTLS) {
            parts.push('obfs=over-tls');
            if (node.tls?.serverName) parts.push(`obfs-host=${node.tls.serverName}`);
        }
    }

    parts.push('fast-open=false');
    parts.push('udp-relay=true');
    parts.push(`tag=${node.name}`);

    return parts.join(', ');
}

function buildVless(node: VlessNode): string {
    // QX VLESS support is limited or requires specific syntax
    const parts: string[] = [];
    parts.push(`vless=${node.server}:${node.port}`);
    parts.push('method=none');
    parts.push(`password=${node.uuid}`);

    const hasTLS = node.tls?.enabled;
    // Reality not supported in QX standard config yet? QX handles XTLS/TLS. 
    // We treat Reality as TLS here but it might fail connection in QX if QX lacks Reality support.

    const network = node.transport?.type || 'tcp';

    if (network === 'ws') {
        parts.push(hasTLS ? 'obfs=wss' : 'obfs=ws');
        if (node.transport?.headers?.Host) parts.push(`obfs-host=${node.transport.headers.Host}`);
        if (node.transport?.path) parts.push(`obfs-uri=${node.transport.path}`);
    } else if (network === 'tcp') {
        if (hasTLS) {
            parts.push('obfs=over-tls');
            if (node.tls?.serverName) parts.push(`obfs-host=${node.tls.serverName}`);
        }
    }

    if (hasTLS && node.tls?.insecure) {
        parts.push('tls-verification=false');
    }

    parts.push('fast-open=false');
    parts.push('udp-relay=false');
    parts.push(`tag=${node.name}`);

    return parts.join(', ');
}

function buildTrojan(node: TrojanNode): string {
    const parts: string[] = [];
    parts.push(`trojan=${node.server}:${node.port}`);
    parts.push(`password=${node.password}`);
    parts.push('over-tls=true');

    if (node.tls?.serverName) parts.push(`tls-host=${node.tls.serverName}`);
    if (node.tls?.insecure) parts.push('tls-verification=false');
    else parts.push('tls-verification=true');

    parts.push('fast-open=false');
    parts.push('udp-relay=true');
    parts.push(`tag=${node.name}`);

    return parts.join(', ');
}

function buildShadowsocks(node: ShadowsocksNode): string {
    const parts: string[] = [];
    parts.push(`shadowsocks=${node.server}:${node.port}`);
    parts.push(`method=${node.cipher}`);
    parts.push(`password=${node.password}`);

    if (node.plugin && node.plugin.includes('obfs')) {
        const opts = node.pluginOpts || {};
        if (opts.obfs) parts.push(`obfs=${opts.obfs}`);
        if (opts['obfs-host']) parts.push(`obfs-host=${opts['obfs-host']}`);
    }

    parts.push('fast-open=false');
    parts.push('udp-relay=true');
    parts.push(`tag=${node.name}`);

    return parts.join(', ');
}
