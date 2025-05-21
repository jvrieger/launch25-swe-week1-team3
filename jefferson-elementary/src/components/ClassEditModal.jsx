import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import '../styles/ClassPage.css'

const ClassEditModal = ({ classData, onClose, onSubmit, onAddStudents }) => {

	const [formData, setFormData] = useState(classData);

	const [allStudents, setAllStudents] = useState([]);
	const [selectedStudents, setSelectedStudents] = useState([]);
	const [loadingStudents, setLoadingStudents] = useState(true);

	const [allTeachers, setAllTeachers] = useState([]);
	const [loadingTeachers, setLoadingTeachers] = useState(true);

	useEffect(() => {
		setFormData(classData);
	}, [classData]);



	// fetching data from database
	useEffect(() => {

		// fetch students from firestore
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
		// fetch teachers
		const fetchTeachers = async () => {
			try {
				const teachersSnapshot = await getDocs(collection(db, 'teachers'));
				const teachersData = teachersSnapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data()
				}));
				setAllTeachers(teachersData);
			} catch (error) {
				console.error("Error fetching teachers: ", error);
			} finally {
				setLoadingTeachers(false);
			}
		};
		fetchStudents();
		fetchTeachers();
	}, []);
	
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleStudentSelect = (studentId) => {
		setSelectedStudents(prev =>
			prev.includes(studentId)
				? prev.filter(id => id !== studentId)
				: [...prev, studentId]
		);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	const handleAddSelectedStudents = () => {
		onAddStudents(selectedStudents);
		setSelectedStudents([]);
		onClose();
	};

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2>Edit Class</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Teacher</label>
						{loadingTeachers ? (
							<p>Loading teachers...</p>
						) : (
							<select
								name="teacher"
								value={formData.teacher || ''}
								onChange={handleChange}
							>
								<option value="">-- Select a teacher --</option>
								{allTeachers.map(teacher => (
									<option key={teacher.id} value={teacher.id}>
										{teacher.name}
									</option>
								))}
							</select>
						)}
					</div>
					<div className="form-group">
						<label>Description</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
						/>
					</div>

					<div className="modal-actions">
						<button type="button" onClick={onClose}>Cancel</button>
						<button type="submit">Save Changes</button>
					</div>
				</form>

				<div className="add-students-section">
					<h3>Add Students</h3>

					{loadingStudents ? (
						<p>Loading students...</p>
					) : (
						<>
							<div className="students-list">
								{allStudents.map(student => (
									<div key={student.id} className="student-item">
										<label>
											<input
												type="checkbox"
												checked={selectedStudents.includes(student.id)}
												onChange={() => handleStudentSelect(student.id)}
											/>
											{student.first_name} {student.last_name}
										</label>
									</div>
								))}
							</div>

							<button
								onClick={handleAddSelectedStudents}
								disabled={selectedStudents.length === 0}
							>
								Add Selected Students
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ClassEditModal;