import {
  Folder, FolderOpen, FileCode2, FileJson, FileText, Image as ImageIcon,
  File, Settings, Route, Database, Server, Layers, Package, Globe, Code2
} from "lucide-react";

export const getFileIcon = (filename = "") => {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'js': case 'jsx': case 'ts': case 'tsx': case 'html': case 'css':
      return <FileCode2 size={14} className="flex-shrink-0 text-blue-400" />;
    case 'json':
      return <FileJson size={14} className="flex-shrink-0 text-emerald-400" />;
    case 'md': case 'txt': case 'csv':
      return <FileText size={14} className="flex-shrink-0 text-slate-400" />;
    case 'png': case 'jpg': case 'jpeg': case 'svg': case 'gif':
      return <ImageIcon size={14} className="flex-shrink-0 text-purple-400" />;
    default:
      return <File size={14} className="flex-shrink-0 text-slate-400" />;
  }
};

export const getFolderIcon = (name = "", isOpen) => {
  const iconSize = 14;
  const folderName = name.toLowerCase();
  if (folderName === 'config') return <Settings size={iconSize} className="flex-shrink-0 text-slate-400" />;
  if (folderName === 'controllers') return <Code2 size={iconSize} className="flex-shrink-0 text-blue-400" />;
  if (folderName === 'models') return <Database size={iconSize} className="flex-shrink-0 text-emerald-400" />;
  if (folderName === 'routes') return <Route size={iconSize} className="flex-shrink-0 text-purple-400" />;
  if (folderName === 'services') return <Server size={iconSize} className="flex-shrink-0 text-amber-500" />;
  if (folderName === 'middlewares') return <Layers size={iconSize} className="flex-shrink-0 text-orange-400" />;
  if (folderName === 'node_modules') return <Package size={iconSize} className="flex-shrink-0 text-red-400" />;
  if (folderName === 'public') return <Globe size={iconSize} className="flex-shrink-0 text-cyan-400" />;
  if (folderName === 'src') return <FolderOpen size={iconSize} className="flex-shrink-0 text-indigo-400" />;

  return isOpen ? <FolderOpen size={iconSize} className="flex-shrink-0 text-amber-400" /> : <Folder size={iconSize} className="flex-shrink-0 text-amber-400" />;
};
