export default function Signup() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans p-8">
        <h2 className="mb-3">Sign up</h2>
        <form id="signup" className="block rounded-sm border p-8 justify-items-center">
          <div>
            <label className="block" htmlFor="first_name">First Name:</label>
            <input className="block border" type="text" id="first_name" name="first_name"/>
          </div>
          <div>
            <label className="block" htmlFor="last_name">Last Name:</label>
            <input className="block border" type="text" id="last_name" name="last_name"/>
          </div>
          <div>
            <label className="block" htmlFor="email">Email:</label>
            <input className="block border"type="text" id="email" name="email"/>
          </div>
          <div>
            <label className="block" htmlFor="password">Password:</label>
            <input className="block border" type="text" id="password" name="password"/>
          </div>
          <button className="border mt-4 p-1 cursor-pointer">Sign Up</button>
        </form>
    </main>
  );
}