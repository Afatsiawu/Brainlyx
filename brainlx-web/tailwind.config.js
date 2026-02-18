/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5', // Indigo
                primaryLight: '#EEF2FF',
                secondary: '#8B5CF6', // Purple (AI)
                accent: '#14B8A6', // Teal
                background: '#F9FAFB',
                surface: '#FFFFFF',
                text: '#111827',
                textSecondary: '#6B7280',
                error: '#EF4444',
                success: '#10B981',
                warning: '#F59E0B',
                border: '#E5E7EB',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                blob: "blob 7s infinite",
                float: "float 6s ease-in-out infinite",
                "float-delayed": "float 6s ease-in-out 3s infinite",
                shimmer: "shimmer 2s linear infinite",
                "in": "in 0.5s ease-out forwards",
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.1)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                shimmer: {
                    from: { transform: "translateX(-100%)" },
                    to: { transform: "translateX(100%)" },
                },
                in: {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                }
            },
        },
    },
    plugins: [],
}
