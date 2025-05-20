import React from 'react'

const ClassPage = () => {
	return (
		<div>
			<h1 className='class-title'>
				class code - class title
			</h1>
			<div className='class-menu'>
				<p>
					Overview of class
				</p>
				<button className='class-button'>
					Roster
				</button>
				<button className='class-button'>
					Grades
				</button>
			</div>
		</div>
	)
}

export default ClassPage