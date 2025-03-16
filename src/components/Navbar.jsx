import {Link} from 'react-router-dom'

const Navbar = ()=>{
    return (
        <nav className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">AI Healthcare Chatbot</h1>
            <div>
                <Link to="/" className="mx-4 hover:underline">Home</Link>
                <Link to="/chat" className="mx-4 hover:underline">Chatbot</Link>
            </div>
        </nav>
    )
}

export default Navbar