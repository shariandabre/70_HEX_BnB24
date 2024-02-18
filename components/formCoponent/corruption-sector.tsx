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

const FormSchema = z.object({
    sector: z.enum(["Construction",
        "Education",
        "Healthcare",
        "Business",
        "Legal/Financial Services",
        "Defence",
        "Mining",
        "Other",
        "Construction",
        "Basic education",
        "Healthcare",
        "Immigration",
        "Policing",
        "Traffic & Licensing",
        "Higher education",
        "Housing",
        "Mining",
        "State-owned entities",
        "Defence"], {
        required_error: "You need to select a type.",
    }),
    sectorType: z.enum(["Private Sector","Public Sector"], {
    required_error: "You need to select a sector type.",
}),
});

interface AuthContextType {
    user: any; // Replace 'any' with the actual type of 'user'
  }

export function CorruptionSector({setCurrForm}) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });
    const { user } = useAuthContext() as AuthContextType
    const [selectedCorruptionType, setSelectedCorruptionType] = useState<string | null>(null);
    const [selectedCorruptionSubType, setSelectedCorruptionSubType] = useState<string | null>(null);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
         await addData("users", user.uid, {
            corruptionSector:data.sector,
            sectorType:data.sectorType
            })
           
        setCurrForm("3")
            
    }

    // Function to render sub-items based on selected corruption type
    function renderSubItems() {
        switch (selectedCorruptionType) {
            case "Public Sector":
                return ["Construction",
                "Education",
                "Healthcare",
                "Business",
                "Legal/Financial Services",
                "Defence",
                "Mining",
                "Other"];
            case "Private Sector":
                return [        "Construction",
                "Basic education",
                "Healthcare",
                "Immigration",
                "Policing",
                "Traffic & Licensing",
                "Higher education",
                "Housing",
                "Mining",
                "State-owned entities",
                "Defence",
                "Other"
            ];
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
                        name="sectorType"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Type of Sector</FormLabel>
                                <FormControl>
                                    <RadioGroup

                                        onValueChange={(value) => {
                                            setSelectedCorruptionType(value); 
                                            field.onChange(value);// Set selected corruption type only when a main corruption type is selected
                                        }}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {["Private Sector","Public Sector"].map((corruptionType) => (
                                            <div key={corruptionType} className="space-y-2 flex flex-row gap-3 items-center">
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
                        name="sector"
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
                                                    <div key={subItem} className="flex flex-row gap-3 items-center">
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
