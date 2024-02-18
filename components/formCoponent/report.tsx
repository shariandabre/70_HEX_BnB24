import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
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
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import addData from "@/firebase/firestore/addData";
import { useAuthContext } from "@/context/AuthContext";
import firebase_app from "@/firebase/config";
import { collection, getDocs, getFirestore, query, updateDoc, where, doc } from "firebase/firestore";


const FormSchema = z.object({
    province: z.string().nonempty({ message: "Province is required." }),
    mapLink: z.string().optional(),
    cityOrTown: z.string().nonempty({ message: "City or town is required." }),
    whenDidItHappen: z.string().nonempty({ message: "Date is required." }),
    whatHappened: z.string().nonempty({ message: "Description is required." }),
    personInvolved: z.string().nonempty({ message: "Person's name is required." }),
    roleInvolved: z.string().nonempty({ message: "Person's role is required." }),
    evidence: z.string().nonempty({ message: "Enter evidence." }),
    reportedToAuthority: z.enum(["Yes", "No"], { required_error: "Please select whether you reported to another authority." }),
});

interface AuthContextType {
    user: any; // Replace 'any' with the actual type of 'user'
}

export function IncidentReportForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });
    const { user } = useAuthContext() as AuthContextType
    const storage = getStorage(firebase_app)
    const [listingdata, setListingData] = useState("")

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const db = getFirestore(firebase_app)

        if (data.mapLink) {
            fetch(`/api/metadatafetch?url=${data.mapLink}`)
                .then(response => response.json())
                .then(async responseData => {
                    if (responseData.error) {
                        console.error('Error:', responseData.error);
                    } else {
                        setListingData(responseData.result);

                        const q = query(collection(db, "listing"), where("listingName", "==", responseData.result.ogSiteName));
                        const querySnapshot = await getDocs(q);
                        console.log(querySnapshot.empty)
                        if (querySnapshot.empty) {
                            const result = await addData("listing", data.mapLink.slice(24,), {
                                listingName: responseData.result.ogSiteName,
                                listingImg: responseData.result.ogImage[0].url,
                                same: true,
                                count: 1,
                            });
                            console.log(result)
                        }
                        else {
                            console.log("done")
                            const doc1 = querySnapshot.docs[0]; // Assuming there's only one document with the matching listingName
                            const count = doc1.data().count;
                            const docRef = doc(db, "listing", doc1.id); // Use doc1.id as the document ID
                            await updateDoc(docRef, {
                                count: count + 1
                            });
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
        const storageRef = ref(storage, `evidence/${user.uid}.png`);
        const uploadTask = uploadBytesResumable(storageRef, data.evidence[0]);



        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // You can optionally track the upload progress here
            },
            (error) => {
                // Handle any errors that occur during the upload process
                console.error("Error uploading file:", error);
                toast({ title: "Error uploading file. Please try again." });
            },
            () => {
                // Once the upload is complete, get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    try {
                        // Add the form data to Firestore
                        await addData("users", user.uid, {
                            province: data.province,
                            mapLink: data.mapLink,
                            cityOrTown: data.cityOrTown,
                            whenDidItHappen: data.whenDidItHappen,
                            whatHappened: data.whatHappened,
                            personInvolved: data.personInvolved,
                            roleInvolved: data.roleInvolved,
                            evidence: downloadURL,
                            reportedToAuthority: data.reportedToAuthority,
                        });
                        toast({ title: "Submitted" });
                        location.reload()
                    } catch (error) {
                        // Handle any errors that occur while adding data to Firestore
                        console.error("Error adding data to Firestore:", error);
                        toast({ title: "Error submitting form. Please try again." });
                    }
                }).catch((error) => {
                    // Handle any errors that occur while retrieving the download URL
                    console.error("Error getting download URL:", error);
                    toast({ title: "Error submitting form. Please try again." });
                });
            }
        );

    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Province</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} className="input" />
                                </FormControl>
                                <FormMessage>{form.formState.errors.province?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cityOrTown"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City or Town</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} className="input" />
                                </FormControl>
                                <FormMessage>{form.formState.errors.cityOrTown?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mapLink"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Google Map Link (violator)</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} className="input" />
                                </FormControl>
                                <FormMessage>{form.formState.errors.mapLink?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="whenDidItHappen"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>When did it happen?</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} className="input" />
                                </FormControl>
                                <FormMessage>{form.formState.errors.whenDidItHappen?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="whatHappened"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>What happened?</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Type your message here." />
                                </FormControl>
                                <FormMessage>{form.formState.errors.whatHappened?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="personInvolved"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name of the person involved</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} className="input" />
                                </FormControl>
                                <FormMessage>{form.formState.errors.personInvolved?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="roleInvolved"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role of the person involved</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} className="input" />
                                </FormControl>
                                <FormMessage>{form.formState.errors.roleInvolved?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="evidence"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Upload evidence</FormLabel>
                                <FormControl>
                                    <Input type="file" {...field} className="input" />
                                </FormControl>
                                <FormMessage>{form.formState.errors.evidence?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="reportedToAuthority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Have you already reported this incident to another authority?</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex "
                                    >
                                        <RadioGroupItem value="Yes" />
                                        <FormLabel className="font-normal">Yes</FormLabel>
                                        <RadioGroupItem value="No" />
                                        <FormLabel className="font-normal">No</FormLabel>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage>{form.formState.errors.reportedToAuthority?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    );
}
