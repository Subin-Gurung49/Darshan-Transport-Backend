const SENSITIVE_KEYWORDS = [
  'password',
  'token',
  'secret',
  'apikey',
  'authorization',
  'credential',
  'db_password',
  'client_secret',
  // Add more specific keys as needed
];

const REDACTION_PLACEHOLDER = '[REDACTED]';

const sanitizeString = (str: string): string => {
  let sanitizedStr = str;
  SENSITIVE_KEYWORDS.forEach(keyword => {
    // Basic keyword match for redaction in strings like "password=value" or "Authorization: Bearer ..."
    // This regex looks for keyword followed by common delimiters and then the value until a common end delimiter or end of line.
    // It's a basic attempt and might need refinement for specific log formats.
    const regex = new RegExp(`(["']?${keyword}["']?\s*[:=]\s*["']?)([^,\s"';&]+)(["']?)`, 'gi');
    sanitizedStr = sanitizedStr.replace(regex, `$1${REDACTION_PLACEHOLDER}$3`);
  });
  return sanitizedStr;
};

export const sanitizeObject = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYWORDS.some(sensitiveKey => lowerKey.includes(sensitiveKey))) {
        sanitized[key] = REDACTION_PLACEHOLDER;
      } else if (key === 'stack' && typeof obj[key] === 'string') {
        // Optionally, shorten or sanitize stack traces if they are too verbose or reveal too much
        sanitized[key] = obj[key].substring(0, 500) + (obj[key].length > 500 ? '...' : '');
      }
      else {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
  }
  return sanitized;
};

export const sanitizeMessageAndMeta = (message: string, meta?: any) => {
  const sanitizedMessage = sanitizeString(message);
  const sanitizedMeta = meta ? sanitizeObject(meta) : undefined;
  return { message: sanitizedMessage, meta: sanitizedMeta };
};
