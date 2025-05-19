import React from 'react'
import { useState } from 'react'
import placeholder from '../assets/placeholder.jpg'
import '../styles/classpage.css'
import { data } from 'react-router-dom'

const ClassPage = () => {

	const [selectedTab, setSelectedTab] = useState('Overview')

	const dataPlaceHolder = {
		classCode: 'CS101',
		title: 'Intro to Computer Science',
		description: 'This is a class.',
		professor: 'Mr. Potato Head',
	};

	const handleTabChange = (tabName) => {
		setSelectedTab(tabName);
	}

	const render = () => {
		switch (selectedTab) {
			case 'Overview':
				return (
					<div className='overview-container'>
						<h2>Overview</h2>
						<h3>Professor</h3>
						<p>{dataPlaceHolder.professor}</p>
						<h3>Description</h3>
						<p>{dataPlaceHolder.description}</p>
					</div>
				);
			case 'Roster':
				return (
					<div className='roster-container'>
						<h2>Class Roster</h2>
					</div>
				);
			case 'Grades':
				return (
					<div className='grades-container'>
						<h2>Grades</h2>
					</div>
				);
		};
	}

	return (
		<div>
			<h1 className='class-title'>
				class code - class title
			</h1>
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
					{render()}
				</div>
			</div>

		</div>
	)
}

export default ClassPage