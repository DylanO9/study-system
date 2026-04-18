export default function Login() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-100 font-sans px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-800 mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Welcome back</h1>
          <p className="text-sm text-stone-500 mt-1">Sign in to continue studying</p>
        </header>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
          <form id="login" className="space-y-5">

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-600 uppercase tracking-wider" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 text-sm placeholder:text-stone-400 outline-none focus:border-stone-400 focus:bg-white transition-colors"
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-stone-600 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                  Forgot?
                </a>
              </div>
              <input
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 text-sm placeholder:text-stone-400 outline-none focus:border-stone-400 focus:bg-white transition-colors"
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Sign in
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-stone-400 mt-6">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-stone-600 hover:text-stone-800 font-medium transition-colors">
            Sign up
          </a>
        </p>

      </div>
    </main>
  );
}
