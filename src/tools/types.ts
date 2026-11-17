import type {ComponentType} from 'react';

export type ToolCategoryId =
  | 'developers'
  | 'converters'
  | 'json'
  | 'images'
  | 'generators'
  | 'docker'
  | 'infra'
  | 'java'
  | 'spring'
  | 'api'
  | 'text'
  | 'crypto'
  | 'network'
  | 'time';

export type ToolId =
  | 'cron-parser'
  | 'curl-converter'
  | 'git-cheatsheet'
  | 'nginx-cheatsheet'
  | 'firewall-cheatsheet'
  | 'linux-log-helper'
  | 'linux-permissions'
  | 'json-csv'
  | 'json-yaml'
  | 'json-xml'
  | 'json-toml'
  | 'yaml-toml'
  | 'color-converter'
  | 'json-formatter'
  | 'json-visualizer'
  | 'json-generator'
  | 'json-diff'
  | 'json-key-fixer'
  | 'jwt-parser'
  | 'qr-code-generator'
  | 'svg-placeholder'
  | 'icon-designer'
  | 'base64-image'
  | 'image-dot-matrix'
  | 'uuid-generator'
  | 'password-generator'
  | 'docker-run-to-compose'
  | 'docker-compose-generator'
  | 'compose-diff'
  | 'docker-cheatsheet'
  | 'nginx-reverse-proxy'
  | 'jar-command-generator'
  | 'spring-env-compare'
  | 'json-field-mapper'
  | 'dns-record-generator'
  | 'http-header-analyzer'
  | 'base64'
  | 'url-codec'
  | 'hash-generator'
  | 'sha-hash'
  | 'hex-codec'
  | 'binary-codec'
  | 'aes-gcm'
  | 'rsa-crypto'
  | 'hmac-generator'
  | 'ip-lookup'
  | 'time-converter';

export type ToolFaq = {
  question: string;
  answer: string;
};

export type ToolDefinition = {
  id: ToolId;
  slug: string;
  title: string;
  summary: string;
  description: string;
  categoryId: ToolCategoryId;
  layout: 'stack' | 'split';
  keywords: string[];
  faqs: ToolFaq[];
  component: ComponentType;
  /** When true, tool may call an external service after user consent. */
  external?: boolean;
};

export type ToolCategory = {
  id: ToolCategoryId;
  label: string;
};
