"use client"
import React, { useEffect, useState } from 'react';
import firebase_app from "@/firebase/config";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";

export function CorruptionListing() {
    const [fetchedData, setFetchedData] = useState([]);
    const db = getFirestore(firebase_app);

    useEffect(() => {
        async function fetchData() {
            const q = query(collection(db, "listing"), where("same", "==", true));
            const querySnapshot = await getDocs(q);
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
            });
            setFetchedData(data);
        }
        fetchData();
    }, []);

    return (
        <div className="flex-1 w-full">
            {fetchedData.map((item, index) => (
                <div key={index} className="flex h-auto  border mb-2 p-2 flex-row gap-2 items-center justify-evenly max-w-screen-lg rounded-lg">
                    <div>
                        <img src={item.listingImg} className='w-[100px] h-[100px] rounded-lg' alt={item.listingName} />
                    </div>
                    <div>
                        <p className='mb-2'>{item.listingName}</p>
                        <p className='text-base text-gray-700'>Total number of complients registered {item.count}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
