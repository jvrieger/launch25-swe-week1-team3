import React from 'react'
import placeholder from '../assets/placeholder.jpg'
import '../styles/classpage.css'

const ClassPage = () => {
	return (
		<div>
			<h1 className='class-title'>
				class code - class title
			</h1>
			<div className='class-page'>
				<div className='class-page-left'>
					<img className='class-image' src={placeholder}></img>
					<div className='class-menu'>
						<button className='class-button'>
							Overview
						</button>
						<button className='class-button'>
							Roster
						</button>
						<button className='class-button'>
							Grades
						</button>
					</div>
				</div>
				<div className= 'class-page-right'>
				</div>
			</div>

		</div>
	)
}

export default ClassPage