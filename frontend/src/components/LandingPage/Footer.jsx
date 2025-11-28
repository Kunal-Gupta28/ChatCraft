const Footer = () => {
  return (
    <footer className="bg-gray-950 py-12 border-t border-gray-800 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-8 mb-8">

        {/* heading ad paragraph */}
        <div>
          {/* heading */}
          <h4 className="font-bold text-white mb-4">ChatCraft</h4>

          {/* paragraph */}
          <p>Collaborative, AI-powered, in-browser development for modern teams.</p>
        </div>

        {/* Footer column list */}
        <FooterColumn title="Product" links={["Features", "Pricing", "Integrations"]} />
        <FooterColumn title="Company" links={["About Us", "Careers", "Blog"]} />
        <FooterColumn title="Support" links={["Help Center", "Contact Us", "Privacy Policy"]} />

      </div>

      {/* Copyright */}
      <div className="text-center border-t border-gray-800 pt-6">
        <p>&copy; {new Date().getFullYear()} ChatCraft. All rights reserved.</p>
      </div>
    </footer>
  );
};

// footer column
const FooterColumn = ({ title, links }) => (
  <div>

    {/* heading */}
    <h4 className="font-bold text-white mb-4">{title}</h4>

    {/* list */}
    <ul>
      {links.map((l, index) => (
        <li key={index} className="mb-2 hover:text-blue-400 cursor-pointer">{l}</li>
      ))}
    </ul>
  </div>
);

export default Footer;
