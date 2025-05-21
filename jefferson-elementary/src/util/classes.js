import { doc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase.js";

export const fetchAllTeachers = async () => {
  const snapshot = await getDocs(collection(db, "teachers"));
  return snapshot.docs.map((doc) => ({
    name: doc.data().name,
    subjects: doc.data().classes || [],
  }));
};

export const fetchAllClasses = async () => {
    const querySnapshot = await getDocs(collection(db, "classes"));
    return querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
};

export const addClassToDB = async (newClass) => {
    await addDoc(collection(db, "classes"), newClass);
};

export const deleteClassFromDB = async (id) => {
    const classRef = doc(db, 'classes', id);
    await deleteDoc(classRef)
}