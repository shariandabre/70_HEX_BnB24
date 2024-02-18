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
import { CorruptionType } from "./formCoponent/corruption-type"
import { CorruptionSector } from "./formCoponent/corruption-sector"
import { IncidentReportForm } from "./formCoponent/report"
import { Anonymous } from "./formCoponent/radio-group"
import { useState } from "react"

export function DisplayForm() {
const [currForm,setCurrForm]=useState<string>('0');

    return (
        <>
            <div>
                <h3 className="text-lg font-medium">Form</h3>
                <p className="text-sm text-muted-foreground">
                ETHICSHIELD RESPECTS THE PRIVACY OF OUR WHISTLEBLOWERS.
                </p>
            </div>

            <Separator/>
            {currForm=="0" && <Anonymous setCurrForm={setCurrForm}/>}
            {currForm=="1" &&<CorruptionType setCurrForm={setCurrForm}/>}
            {currForm=="2" &&<CorruptionSector setCurrForm={setCurrForm}/>}
            {currForm=="3" &&<IncidentReportForm />}         
        </>
    )
}
