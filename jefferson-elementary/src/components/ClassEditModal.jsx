import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import '../styles/ClassPage.css'

const ClassEditModal = ({ classData, onClose, onSubmit, onAddStudents }) => {

	const [formData, setFormData] = useState(classData);

	useEffect(() => {
		setFormData(classData);
	}, [classData]);
	
	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "teacher") {
			setFormData(prev => ({...prev, [name]: value}))
		} else {
			setFormData(prev => ({ ...prev, [name]: value }));
		}
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
						<label>Description</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
						/>
					</div>

					<div className="modal-actions">
						<button className="cancel-btn" type="button" onClick={onClose}>Cancel</button>
						<button className='save-btn' type="submit">Save Changes</button>
					</div>

				</form>
			</div>
		</div>
	);
};

export default ClassEditModal;