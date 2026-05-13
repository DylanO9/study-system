import Navbar from "../components/navbar/page"
export default function Notes() {
    return (
        <main className='w-screen h-screen flex'>
            {/* Navbar */}
            <Navbar/>
            {/* Main Body */}
            <div id='main-dashboard' className='flex-1 p-8'>
                <div className="border-t border-l border-r w-full h-1/2 flex flex-col p-8 items-start">
                    <h2 className="mb-4">Input Notes</h2>
                    <textarea
                        className="border w-full resize-none mb-4"
                        rows={33}
                        maxLength={5000}
                    />
                    <button id="generate-insights" className="cursor-pointer self-center border p-2">Generate Insights</button>
                </div>
        
                <div className="border w-full h-1/2 p-8 flex flex-col">
                    <h2 className="mb-4">Insights</h2>
                    <p id="response" className="border flex w-full h-full"></p>
                </div>
            </div>
        </main>
    );
}