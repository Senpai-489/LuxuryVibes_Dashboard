import { LoginForm } from "@/components/ui/login-form"
import { useCookies } from "react-cookie"
export default function LoginPage() {

  // const [cookies, setCookie, removeCookie] = useCookies(['name','role']);
  // removeCookie('name');
  // removeCookie('role');
  // console.log("Cookies on Login Page:", cookies);
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}
