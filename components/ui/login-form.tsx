'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"
import { useAuth } from '@/lib/context/AuthContext'
import { useCookies } from 'react-cookie'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [emailValue, setEmailValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")
  const [passWarning, setPassWarning] = useState(false)
  const { login } = useAuth()
  const [cookies, setCookie] = useCookies(['name','role','email'])  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
        }),
      })

      const data = await res.json()
      console.log("Login response:", data)

      if (res.ok) {
        await login(data)

        console.log("Setting cookies:", { data })
        setCookie('name', data.user.name, { path: '/' })
        setCookie('role', data.user.role, { path: '/' })
        setCookie('email', data.user.email, { path: '/' })
        window.location.href = '/luxuryvibesstay/Dashboard'
      } else {
        console.error("Login failed:", data.message)
        setPassWarning(true)
      }
    } catch (err) {
      console.error("Login error:", err)
      setPassWarning(true)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Analytics Dashboard
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  required
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <button
                    onClick={() => alert('Please contact a manager to reset your password.')}
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                />
                {passWarning && (
                  <p className="text-red-500 text-sm mt-1">
                    Incorrect email or password
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Contact a Manager
                </a>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
              alt="Login"
              src="/nirvana-12.webp"
              fill
              className="object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
