import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.js";

const fetchAllClasses = async () => {
  const querySnapshot = await getDocs(collection(db, "classes"));
  return querySnapshot.docs.map((doc) => ({ 
	id: doc.id, 
	...doc.data() 
	}));
};

const createClass = async (classData) => {
	try {
		const docRef = await addDoc(collection(db, "classes"), {
		...classData,
		students:{},
		gradeAvg: 0,
		});
	} catch (error) {
		console.error("error creating class: ", error);
	}
}

const deleteClass = async (classId) => {
	const classDocRef = doc(db, "classes", classId);
	await deleteDoc(classDocRef);
}

const addStudentToClass = async (classId, studentId, initialGrade = 0) => {
	const classDocRef = doc(db, "classes", classId);
	const classDoc = await getDoc(classDocRef);
	const classData = classDoc.data();
	const students = classData.students || {};

	const updateStudents = {
		...students,
		[studentId]: initialGrade
	};

	const grades = Object.values(updateStudents)
	const newAvg = 0;
	if (grades.length > 0) {
		grades.reduce((sum, grade) => sum + grade, 0) / grades.length
	} 

	await updateDoc(classDocRef, {
		students: updateStudents,
		gradeAvg: newAvg
	});
}

export default fetchAllClasses;

// Example response - fetchAllClasses
//     {
// description: "class"
// gradeAvg: 75
// gradeLevel: 1
// students (map): {
//		pyl68ZKRItM3QjR4MXGi: 90
// 	}
// 	teacher: "1234id" 
//     }
// ]