import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 fixed bottom-0 w-full">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Brand / About */}
        <div>
          <h2 className="text-lg font-semibold text-white">MockItUp</h2>
          <p className="mt-2 text-xs text-gray-400">
            AI-powered mock interview platform to practice and improve your
            skills.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-sm font-semibold text-white">Quick Links</h2>
          <ul className="mt-2 space-y-1 text-xs">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/resume-parser" className="hover:text-white">
                Resume Parser
              </Link>
            </li>
          </ul>
          {/* <li><a href="/about" className="hover:text-white">About</a></li>
            <li><a href="/features" className="hover:text-white">Features</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li> */}
          {/* </ul> */}
        </div>

        {/* Contact / Social */}
        <div>
          <h2 className="text-sm font-semibold text-white">Connect</h2>
          <ul className="mt-2 space-y-1 text-xs">
            <li className="flex items-center gap-2">
              {/* <Mail size={14} />  */}
              <a href="mailto:">support@mockitup.com</a>
            </li>
            <li className="flex items-center gap-2">
              {/* <Github size={14} />  */}
              <a
                href="https://github.com/sushma1261"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li className="flex items-center gap-2">
              {/* <Linkedin size={14} />  */}
              <a
                href="https://linkedin.com/in/sushma-varma"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <p className="text-center text-xs text-gray-500 py-3">
          © {new Date().getFullYear()} MockItUp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
