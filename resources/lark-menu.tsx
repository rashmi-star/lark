import { useState, useEffect } from "react";
import { McpUseProvider, useWidget, useWidgetTheme, type WidgetMetadata } from "mcp-use/react";
import { z } from "zod";
import { LARK_TOOLS, LARK_ICONS } from "../lib/lark-tools";

const propSchema = z.object({
  open: z.boolean().optional().describe("Whether menu is open"),
});

export const widgetMetadata: WidgetMetadata = {
  description: "Lark app launcher - slide menu with all tool icons",
  props: propSchema,
};

type Props = z.infer<typeof propSchema>;

function Icon({ name, size = 20, color = "currentColor" }: { name: string; size?: number; color?: string }) {
  const paths = LARK_ICONS[name] || LARK_ICONS.users;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0 }}
    >
      {paths}
    </svg>
  );
}

function LarkMenuContent() {
  const { displayMode, sendFollowUpMessage, callTool } = useWidget<Props>();
  const theme = useWidgetTheme();
  const isDark = theme === "dark";
  const [expanded, setExpanded] = useState(true);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, Record<string, string>>({});

  const bg = isDark
    ? "linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 100%)"
    : "linear-gradient(135deg, rgba(248,250,252,0.98) 0%, rgba(241,245,249,0.95) 100%)";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div
      style={{
        fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
        background: bg,
        borderRadius: "16px",
        border: `1px solid ${borderColor}`,
        overflow: "hidden",
        boxShadow: isDark ? "0 25px 50px -12px rgba(0,0,0,0.5)" : "0 25px 50px -12px rgba(0,0,0,0.15)",
        maxWidth: expanded ? 320 : 72,
        transition: "max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <style>{`
        @keyframes lark-slide-in {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .lark-tool-item:hover {
          background: ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"} !important;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: expanded ? "16px 18px" : "16px",
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        {expanded && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              L
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: textColor }}>Lark</div>
              <div style={{ fontSize: 11, color: mutedColor, fontWeight: 500 }}>
                {displayMode === "pip" ? "Floating" : displayMode === "fullscreen" ? "Fullscreen" : "Your tools"}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: `1px solid ${borderColor}`,
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: mutedColor,
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expanded ? "rotate(180deg)" : "none" }}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      <div
        style={{
          padding: expanded ? "8px 12px 16px" : "8px",
          maxHeight: 360,
          overflowY: "auto",
        }}
      >
        {LARK_TOOLS.map((tool, i) => {
          const isSelected = selectedTool === tool.id;
          const vals = formValues[tool.id] ?? {};
          const handleIconClick = () => {
            if (tool.noArgs && !tool.mcpQuery && callTool) {
              callTool(tool.id, {}).catch((e) => console.warn("Tool failed:", e));
              return;
            }
            setSelectedTool(isSelected ? null : tool.id);
          };
          const handleFormSubmit = async () => {
            try {
              if (tool.mcpQuery) {
                const query = (vals.query ?? "").trim();
                if (tool.id === "message") {
                  if (query && sendFollowUpMessage) await sendFollowUpMessage(query);
                  else if (callTool) await callTool(tool.mcpQuery.toolName, {});
                } else if (sendFollowUpMessage) {
                  if (tool.id === "music" && query) await sendFollowUpMessage(`play ${query}`);
                  else if (tool.id === "video" && query) await sendFollowUpMessage(`play ${query} on youtube`);
                  else if (callTool && query) await callTool(tool.mcpQuery.toolName, { query });
                } else if (callTool && query) {
                  await callTool(tool.mcpQuery.toolName, { query });
                }
                setFormValues((p) => ({ ...p, [tool.id]: {} }));
                setSelectedTool(null);
                return;
              }
              if (tool.id === "group-call") {
                const toStr = vals.to?.trim() || "";
                const to = toStr ? toStr.split(/[,&]+/).map((s) => s.trim()).filter(Boolean) : [];
                if (to.length && vals.message) {
                  await callTool?.(tool.id, { to, message: vals.message });
                  setFormValues((p) => ({ ...p, [tool.id]: {} }));
                  setSelectedTool(null);
                }
              } else if (tool.fields?.length) {
                const args = tool.fields.reduce((a, f) => ({ ...a, [f.key]: vals[f.key] ?? "" }), {} as Record<string, string>);
                if (Object.values(args).some((v) => v.trim())) {
                  await callTool?.(tool.id, args);
                  setFormValues((p) => ({ ...p, [tool.id]: {} }));
                  setSelectedTool(null);
                }
              }
            } catch (e) {
              console.warn("Lark tool failed:", e);
            }
          };
          return (
            <div key={tool.id} style={{ animation: "lark-slide-in 0.3s ease forwards", animationDelay: `${i * 0.03}s` }}>
              <div
                role="button"
                tabIndex={0}
                onClick={handleIconClick}
                onKeyDown={(e) => e.key === "Enter" && handleIconClick()}
                className="lark-tool-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: expanded ? "10px 12px" : "12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                  background: isSelected ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)") : undefined,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${tool.color}20`,
                    border: `1px solid ${tool.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={tool.icon} size={20} color={tool.color} />
                </div>
                {expanded && (
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{tool.label}</div>
                    <div style={{ fontSize: 11, color: mutedColor }}>
                      {tool.noArgs ? "Click to run" : tool.mcpQuery ? "Click to enter prompt" : "Click to open form"}
                    </div>
                  </div>
                )}
              </div>
              {expanded && isSelected && tool.mcpQuery && (
                <div style={{ padding: "0 12px 12px", paddingLeft: 52, display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="text"
                    value={vals.query ?? ""}
                    onChange={(e) =>
                      setFormValues((p) => ({
                        ...p,
                        [tool.id]: { ...(p[tool.id] ?? {}), query: e.target.value },
                      }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleFormSubmit()}
                    placeholder={tool.mcpQuery.placeholder}
                    autoFocus
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${borderColor}`,
                      background: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)",
                      color: textColor,
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleFormSubmit}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "none",
                      background: tool.color,
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Go
                  </button>
                </div>
              )}
              {expanded && isSelected && tool.fields?.length && !tool.mcpQuery && (
                <div style={{ padding: "0 12px 12px", paddingLeft: 52 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {tool.fields.map((f) => (
                      <input
                        key={f.key}
                        type="text"
                        value={vals[f.key] ?? ""}
                        onChange={(e) =>
                          setFormValues((p) => ({
                            ...p,
                            [tool.id]: { ...(p[tool.id] ?? {}), [f.key]: e.target.value },
                          }))
                        }
                        onKeyDown={(e) => e.key === "Enter" && handleFormSubmit()}
                        placeholder={f.placeholder}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: `1px solid ${borderColor}`,
                          background: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)",
                          color: textColor,
                          fontSize: 13,
                          outline: "none",
                        }}
                      />
                    ))}
                    <button
                      onClick={handleFormSubmit}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 8,
                        border: "none",
                        background: tool.color,
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default function LarkMenu() {
  const { requestDisplayMode } = useWidget<Props>();

  useEffect(() => {
    if (requestDisplayMode) {
      requestDisplayMode("pip").catch(() => {});
    }
  }, [requestDisplayMode]);

  return (
    <McpUseProvider autoSize>
      <LarkMenuContent />
    </McpUseProvider>
  );
}
