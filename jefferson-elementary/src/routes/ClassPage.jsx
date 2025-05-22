import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import placeholder from '../assets/placeholder.jpg'
import '../styles/ClassPage.css'
import Navbar from '../components/Navbar'
import DirectoryPersonList from '../components/DirectoryPersonList';
import { doc, getDoc, updateDoc, getDocs, collection, deleteField } from "firebase/firestore";
import { db } from '../../firebase';
import ClassEditModal from '../components/ClassEditModal';
import AddStudentsModal from '../components/AddStudentsModal';
import "../styles/Directory.css";

const ClassPage = () => {

	const { classId } = useParams();
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState('Overview')
	const [classData, setClassData] = useState(null);
	const [students, setStudents] = useState([]);
	const [teachers, setTeachers] = useState([]);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isAddStudentsModalOpen, setIsAddStudentsModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// class data
				const classDocRef = doc(db, "classes", classId);
				const classDoc = await getDoc(classDocRef);

				if (!classDoc.exists()) {
					navigate('/');
					return;
				}
				setClassData(classDoc.data());

				// student data
				const studentIds = Object.keys(classDoc.data().students || {});
				const studentPromises = studentIds.map(async (id) => {
					const studentDoc = await getDoc(doc(db, "students", id));  // Fixed
					return {
						id,
						...studentDoc.data(),
						grade: classDoc.data().students[id]
					};
				});
				const fetchedStudents = await Promise.all(studentPromises);
				setStudents(fetchedStudents);

				// teacher data
				if (classDoc.data().teacher) {
					const teacherName = classDoc.data().teacher;

					// teacher name stored as id
					try {
						const teacherDoc = await getDoc(doc(db, "teachers", classDoc.data().teacher));
						if (teacherDoc.exists()) {
							setTeachers([{ id: teacherDoc.id, ...teacherDoc.data() }]);
						} else {
							// teacher name stored as name (when setting class)
							setTeachers([{ id: "unknown", name: teacherName }]);
						}
					} catch (error) {
						// set as name by default 
						setTeachers([{ id: "unknown", name: teacherName }]);
					}
				}

			} catch (error) {
				console.error("Error fetching data: ", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [classId, navigate]);

	const handleTabChange = (tabName) => {
		setSelectedTab(tabName);
	}

	const handleUpdateClass = async (updatedData) => {
		try {
			const classDocRef = doc(db, "classes", classId);
			await updateDoc(classDocRef, updatedData);
			setClassData(prev => ({ ...prev, ...updatedData }));

			setIsEditModalOpen(false);
			setIsAddStudentsModalOpen(false);
		} catch (error) {
			console.error("Error updating class. ", error)
		}
	}

	const handleAddStudents = async (studentIds) => {
		const classDocRef = doc(db, "classes", classId);
		const classDoc = await getDoc(classDocRef);
		const currentStudents = classDoc.data().students || {};

		//adding new students with initial grade 0
		const updatedStudents = { ...currentStudents };
		studentIds.forEach(id => {
			if (!updatedStudents[id]) {
				updatedStudents[id] = 0;
			}
		});

		// get new grade average
		const grades = Object.values(updatedStudents);
		const newAvg = grades.length > 0 ?
			grades.reduce((sum, grade) => sum + grade, 0) / grades.length : 0;

		await updateDoc(classDocRef, {
			students: updatedStudents,
			gradeAvg: newAvg
		});

		// refresh student list
		const studentPromises = Object.keys(updatedStudents).map(async (id) => {
			const studentDoc = await getDoc(doc(db, "students", id));
			return {
				id,
				...studentDoc.data(),
				grade: updatedStudents[id]
			};
		});

		// update each students' 'classes' field to include the new class
		for (const studentId of studentIds) {
			const studentRef = doc(db, "students", studentId);
			const studentDoc = await getDoc(studentRef);

			if (studentDoc.exists()) {
				const studentData = studentDoc.data();
				const currentClasses = studentData.classes || [];

				// add the current class if the student is not already enrolled ; avoid repeats
				if (!currentClasses.includes(classId)) {
					await updateDoc(studentRef, {
						classes: [...currentClasses, classId]
					});
				}
			}

			// refresh students 
			const studentPromises = Object.keys(updatedStudents).map(async (id) => {
				return {
					id,
					...studentDoc.data(),
					grade: updatedStudents[id]
				};
			});
		}

		const fetchedStudents = await Promise.all(studentPromises);
		setStudents(fetchedStudents);

	}

	// deleting students from a class

	const handleRemoveStudent = async (studentId) => {
		try {
			const classDocRef = doc(db, "classes", classId);
			// remove student from document
			await updateDoc(classDocRef, {
				[`students.${studentId}`]: deleteField()
			});

			// remove class from student's class array
			const studentRef = doc(db, "students", studentId);
			const studentDoc = await getDoc(studentRef);

			if (studentDoc.exists()) {
				const studentData = studentDoc.data();
				const updatedClasses = (studentData.classes || []).filter(cId => cId !== classId);

				await updateDoc(studentRef, {
					classes: updatedClasses
				});
			}

			// get new grade average
			const classDoc = await getDoc(classDocRef);
			const updatedStudents = classDoc.data().students || {};
			const grades = Object.values(updatedStudents);
			const newAvg = grades.length > 0 ?
				grades.reduce((sum, grade) => sum + grade, 0) / grades.length : 0;

			await updateDoc(classDocRef, {
				gradeAvg: newAvg
			});

			setStudents(prev => prev.filter(s => s.id !== studentId));

		} catch (error) {
			console.error("Error removing student: ", error);
		}
	};

	const handleUpdateGrade = async (studentId, newGrade) => {
		const classDocRef = doc(db, "classes", classId);

		// update student's grade
		await updateDoc(classDocRef, {
			[`students.${studentId}`]: newGrade
		});

		// new grade average
		const classDoc = await getDoc(classDocRef);
		const updatedStudents = classDoc.data().students || {};
		const grades = Object.values(updatedStudents);
		const newAvg = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;

		await updateDoc(classDocRef, {
			gradeAvg: newAvg
		});

		setStudents(prev =>
			prev.map(s => s.id === studentId ? { ...s, grade: newGrade } : s)
		);
	};

	const renderTab = () => {
		if (loading) return <div className="loading">Loading Page ...</div>;
		if (!classData) return <div>Error finding class</div>


		switch (selectedTab) {
			case 'Overview':
				return (
					<div className='overview-container'>
						<h2>Overview</h2>
						<button
							className="edit-button"
							onClick={() => setIsEditModalOpen(true)}
						>
							Edit
						</button>
						<h3>Teacher</h3>
						<p>{teachers[0]?.name || 'No teacher assigned'}</p>
						<h3>Description</h3>
						<p>{classData.description}</p>
						<h3>Average Grade</h3>
						<p>{typeof classData.gradeAvg === 'number' ? classData.gradeAvg.toFixed(2) : 'Not available'}</p>
					</div>
				);

			case 'Roster':
				return (
					<div className='roster-container'>
						<div className='roster-header'>
							<h2>Class Roster</h2>
							<button
								className="add-student-button"
								onClick={() => setIsAddStudentsModalOpen(true)}
							>
								Add Students
							</button>

						</div>
						<DirectoryPersonList
							people={students}
							onEdit={(student) => {
								const newGrade = prompt("Enter a new grade:", student.grade);
								if (newGrade !== null && !isNaN(newGrade)) {
									handleUpdateGrade(student.id, parseFloat(newGrade));
								}
							}}
							onDelete={handleRemoveStudent}
							showGrade={true}
						/>
					</div>
				);
			case 'Grades':
				return (
					<div className='grades-container'>
						<h2>Grades</h2>
						<h3>Average Grade</h3>
						<p>{typeof classData.gradeAvg === 'number' ? classData.gradeAvg.toFixed(2) : 'Not available'}</p>
						<div className="grades-list">
							{students.map(student => (
								<div key={student.id} className="grade-item">
									<span>{`${student.first_name} ${student.last_name}`}</span>
									<input
										type="number"
										value={student.grade}
										onChange={(e) => handleUpdateGrade(student.id, parseFloat(e.target.value))}
										min="0"
										max="100"
										step="1.0"
									/>
								</div>
							))}
						</div>
					</div>
				);
			default:
				return null;
		};
	}

	return (
		<div>
			<h1 className='class-title'>
				{classData?.teacher ? `${teachers[0]?.name || 'Unknown'}'s Class` : 'Class'}
			</h1>
			<h3 className='class-subject'>
				{classData?.subject}
			</h3>
			<div className='class-page'>
				<div className='class-page-left'>
					<img className='class-image' src={placeholder}></img>
					<div className='class-menu'>
						<button
							className={`class-button ${selectedTab === 'Overview' ? 'active' : ''}`}
							onClick={() => handleTabChange('Overview')}
						>
							Overview
						</button>
						<button
							className={`class-button ${selectedTab === 'Roster' ? 'active' : ''}`}
							onClick={() => handleTabChange('Roster')}
						>
							Roster
						</button>
						<button
							className={`class-button ${selectedTab === 'Grades' ? 'active' : ''}`}
							onClick={() => handleTabChange('Grades')}
						>
							Grades
						</button>
					</div>
				</div>
				<div className='class-page-right'>
					{renderTab()}
				</div>
			</div>

			{isEditModalOpen && classData && (
				<ClassEditModal
					classData={classData}
					onClose={() => setIsEditModalOpen(false)}
					onSubmit={handleUpdateClass}
					onAddStudents={handleAddStudents}
				/>
			)}

			{isAddStudentsModalOpen && (
				<AddStudentsModal
					onClose={() => setIsAddStudentsModalOpen(false)}
					onAddStudents={handleAddStudents}
				/>
			)}

		</div>
	)
};

export default ClassPage