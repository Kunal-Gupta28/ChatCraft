// footer column
const FooterColumn = ({ title, links }) => (
  <div>

    {/* heading */}
    <h4 className="font-bold text-white mb-4">{title}</h4>

    {/* list */}
    <ul>
      {links.map((link) => (
        <li key={link} className="mb-2 hover:text-blue-400 cursor-pointer">{link}</li>
      ))}
    </ul>
  </div>
);

export default FooterColumn;