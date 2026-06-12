import { ChatProvider } from "../../contexts/chat.context";
import { CodeEditorProvider } from "../../contexts/codeEditor.context";
import { MessagesProvider } from "../../contexts/Messages.context";

const ProjectProviders = ({ children }) => {
  return (
    <MessagesProvider>
      <ChatProvider>
        <CodeEditorProvider>
          {children}
        </CodeEditorProvider>
      </ChatProvider>
    </MessagesProvider>
  );
};

export default ProjectProviders;