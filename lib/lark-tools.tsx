import type { JSX } from "react";

export type FormField = { key: string; label: string; placeholder: string; type?: "text" | "textarea" };

export type ToolEntry = {
  id: string;
  label: string;
  icon: string;
  color: string;
  prompt?: string;
  fields?: FormField[];
  noArgs?: boolean;
  mcpQuery?: { toolName: string; placeholder: string };
};

export type McpToolEntry = {
  id: string;
  label: string;
  icon: string;
  color: string;
  toolName: string;
  placeholder: string;
  argKey?: string;
};

export const LARK_TOOLS: ToolEntry[] = [
  {
    id: "add-contact",
    label: "Add Contact",
    icon: "user-plus",
    color: "#10b981",
    prompt: "add contact [name] [phone]",
    fields: [
      { key: "name", label: "Name", placeholder: "Contact name" },
      { key: "phone", label: "Phone", placeholder: "+1234567890" },
    ],
  },
  { id: "list-contacts", label: "Contacts", icon: "users", color: "#3b82f6", prompt: "list contacts", noArgs: true },
  {
    id: "remove-contact",
    label: "Remove Contact",
    icon: "user-minus",
    color: "#ef4444",
    prompt: "remove contact [name]",
    fields: [{ key: "name", label: "Name", placeholder: "Contact to remove" }],
  },
  {
    id: "make-call",
    label: "Call",
    icon: "phone",
    color: "#22c55e",
    prompt: "call [name] and say [message]",
    fields: [
      { key: "to", label: "To", placeholder: "Name or phone" },
      { key: "message", label: "Message", placeholder: "What to say" },
    ],
  },
  {
    id: "send-sms",
    label: "SMS",
    icon: "message",
    color: "#6366f1",
    prompt: "send sms to [name] [message]",
    fields: [
      { key: "to", label: "To", placeholder: "Name or phone" },
      { key: "message", label: "Message", placeholder: "Text to send" },
    ],
  },
  { id: "open-camera", label: "Camera", icon: "camera", color: "#06b6d4", prompt: "open camera", noArgs: true },
  {
    id: "group-call",
    label: "Group Call",
    icon: "phone-call",
    color: "#f59e0b",
    prompt: "group call [names] and say [message]",
    fields: [
      { key: "to", label: "Names", placeholder: "Name1, Name2, Name3" },
      { key: "message", label: "Message", placeholder: "What to say" },
    ],
  },
  {
    id: "music",
    label: "Music",
    icon: "music",
    color: "#ec4899",
    mcpQuery: { toolName: "music-player-mcp__play", placeholder: "Search or play a song..." },
  },
  {
    id: "video",
    label: "YouTube",
    icon: "video",
    color: "#ef4444",
    mcpQuery: { toolName: "youtube-mcp__play", placeholder: "Search or play a video..." },
  },
  {
    id: "message",
    label: "Agent Chat",
    icon: "message-square",
    color: "#8b5cf6",
    mcpQuery: { toolName: "agent-chat-mcp__list-agents", placeholder: "e.g. list agents, read inbox as [name]..." },
  },
];

export const LARK_MCP_TOOLS: McpToolEntry[] = [];

export const LARK_ICONS: Record<string, JSX.Element> = {
  "user-plus": (
    <>
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </>
  ),
  "user-minus": (
    <>
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  ),
  message: (
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  ),
  camera: (
    <>
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  "phone-call": (
    <>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
      <path d="M16 8a2 2 0 014 0v1a2 2 0 01-2 2h-1" />
    </>
  ),
  "message-square": (
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  ),
  send: (
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  ),
  inbox: (
    <path d="M22 12h-6l-2 3H10l-2-3H2" />
  ),
  music: (
    <>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </>
  ),
  list: (
    <>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1.5" fill="none" />
      <circle cx="4" cy="12" r="1.5" fill="none" />
      <circle cx="4" cy="18" r="1.5" fill="none" />
    </>
  ),
  video: (
    <>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </>
  ),
};
