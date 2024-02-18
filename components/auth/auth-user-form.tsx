"use client"

import * as React from "react"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import signIn from "@/firebase/auth/signin"
import signUp from "@/firebase/auth/signup"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuid } from 'uuid'
import { useAuthContext } from "@/context/AuthContext"
import addData from "@/firebase/firestore/addData"
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore"
import firebase_app from "@/firebase/config"
import Link from "next/link"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: string,

}

interface AuthContextType {
  user: any; // Replace 'any' with the actual type of 'user'
}


export function UserAuthForm({ className, type, ...props }: UserAuthFormProps) {
  const auth = getAuth(firebase_app)
  const provider = new GoogleAuthProvider();
  const { user } = useAuthContext() as AuthContextType

  const db = getFirestore(firebase_app)

  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [Email, setEmail] = React.useState<string>('')
  const [Username, setUsername] = React.useState<string>('')
  const [dispalyname, setDisplayname] = React.useState<string>('')
  const [city, setcity] = React.useState<string>('')
  const [Password, setPassword] = React.useState<string>('')
  const { toast } = useToast()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    if (type === "Login") {
      const { result, error } = await signIn(Email, Password)
      if (error) {
        toast({
          title: "Error",
          description: "Invalide email or password",

        })
      }

    } else {
      if (Username !== dispalyname) {
        const { result, error } = await signUp(Email, Password)

        if (error) {
          toast({
            title: "Error",
            description: "Email already exist / Password should be minimum 8 characters",

          })
        }
        else {
          toast({
            title: "Success",
            description: "Account created successfully",
          })
          await addData("users", result?.user.uid, {
            displayname: Username,
            uid: result?.user.uid,
          })
          await addData("user&editor", result?.user.uid, {})
        }
      } else {
        toast({
          title: "Error",
          description: "Username taken!",
        })
      }


    }
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  async function fetchDisplayname() {
    const q = query(collection(db, "users"), where("displayname", "==", Username));
    try {

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setDisplayname(doc.get("displayname"))
      })

    } catch (error) {
      console.log(error)
    }
  }

  async function GoogleSignIn() {
    const result = signInWithPopup(auth, provider);
    if (result&&(await result).user) {
      await addData("users", (await result).user.uid, {
        uid: (await result).user.uid,
        dispalyname:(await result).user.displayName,
        email:(await result).user.email,
        name:(await result).user.displayName,
        photourl:(await result).user.photoURL,
        city:city
      })
      await addData("channels", city, {})
    }

  }

  React.useEffect(() => {
    fetchDisplayname()
    if (user && user.uid) {
      router.push(`/dashboard/${uuid()}`)
    }
  }, [user, Username])

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          {type !== "Login" && <div className="grid gap-1">
            <Label className="sr-only" htmlFor="username">
              Username
            </Label>
            <Input
              defaultValue={Username}
              required
              onChange={event => setUsername(event.target.value)}
              id="username"
              placeholder="Username"
              type="text"
              autoComplete="username"
              autoCapitalize="on"
              disabled={isLoading}
            />
          </div>}
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              defaultValue={Email}
              required
              onChange={event => setEmail(event.target.value)}
              id="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="pass">
              Password
            </Label>
            <Input
              id="pass"
              required
              defaultValue={Password}
              onChange={event => setPassword(event.target.value)}
              type="password"
              placeholder="Password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spin className="mr-2 h-4 w-4 animate-spin" />
            )}
            {type}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 ">
            OR
          </span>
        </div>
      </div>
<div className="flex gap-2 flex-col" >
      {type==='Login' &&           
      <div className="">
            <Label className="sr-only" htmlFor="city">
              Enter your city
            </Label>
            <Input
              id="city"
              required
              defaultValue={city}
              onChange={event => setcity(event.target.value)}
              type="text"
              placeholder="Enter your city"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>}
          <Button disabled={city === ""} className={buttonVariants({ variant: "outline" })} onClick={GoogleSignIn}>
        {isLoading ? (
          <Icons.spin className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          ""
        )}{" "}
        Google
      </Button></div>
    </div>
  )
}