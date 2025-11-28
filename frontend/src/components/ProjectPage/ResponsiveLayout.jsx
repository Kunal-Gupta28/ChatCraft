import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Code2 } from "lucide-react";
import Chat from "./Chat/Chat";
import CodeEditor from "./Code/CodeEditor";

const ResponsiveLayout = ({
  messages,
  handleSend,
  inputMessage,
  setInputMessage,
  fileTree,
  webContainer,
}) => {
  const [activeTab, setActiveTab] = useState("editor");

  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full flex flex-col lg:flex-row gap-4 px-4 pt-4 pb-20 lg:pb-4 overflow-hidden bg-gray-950 text-white relative">
      {/* Chat box */}
      <motion.section
        className={`flex flex-col bg-gray-900/80 border border-gray-800 rounded-2xl shadow-lg ${activeTab === "chat" ? "flex" : "hidden lg:flex"} flex-1 lg:basis-1/4 2xl:basis-1/5 min-h-[40vh]`}
      >
        <Chat
          messages={messages}
          handleSend={handleSend}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
        />
      </motion.section>

      {/* Code Editor  */}
      <motion.section
        className={`bg-gray-900/80 border border-gray-800 rounded-2xl backdrop-blur-md shadow-lg overflow-hidden
        ${activeTab === "editor" ? "flex" : "hidden lg:flex"} 
        flex-1 lg:basis-3/4 2xl:basis-4/5`}
      >
        <CodeEditor fileTree={fileTree} webContainer={webContainer} />
      </motion.section>

      {/* Bottom Navigation Bar for Mobile and tablet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-xl border-t border-gray-700 flex justify-around py-3 z-50">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex flex-col items-center gap-1 ${activeTab === "chat" ? "text-blue-400" : "text-gray-400"}`}
        >
          <MessageSquare className="w-6 h-6" />
          <span className="text-xs">Chat</span>
        </button>

        <button
          onClick={() => setActiveTab("editor")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "editor" ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <Code2 className="w-6 h-6" />
          <span className="text-xs">Code</span>
        </button>
      </div>
    </div>
  );
};

export default ResponsiveLayout;
