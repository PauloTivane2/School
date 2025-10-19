// setup-tailwind.js
import { execSync } from "child_process";
import fs from "fs";

console.log("🔧 Iniciando reconfiguração automática do TailwindCSS...\n");

try {
    // 1️⃣ Instala dependências necessárias
    console.log("📦 Instalando dependências...");
    execSync("npm install -D tailwindcss postcss autoprefixer", { stdio: "inherit" });

    // 2️⃣ Cria arquivos de configuração se não existirem
    if (!fs.existsSync("tailwind.config.js") || !fs.existsSync("postcss.config.js")) {
        console.log("\n⚙️ Gerando arquivos de configuração do Tailwind...");
        execSync("npx tailwindcss init -p", { stdio: "inherit" });
    }

    // 3️⃣ Atualiza tailwind.config.js com conteúdo padrão
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
    fs.writeFileSync("tailwind.config.js", tailwindConfig);
    console.log("✅ Arquivo 'tailwind.config.js' atualizado.");

    // 4️⃣ Atualiza postcss.config.js
    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
    fs.writeFileSync("postcss.config.js", postcssConfig);
    console.log("✅ Arquivo 'postcss.config.js' atualizado.");

    // 5️⃣ Verifica se existe o index.css
    if (!fs.existsSync("src/index.css")) {
        fs.mkdirSync("src", { recursive: true });
        fs.writeFileSync(
            "src/index.css",
            "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n"
        );
        console.log("✅ Arquivo 'src/index.css' criado com diretivas Tailwind.");
    }

    console.log("\n🎉 TailwindCSS reconfigurado com sucesso!");
    console.log("💡 Agora execute: npm run dev\n");
} catch (error) {
    console.error("❌ Erro durante a configuração do Tailwind:", error);
}