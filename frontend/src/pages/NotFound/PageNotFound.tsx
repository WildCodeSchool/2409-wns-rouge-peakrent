import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <style>{`
        @keyframes rotor-spin {
          100% { transform: rotate(360deg); }
        }
        @keyframes heli-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold mb-0 text-rose-600">404</h1>
        <h2 className="text-2xl font-semibold mt-4 mb-2">
          Il semble que vous êtes hors piste !
        </h2>
        <p className="mb-6 text-slate-500">
          Pas de panique, cliquez ici pour être rapatrié.
        </p>
        <Link
          to="/"
          className="group inline-block px-7 py-3 bg-rose-600 text-white rounded-lg font-semibold text-lg shadow hover:bg-rose-700 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="text-2xl group-hover:-translate-y-1 transition-transform duration-300">
              🚁
            </span>{" "}
            Rapatriement
          </span>
        </Link>
        <div className="mt-10 flex justify-center">
          {/* SVG Hélicoptère animé */}
          <div style={{ animation: "heli-float 2.5s ease-in-out infinite" }}>
            <svg
              width="180"
              height="90"
              viewBox="0 0 180 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ombre */}
              <ellipse cx="90" cy="80" rx="60" ry="8" fill="#cbd5e1" />
              {/* Corps */}
              <rect
                x="60"
                y="50"
                width="60"
                height="20"
                rx="10"
                fill="#e11d48"
              />
              <rect
                x="110"
                y="60"
                width="20"
                height="8"
                rx="4"
                fill="#fbbf24"
              />
              <rect x="50" y="60" width="20" height="8" rx="4" fill="#fbbf24" />
              <rect
                x="85"
                y="40"
                width="10"
                height="20"
                rx="5"
                fill="#64748b"
              />
              <rect x="87" y="30" width="6" height="15" rx="3" fill="#64748b" />
              <rect
                x="60"
                y="55"
                width="60"
                height="4"
                rx="2"
                fill="#fff"
                opacity="0.5"
              />
              {/* Rotor principal animé */}
              <g
                style={{
                  transformOrigin: "90px 30px",
                  animation: "rotor-spin 0.7s linear infinite",
                }}
              >
                <ellipse cx="90" cy="30" rx="30" ry="3" fill="#64748b" />
              </g>
              {/* Axe du rotor */}
              <rect x="88" y="10" width="4" height="20" rx="2" fill="#64748b" />
              <rect x="60" y="70" width="60" height="4" rx="2" fill="#64748b" />
              <circle
                cx="70"
                cy="70"
                r="4"
                fill="#fff"
                stroke="#64748b"
                strokeWidth="2"
              />
              <circle
                cx="110"
                cy="70"
                r="4"
                fill="#fff"
                stroke="#64748b"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
