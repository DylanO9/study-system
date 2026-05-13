import Navbar from "../components/navbar/page"
export default function Notes() {
    return (
        <main className='w-screen h-screen flex'>
            {/* Navbar */}
            <Navbar/>
            {/* Main Body */}
            <div id='main-dashboard' className='flex-1 p-8'>
                <label className="block">Input Notes in .md Format</label>
                <textarea
                    className="border w-full h-full p-8"
                    rows={33}
                    maxLength={5000}
                />
            </div>
        </main>
    );
}