import { useState } from "react";
import Window from "./Window";

interface NotepadProps {
  onClose: () => void;
}

function Notepad({ onClose }: NotepadProps) {
  const [content, setContent] = useState("Welcome to Notepad!\n\nStart typing your notes here...");
  const [fontSize, setFontSize] = useState(14);

  return (
    <Window title="Notepad" onClose={onClose} width={700} height={500}>
      <div className="notepad-toolbar">
        <div className="font-controls">
          <label>Font Size:</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          >
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
            <option value={20}>20px</option>
          </select>
        </div>
        <div className="file-controls">
          <button onClick={() => setContent("")}>New</button>
          <button onClick={() => navigator.clipboard.writeText(content)}>Copy All</button>
          <button onClick={() => {
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'note.txt';
            a.click();
            URL.revokeObjectURL(url);
          }}>Save</button>
        </div>
      </div>
      <textarea
        className="notepad-editor"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ fontSize: `${fontSize}px` }}
        placeholder="Start typing..."
      />
    </Window>
  );
}

export default Notepad;
