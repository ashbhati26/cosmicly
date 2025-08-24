import AuthGate from "@/components/AuthGate";
import ChatWindow from "@/components/ChatWindow";

export default function Page() {
  return (
    <AuthGate>
      <div className="flex justify-center">
        <ChatWindow />
      </div>
    </AuthGate>
  );
}
