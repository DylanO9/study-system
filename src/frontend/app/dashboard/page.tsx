import Navbar from '../components/navbar/page'
export default function Dashboard() {
    return (
        <main className='w-screen h-screen flex'>
            {/* Navbar */}
            <Navbar/>
            {/* Main Body */}
            <div id='main-dashboard' className='flex-1'>
                hello
            </div>
        </main>
    );
}