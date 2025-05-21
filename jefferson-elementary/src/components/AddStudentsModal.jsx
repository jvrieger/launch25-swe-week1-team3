import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import '../styles/ClassPage.css';

const AddStudentsModal = ({ onClose, onAddStudents }) => {

	const [allStudents, setAllStudents] = useState([]);
	const [selectedStudents, setSelectedStudents] = useState([]);
	const [loadingStudents, setLoadingStudents] = useState(true);

	// fetch students from firestore
	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const studentsSnapshot = await getDocs(collection(db, 'students'));
				const studentsData = studentsSnapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data()
				}));
				setAllStudents(studentsData);
			} catch (error) {
				console.error("Error fetching students: ", error);
			} finally {
				setLoadingStudents(false);
			}
		};

		fetchStudents();
	}, []);

	const handleStudentSelect = (studentId) => {
		setSelectedStudents(prev =>
			prev.includes(studentId)
				? prev.filter(id => id !== studentId)
				: [...prev, studentId]
		);
	};

	const handleAddSelectedStudents = () => {
		onAddStudents(selectedStudents);
		setSelectedStudents([]);
		onClose();
	};

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2>Add Students to Class</h2>
				<div className="add-students-section">
					{loadingStudents ? (
						<p>Loading students...</p>
					) : (
						<>
							<div className="checklist-items students-list">
								{allStudents.map(student => (
									<div key={student.id} className="checklist-item student-item">
									<input
										className="checklist-item-input select-students"
										type="checkbox"
										id={`student-${student.id}`}
										checked={selectedStudents.includes(student.id)}
										onChange={() => handleStudentSelect(student.id)}
									/>
									<label 
										className="checklist-item-label" 
										htmlFor={`student-${student.id}`}
									>
										{student.first_name} {student.last_name}
									</label>
									{/* Add delete button if needed */}
									{/* <button 
										className="checklist-item-delete"
										onClick={() => handleDeleteStudent(student.id)}
									>
										×
									</button> */}
									</div>
								))}
							</div>
							<div className="modal-actions">
								<button className="cancel-btn" type="button" onClick={onClose}>Cancel</button>
								<button
									className="save-btn"
									onClick={handleAddSelectedStudents}
									disabled={selectedStudents.length === 0}
								>
									Add Selected Students
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default AddStudentsModal;