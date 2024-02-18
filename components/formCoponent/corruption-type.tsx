import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import addData from "@/firebase/firestore/addData";
import { useAuthContext } from "@/context/AuthContext";


interface AuthContextType {
    user: any; // Replace 'any' with the actual type of 'user'
  }

const FormSchema = z.object({
    type: z.enum(["Failure to Act", "Election fraud", "Ghost learners", "Fraudulent Documents / Qualifications", "Mismanagement of resources", "Theft of resources", "Misuse of resources", "Embezzlement", "Irregular / wasteful expenditure", "Bribery", "Extortion", "Kickbacks (bribery for tenders)", "Conflict of interest (favouritism / nepotism)", "Fronting", "Tampering with tender process / documents", "Service delivery", "Compliance", "Abuse of power", "Violence"], {
        required_error: "You need to select a notification type.",
    }),
});

export function CorruptionType({setCurrForm}) {
    const { user } = useAuthContext() as AuthContextType
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const [selectedCorruptionType, setSelectedCorruptionType] = useState<string | null>(null);
    const [selectedCorruptionSubType, setSelectedCorruptionSubType] = useState<string | null>(null);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
       await addData("users", user.uid, {
            corruptionType:data.type
            })
          
        setCurrForm("2")
            
    }

    // Function to render sub-items based on selected corruption type
    function renderSubItems() {
        switch (selectedCorruptionType) {
            case "Dereliction":
                return ["Failure to Act"];
            case "Fraud":
                return ["Election fraud", "Ghost learners", "Fraudulent Documents / Qualifications"];
            case "Misappropriation":
                return ["Mismanagement of resources", "Theft of resources", "Misuse of resources", "Embezzlement", "Irregular / wasteful expenditure"];
            case "Bribery":
                return ["Bribery", "Extortion"];
            case "Procurement":
                return ["Kickbacks (bribery for tenders)", "Conflict of interest (favouritism / nepotism)", "Fronting", "Tampering with tender process / documents"];
            case "Maladministration":
                return ["Service delivery", "Compliance"];
            case "Whistle-blower":
                return ["Abuse of power", "Violence"];
            default:
                return [];
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="subtype"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Type of Corruption</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={(value) => {
                                            setSelectedCorruptionType(value); // Set selected corruption type only when a main corruption type is selected
                                        }}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {["Dereliction", "Fraud", "Misappropriation", "Bribery", "Procurement", "Maladministration", "Whistle-blower"].map((corruptionType) => (
                                            <div key={corruptionType} className="space-y-2 gap-3 flex-row flex items-center">
                                                <RadioGroupItem value={corruptionType} />
                                                <FormLabel className="font-normal">{corruptionType}</FormLabel>
                                            </div>
                                        ))}
                                    </RadioGroup>

                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormControl>
                                    {selectedCorruptionType && (

                                        <div className="pl-6 space-y-1">
                                            <Separator className="mb-2"/>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                            {renderSubItems().map((subItem) => (
                                                <div key={subItem} 
                                                className="gap-3 flex-row flex items-center">
                                                        <RadioGroupItem value={subItem} />
                                                        <FormLabel className="font-normal">{subItem}</FormLabel>
                                                </div>
                                            ))}
                                            </RadioGroup>
                                        </div>
                                    )}

                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    );
}
