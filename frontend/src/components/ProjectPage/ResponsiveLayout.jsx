import { useState, useCallback, memo } from "react";
import { MessageSquare, Code2 } from "lucide-react";
import Chat from "./Chat/Chat";
import CodeEditor from "./Code/CodeEditor";

const ResponsiveLayout = () => {
  const [activeTab, setActiveTab] = useState("editor");
  const [isChatVisible, setIsChatVisible] = useState(true);

  const isChatActive = activeTab === "chat";
  const isEditorActive = activeTab === "editor";

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatVisible((prev) => !prev);
  }, []);

  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full flex flex-col lg:flex-row gap-2.5 sm:gap-3 p-2.5 sm:p-3 overflow-hidden bg-[#05070d] text-white relative select-none">
      {/* Left Chat & Collaborators Panel */}
      <section
        className={`flex flex-col bg-[#090d16]/90 border border-slate-800/80 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden transition-all duration-300 ${
          isChatVisible
            ? isChatActive
              ? "flex w-full lg:w-[340px] xl:w-[380px]"
              : "hidden lg:flex lg:w-[340px] xl:w-[380px]"
            : "hidden"
        } shrink-0 min-h-[40vh]`}
      >
        <Chat toggleChat={toggleChat} isChatVisible={isChatVisible} />
      </section>

      {/* Main Code Editor & Preview Panel */}
      <section
        className={`bg-[#080b11]/90 border border-slate-800/80 rounded-2xl backdrop-blur-2xl shadow-2xl overflow-hidden flex-1 min-w-0 flex flex-col ${
          isEditorActive ? "flex" : "hidden lg:flex"
        }`}
      >
        <CodeEditor toggleChat={toggleChat} isChatVisible={isChatVisible} />
      </section>

      {/* Bottom Navigation Bar for Mobile and Tablet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#090d16]/95 backdrop-blur-2xl border-t border-slate-800 flex justify-around py-3 z-50">
        <button
          type="button"
          onClick={() => handleTabChange("chat")}
          aria-label="Open chat"
          className={`flex flex-col items-center gap-1 transition ${
            isChatActive ? "text-blue-400 font-bold" : "text-slate-400"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[11px]">Chat</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("editor")}
          aria-label="Open code editor"
          className={`flex flex-col items-center gap-1 transition ${
            isEditorActive ? "text-blue-400 font-bold" : "text-slate-400"
          }`}
        >
          <Code2 className="w-5 h-5" />
          <span className="text-[11px]">Code</span>
        </button>
      </div>
    </div>
  );
};

export default memo(ResponsiveLayout);
