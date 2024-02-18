"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { useAuthContext } from "@/context/AuthContext"
import addData from "@/firebase/firestore/addData"

interface AuthContextType {
    user: any; // Replace 'any' with the actual type of 'user'
  }

const FormSchema = z.object({
    is_anonymous: z.enum(["yes", "no"], {
        required_error: "You need to select a option.",
    }),
})

export function Anonymous({setCurrForm}) {
    const { user } = useAuthContext() as AuthContextType
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
         await addData("users", user.uid, {
            isAnonymous:data.is_anonymous})
                setCurrForm("1")
            
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="is_anonymous"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Do you want to remain anonymous?</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="yes" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Yes
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="no" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                No
                                            </FormLabel>
                                        </FormItem>
                                        
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>


        </>
    )
}
