import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.js";

const fetchAllStudents = async () => {
  const querySnapshot = await getDocs(collection(db, "students"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export default fetchAllStudents;

// EXAMPLE RESPONSE - fetchAllStudents

// [
//     {
//         id: '60xaR2IGiMK9l56r9Qtb',
//         classes: { grade: 90, gradeLevel: 'First' }
//         firstName: 'John',
//         lastName: 'Smith'
//     }
// ]