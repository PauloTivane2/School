 /** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1E3A8A',           // azul escuro corporativo
                'primary-hover': '#1E40AF',   // azul escuro hover
                secondary: '#60A5FA',         // azul claro suave
                'secondary-hover': '#3B82F6', // azul claro hover
                accent: '#F3F4F6',            // cinza muito claro (fundos)
                'neutral-dark': '#111827',    // preto suave
                'neutral-gray': '#6B7280',    // cinza médio
                'neutral-light': '#F9FAFB',   // branco quase puro
                'text-primary': '#111827',    // texto principal
                'text-secondary': '#374151',  // texto secundário
                'border-light': '#E5E7EB',    // borda clara
                'border-medium': '#D1D5DB',   // borda média
                success: '#10B981',           // verde sucesso
                warning: '#F59E0B',           // amarelo aviso
                error: '#EF4444',             // vermelho erro
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
            },
        },
    },
    plugins: [],
};