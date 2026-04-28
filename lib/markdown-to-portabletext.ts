/**
 * Markdown → Sanity Portable Text converter.
 *
 * Handles: headings (h1-h4), paragraphs, bullet/numbered lists, blockquotes,
 * inline marks (strong/em/code/link), tables (→ table object), and code
 * blocks (→ codeBlock object).
 *
 * H1 is preserved as-is; callers that use a separate title field should
 * skip it themselves before passing markdown in.
 */

import { marked } from "marked";

type Token = ReturnType<typeof marked.lexer>[number] & {
  tokens?: Token[];
  items?: Token[];
  href?: string;
  text?: string;
  depth?: number;
  ordered?: boolean;
  rows?: { text: string; tokens?: Token[] }[][];
  header?: { text: string; tokens?: Token[] }[];
  align?: (string | null)[];
  lang?: string;
};

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

interface Span {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

interface MarkDef {
  _type: string;
  _key: string;
  href?: string;
}

interface BlockOut {
  _type: "block";
  _key: string;
  style: string;
  markDefs: MarkDef[];
  children: Span[];
  listItem?: "bullet" | "number";
  level?: number;
}

interface TableOut {
  _type: "table";
  _key: string;
  caption?: string;
  rows: { _key: string; _type: "tableRow"; cells: string[] }[];
}

interface CodeBlockOut {
  _type: "codeBlock";
  _key: string;
  code: string;
  language?: string;
}

export type PortableTextNode = BlockOut | TableOut | CodeBlockOut;

interface InlineState {
  spans: Span[];
  markDefs: MarkDef[];
}

function flattenInlineTokens(tokens: Token[], activeMarks: string[]): InlineState {
  const spans: Span[] = [];
  const markDefs: MarkDef[] = [];

  function pushSpan(text: string, marks: string[]) {
    if (!text) return;
    // Merge with previous span if marks match
    const last = spans[spans.length - 1];
    if (last && JSON.stringify(last.marks) === JSON.stringify(marks)) {
      last.text += text;
      return;
    }
    spans.push({
      _type: "span",
      _key: randomKey(),
      text,
      marks: [...marks],
    });
  }

  function walk(toks: Token[], marks: string[]) {
    for (const t of toks) {
      switch (t.type) {
        case "text": {
          // text tokens may have nested tokens (escaped html, etc.)
          if (t.tokens && t.tokens.length > 0) {
            walk(t.tokens, marks);
          } else {
            pushSpan(decodeEntities(t.text || ""), marks);
          }
          break;
        }
        case "strong":
          if (t.tokens) walk(t.tokens, [...marks, "strong"]);
          else pushSpan(decodeEntities(t.text || ""), [...marks, "strong"]);
          break;
        case "em":
          if (t.tokens) walk(t.tokens, [...marks, "em"]);
          else pushSpan(decodeEntities(t.text || ""), [...marks, "em"]);
          break;
        case "codespan":
          pushSpan(t.text || "", [...marks, "code"]);
          break;
        case "link": {
          const linkKey = randomKey();
          markDefs.push({
            _type: "link",
            _key: linkKey,
            href: t.href || "",
          });
          if (t.tokens) walk(t.tokens, [...marks, linkKey]);
          else pushSpan(decodeEntities(t.text || ""), [...marks, linkKey]);
          break;
        }
        case "br":
          pushSpan("\n", marks);
          break;
        case "del":
          // Strikethrough — we don't support it as a mark; render as plain.
          if (t.tokens) walk(t.tokens, marks);
          break;
        default: {
          // Fall back to raw text if we don't recognize the inline type.
          const fallback = (t.text as string | undefined) || "";
          if (fallback) pushSpan(decodeEntities(fallback), marks);
          break;
        }
      }
    }
  }

  walk(tokens, activeMarks);
  return { spans, markDefs };
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function makeBlock(
  style: string,
  spans: Span[],
  markDefs: MarkDef[],
  listItem?: "bullet" | "number",
  level?: number
): BlockOut {
  return {
    _type: "block",
    _key: randomKey(),
    style,
    markDefs,
    children:
      spans.length > 0
        ? spans
        : [{ _type: "span", _key: randomKey(), text: "", marks: [] }],
    ...(listItem ? { listItem } : {}),
    ...(level ? { level } : {}),
  };
}

function headingStyle(depth: number): string {
  if (depth === 1) return "h1";
  if (depth === 2) return "h2";
  if (depth === 3) return "h3";
  return "h4";
}

function tokenToCellText(tokens: Token[] | undefined, raw: string): string {
  if (!tokens || tokens.length === 0) return raw;
  // Build a flat string with minimal markdown stripped (cells are simple strings)
  return tokens
    .map((t) => {
      if (t.type === "text") return decodeEntities(t.text || "");
      if (t.type === "strong" || t.type === "em") return decodeEntities(t.text || "");
      if (t.type === "codespan") return t.text || "";
      if (t.type === "link") return decodeEntities(t.text || "");
      return decodeEntities((t.text as string | undefined) || "");
    })
    .join("");
}

function processList(token: Token, listItem: "bullet" | "number", level: number, out: PortableTextNode[]) {
  if (!token.items) return;
  for (const item of token.items) {
    const itemTokens = (item as Token).tokens || [];
    // List items can contain paragraphs, nested lists, etc.
    let inlineTokens: Token[] = [];
    const nestedLists: Token[] = [];

    for (const child of itemTokens) {
      if (child.type === "text") {
        // text token here represents the inline content of the list item
        inlineTokens = inlineTokens.concat(child.tokens || [child]);
      } else if (child.type === "paragraph") {
        inlineTokens = inlineTokens.concat(child.tokens || []);
      } else if (child.type === "list") {
        nestedLists.push(child);
      }
    }

    const { spans, markDefs } = flattenInlineTokens(inlineTokens, []);
    out.push(makeBlock("normal", spans, markDefs, listItem, level));

    for (const nested of nestedLists) {
      processList(nested, nested.ordered ? "number" : "bullet", level + 1, out);
    }
  }
}

export function markdownToPortableText(md: string): PortableTextNode[] {
  const tokens = marked.lexer(md) as Token[];
  const out: PortableTextNode[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case "heading": {
        const { spans, markDefs } = flattenInlineTokens(token.tokens || [], []);
        out.push(makeBlock(headingStyle(token.depth || 2), spans, markDefs));
        break;
      }
      case "paragraph": {
        const { spans, markDefs } = flattenInlineTokens(token.tokens || [], []);
        out.push(makeBlock("normal", spans, markDefs));
        break;
      }
      case "blockquote": {
        // Blockquotes can contain paragraphs and other blocks.
        const inner = (token.tokens || []) as Token[];
        // Concatenate inline tokens from contained paragraphs.
        const inlineTokens: Token[] = [];
        for (const child of inner) {
          if (child.type === "paragraph") {
            inlineTokens.push(...(child.tokens || []));
            inlineTokens.push({ type: "br", raw: "\n" } as Token);
            inlineTokens.push({ type: "br", raw: "\n" } as Token);
          }
        }
        // Drop trailing breaks
        while (inlineTokens.length > 0 && inlineTokens[inlineTokens.length - 1].type === "br") {
          inlineTokens.pop();
        }
        const { spans, markDefs } = flattenInlineTokens(inlineTokens, []);
        out.push(makeBlock("blockquote", spans, markDefs));
        break;
      }
      case "list":
        processList(token, token.ordered ? "number" : "bullet", 1, out);
        break;
      case "code": {
        // Fenced code block
        out.push({
          _type: "codeBlock",
          _key: randomKey(),
          code: (token.text as string) || "",
          language: token.lang || undefined,
        });
        break;
      }
      case "table": {
        const headerCells = (token.header || []).map((c) =>
          tokenToCellText(c.tokens, c.text || "")
        );
        const bodyRows = (token.rows || []).map((row) =>
          row.map((c) => tokenToCellText(c.tokens, c.text || ""))
        );
        out.push({
          _type: "table",
          _key: randomKey(),
          rows: [
            {
              _key: randomKey(),
              _type: "tableRow",
              cells: headerCells,
            },
            ...bodyRows.map((cells) => ({
              _key: randomKey(),
              _type: "tableRow" as const,
              cells,
            })),
          ],
        });
        break;
      }
      case "hr":
        // Render as a thin separator paragraph (no native hr in schema).
        out.push(makeBlock("normal", [
          { _type: "span", _key: randomKey(), text: "—", marks: [] },
        ], []));
        break;
      case "space":
      case "html":
        // Skip raw whitespace and HTML tokens.
        break;
      default:
        // Unknown token: best-effort fallback
        if ((token as Token).text) {
          const { spans, markDefs } = flattenInlineTokens([token as Token], []);
          out.push(makeBlock("normal", spans, markDefs));
        }
        break;
    }
  }

  return out;
}
