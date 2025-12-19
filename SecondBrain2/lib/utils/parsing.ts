// パース関連ユーティリティ

/**
 * JSON文字列からコードブロックや余分な文字を除去
 */
export function cleanJsonText(text: string): string {
  // コードブロック記法を除去
  let cleaned = text.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();
  
  // JSONオブジェクトの開始位置を探す
  const jsonStart = cleaned.indexOf('{');
  if (jsonStart > 0) {
    cleaned = cleaned.substring(jsonStart);
  }
  
  // JSONオブジェクトの終了位置を探す（最後の } を探す）
  const lastBrace = cleaned.lastIndexOf('}');
  if (lastBrace > 0 && lastBrace < cleaned.length - 1) {
    cleaned = cleaned.substring(0, lastBrace + 1);
  }
  
  return cleaned.trim();
}

/**
 * JSON文字列を安全にパース
 */
export function parseJsonSafely<T>(text: string): T | null {
  try {
    const cleaned = cleanJsonText(text);
    if (!cleaned) {
      return null;
    }
    return JSON.parse(cleaned) as T;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      const cleaned = cleanJsonText(text);
      console.error('JSON parse error:', error);
      console.error('Cleaned text:', cleaned.substring(0, 200));
    }
    return null;
  }
}
