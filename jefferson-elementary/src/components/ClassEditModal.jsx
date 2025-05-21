import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import '../styles/ClassPage.css'

const ClassEditModal = ({ classData, onClose, onSubmit, onAddStudents }) => {

	const [formData, setFormData] = useState(classData);
	const [allTeachers, setAllTeachers] = useState([]);
	const [loadingTeachers, setLoadingTeachers] = useState(true);

	useEffect(() => {
		setFormData(classData);
	}, [classData]);

	// fetching data from database
	useEffect(() => {

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

		fetchTeachers();

	}, []);
	
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2>Edit Class</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Teacher</label>
						{loadingTeachers ? (
							<p>Loading...</p>
						) : (
							<select
								name="teacher"
								value={formData.teacher || ''}
								onChange={handleChange}
							>
								<option value="">Select a teacher</option>
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
			</div>
		</div>
	);
};

export default ClassEditModal;