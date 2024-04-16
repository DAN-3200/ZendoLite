//-- Imports
import { useState, useEffect } from 'react'
import { Exchange } from '../elements/fetch'
import './App.scss'

// -- Função principal
export default function App() {
	const title = document.getElementsByTagName('title')[0]
	title.innerHTML = 'Title JSX'

	const [DB, setDB] = useState([])

	// Pegar todos dados do API: uma única vez
	useEffect(() => {
		try {
			const x = async () => {
				const resp = await (
					await fetch('http://127.0.0.1:5000/toDo/cards')
				).json()
				setDB([...DB, ...resp])
				console.log(resp)
			}
			x()
		} catch (error) {
			console.log(`Error: ${error}`)
		}
	}, [])

	const TakeData = async () => {
		const title = document.getElementById('dataTitle')
		const content = document.getElementById('dataContent')

		if (title.value.length !== 0 && content.value.length !== 0) {
			// Conexão com API
			const valor = await Exchange(
				{ title: title.value, content: content.value },
				'http://127.0.0.1:5000/toDo/cards',
				'POST'
			)
			setDB([...DB, valor])

			title.value = ''
			content.value = ''
		} else {
			alert('Preencha todos os campos')
		}
	}

	return (
		<>
			<div className='wall'>
				<div className='inputCard'>
					<input id='dataTitle' placeholder='Title'></input>
					<button onClick={TakeData}>C</button>
					<textarea id='dataContent' placeholder='Content'></textarea>
				</div>

				<div className='fieldCards'>
					{DB.map((item, index) => (
						<Card DB={DB} setDB={setDB} item={item} key={index} />
					))}
				</div>
			</div>
		</>
	)
}

function Banner() {
	return (
		<>
			<div className='banner'>
				<img
					src='https://www.pixground.com/wp-content/uploads/2023/10/Anime-Sunset-Sky-AI-Generated-4K-Wallpaper.jpg'
					alt=''
				/>
			</div>
		</>
	)
}

function Card(props) {
	const [title, setTitle] = useState(props.item.title)
	const [content, setContent] = useState(props.item.content)

	const Delete = (id) => {
		const newDB = props.DB.filter((item) => item.id !== id)
		console.log(props.DB)
		props.setDB(newDB)
		console.log(props.DB)
		Exchange(id, `http://127.0.0.1:5000/toDo/cards/${id}`, 'DELETE')
	}

	const Update = (id) => {
		const p = props.DB.map((task) => {
			if (task.id === id) {
				Exchange(
					{ title: title, content: content },
					`http://127.0.0.1:5000/toDo/cards/${id}`,
					'PUT'
				)
				return { ...task, title: title, content: content }
			} else {
				return task
			}
		})
		props.setDB(p)
		console.log(props.DB)
	}

	return (
		<>
			<div key={props.item.id} className='card'>
				<div className='cardTitle'>
					<input
						placeholder='Title'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div className='cardContent'>
					<textarea
						placeholder='Content'
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
				</div>
				<div className='cardTools'>
					<p>{props.item.id < 10 ? `0${props.item.id}` : props.item.id}</p>
					<button className='btSave' onClick={() => Update(props.item.id)}>
						save
					</button>
					<button className='btDelete' onClick={() => Delete(props.item.id)}>
						delete
					</button>
					{/* Sem arrow function, a função é executada automaticamente */}
				</div>
			</div>
		</>
	)
}
