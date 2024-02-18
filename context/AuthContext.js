"use client"

import React from "react"
import firebase_app from "@/firebase/config"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { LucideLoader2 } from "lucide-react"


const auth = getAuth(firebase_app)

export const AuthContext = React.createContext({})

export const useAuthContext = () => React.useContext(AuthContext)

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? (
        <div className=" h-screen w-screen flex items-center justify-center">
          <div className="animate-spin text-3xl">
            <LucideLoader2 size={48} strokeWidth={0.75} />
          </div>
            {/* <Progressloader/> */}
        </div>

      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}
