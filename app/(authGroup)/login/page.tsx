import LoginForm from "../_components/LoginForm"
import { ActionToast } from "@/app/_components/ActionToast"

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-b from-primary/10 to-transparent px-4 py-16">
      <ActionToast
        toasts={[{ param: "registered", type: "success", message: "Account created! Please log in." }]}
      />
      <LoginForm />
    </div>
  )
}
