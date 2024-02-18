"use client"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "./ui/avatar"
  import { Button } from "./ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu"
  import { GoogleAuthProvider, getAuth, signOut } from "firebase/auth";
import firebase_app from "@/firebase/config";
import { useAuthContext } from "@/context/AuthContext";
import React from "react";
import { useRouter } from "next/router";

interface AuthContextType {
  user: any; // Replace 'any' with the actual type of 'user'
}


  export function UserNav() {

    const { user } = useAuthContext() as AuthContextType;
    const auth = getAuth(firebase_app);
    const provider = new GoogleAuthProvider();
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" alt="@shadcn" />
              <AvatarFallback>{user.displayName.slice(0,2)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onClick={() => signOut(auth) } >
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }