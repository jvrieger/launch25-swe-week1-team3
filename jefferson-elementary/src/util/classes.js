import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase.js";

export const fetchAllClasses = async () => {
    const querySnapshot = await getDocs(collection(db, "classes"));
    return querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
};

export const addClassToDB = async (newClass) => {
    await addDoc(collection(db, "classes"), newClass);
};