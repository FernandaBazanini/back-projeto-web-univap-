import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js";

dotenv.config();
const app = express();

app.use(cors()); // <--- habilita CORS
app.use(express.json());

// Endpoint de formulário
app.post("/formulario", async (req, res) => {
  try {
    const { nomeCompleto, email } = req.body;

    if (!nomeCompleto || !email) {
      return res
        .status(400)
        .json({ error: "Nome completo e email são obrigatórios." });
    }

    const result = await pool.query(
      "INSERT INTO formulario (nome_completo, email) VALUES ($1, $2) RETURNING *",
      [nomeCompleto, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao salvar no banco:", error);
    res.status(500).json({ error: "Erro no servidor." });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${process.env.PORT}`);
});
