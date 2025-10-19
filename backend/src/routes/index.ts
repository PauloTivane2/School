import { Router } from "express";

const router = Router();

// 🔹 Rota inicial de teste
router.get("/", (req, res) => {
  res.json({ message: "API GestaEscolar ativa 🚀" });
});

// 🔹 (Aqui depois adicionaremos as rotas reais, como /students, /turmas, etc.)
export default router;
