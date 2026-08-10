import { memo } from "react";

const FooterColumn = ({ title, links }) => (
  <div>
    <h4 className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
      {title}
    </h4>
    <ul className="space-y-2">
      {links.map((link) => (
        <li
          key={link}
          className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
        >
          {link}
        </li>
      ))}
    </ul>
  </div>
);

export default memo(FooterColumn);