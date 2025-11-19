import React from 'react';
import { motion } from 'framer-motion';
import { Users, Bot, Terminal, ArrowRight, Zap, Lightbulb, Code, Rocket } from 'lucide-react';


const Landingpage = () => {

  // Navigates from the landing page to the login page.
  const handleNavigate = (path) => {
    window.location.href = path;
  };

  // containerVariants mock data
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  // itemVariants mock data
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  // features mock data
  const features = [
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description:
        'Code, chat, and debug with your team in a shared workspace. See every change live and build in perfect sync.',
    },
    {
      icon: Bot,
      title: 'AI Co-Pilot & Automation',
      description:
        'Leverage generative AI to write code, find bugs, refactor, and brainstorm new features, all within your editor.',
    },
    {
      icon: Terminal,
      title: 'In-Browser Development',
      description:
        "Run your projects instantly in a sandboxed browser environment. No complex setup or 'npm install' required.",
    },
  ];

  // howItWorks mock data
  const howItWorks = [
    {
      icon: Lightbulb,
      title: 'Ideate & Plan',
      description:
        'Start a new project or join an existing one. Use AI to brainstorm ideas, generate initial code structures, or define project requirements collaboratively.',
    },
    {
      icon: Code,
      title: 'Develop & Collaborate',
      description:
        'Write code with your team in real-time. Get AI suggestions, refactor code, and debug together in a seamless, shared environment.',
    },
    {
      icon: Rocket,
      title: 'Run & Iterate',
      description:
        'Execute your code directly in the browser. See instant results, test features, and iterate rapidly without ever leaving ChatCraft.',
    },
  ];

  // testimonials mock data
  const testimonials = [
    {
      quote:
        'ChatCraft transformed our team’s workflow. The AI assistance and real-time collaboration are game-changers!',
      author: 'Jane Doe',
      title: 'CTO at InnovateCo',
    },
    {
      quote:
        'Finally, a platform that lets us build and test without environmental headaches. It just works!',
      author: 'John Smith',
      title: 'Lead Developer at Tech Solutions',
    },
    {
      quote:
        'The best collaborative coding experience I’ve had. The AI suggestions are surprisingly accurate and helpful.',
      author: 'Emily White',
      title: 'Full-stack Engineer',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden relative select-none">

      {/* Gradient background blobs */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-r from-blue-700 to-purple-700 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-gradient-to-bl from-green-500 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-10">
        
        {/* logo */}
        <div className="text-2xl md:text-3xl font-bold flex items-center">
          <Zap className="text-blue-400 mr-2" />
          ChatCraft
        </div>

        {/* Navigates to the login page. */}
        <button
          onClick={() => handleNavigate('/login')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
        >
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative py-24 md:py-32 bg-gradient-to-br from-gray-950 to-gray-900 text-center">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>

            {/* heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-extrabold leading-tight"
            >
              Craft, Collaborate, and Run.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                All with AI.
              </span>
            </motion.h1>

            {/* paragraph */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-base md:text-lg text-gray-300 max-w-2xl mx-auto"
            >
              ChatCraft is a collaborative coding platform powered by AI — create, test, and run
              your projects directly in the browser. No setup. No barriers. Just pure creativity.
            </motion.p>

            {/* Navigate to login page */}
            <motion.button
              variants={itemVariants}
              onClick={() => handleNavigate('/login')}
              className="mt-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 md:px-10 md:py-4 rounded-lg text-lg transition-transform duration-300 transform hover:scale-105 shadow-lg inline-flex items-center"
            >
              Start Crafting <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-gray-900 py-20 relative">
        <div className="max-w-7xl mx-auto px-6">

          {/* heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">A New Way to Build</h2>

          {/* feature descripton */}
          <motion.div
            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-2"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 w-14 h-14 rounded-full flex items-center justify-center mb-5 shadow-md">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How ChatCraft Works</h2>

          {/* how its works description */}
          <motion.div
            className="grid sm:grid-cols-1 md:grid-cols-3 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-6 rounded-xl border border-gray-800 hover:border-purple-500 bg-gray-900/70 backdrop-blur-md transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  <step.icon className="w-16 h-16 p-3 rounded-full bg-purple-900/50 border border-purple-700 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Our Users Say</h2>

          {/* user's comments */}
          <motion.div
            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl border border-gray-700 hover:border-green-500 hover:-translate-y-2 transition-all duration-300"
              >
                <p className="text-gray-300 italic mb-6">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-blue-400">{t.author}</p>
                  <p className="text-sm text-gray-500">{t.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-700 to-purple-800 py-20 text-center relative">
        <motion.div
          className="max-w-4xl mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >

          {/* heading */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-extrabold mb-6"
          >
            Ready to Revolutionize Your Workflow?
          </motion.h2>

          {/* paragraph text */}
          <motion.p variants={itemVariants} className="text-lg text-blue-100 mb-10">
            Join ChatCraft and experience the future of collaborative, AI-powered development.
          </motion.p>

          {/* navigate to login page */}
          <motion.button
            variants={itemVariants}
            onClick={() => handleNavigate('/login')}
            className="bg-white text-purple-700 hover:bg-gray-100 font-bold px-8 py-4 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg inline-flex items-center"
          >
            Get Started Free <ArrowRight className="ml-3 h-6 w-6" />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-12 border-t border-gray-800 text-gray-400 text-sm">

        {/* links */}
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* column 1 */}
          <div>

            {/* heading */}
            <h4 className="font-bold text-white mb-4">ChatCraft</h4>

            {/* paragraph */}
            <p>Collaborative, AI-powered, in-browser development for modern teams.</p>
          </div>

          {/* column 2 */}
          <div>

            {/* heading */}
            <h4 className="font-bold text-white mb-4">Product</h4>

            {/* list */}
            <ul>
              <li className="mb-2 hover:text-blue-400 cursor-pointer">Features</li>
              <li className="mb-2 hover:text-blue-400 cursor-pointer">Pricing</li>
              <li className="mb-2 hover:text-blue-400 cursor-pointer">Integrations</li>
            </ul>
          </div>

          {/* column 3 */}
          <div>

            {/* heading */}
            <h4 className="font-bold text-white mb-4">Company</h4>

            {/* list */}
            <ul>
              <li className="mb-2 hover:text-blue-400 cursor-pointer">About Us</li>
              <li className="mb-2 hover:text-blue-400 cursor-pointer">Careers</li>
              <li className="mb-2 hover:text-blue-400 cursor-pointer">Blog</li>
            </ul>
          </div>

          {/* column 4 */}
          <div>

            {/* heading */}
            <h4 className="font-bold text-white mb-4">Support</h4>

            {/* list */}
            <ul>
              <li className="mb-2 hover:text-blue-400 cursor-pointer">Help Center</li>
              <li className="mb-2 hover:text-blue-400 cursor-pointer">Contact Us</li>
              <li className="mb-2 hover:text-blue-400 cursor-pointer">Privacy Policy</li>
            </ul>
          </div>
        </div>

        {/* copyright policy */}
        <div className="text-center border-t border-gray-800 pt-6">
          <p>&copy; {new Date().getFullYear()} ChatCraft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landingpage;
