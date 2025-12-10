
// server.js
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de SQL Server
const dbConfig = {
  server: 'localhost',
  database: 'boardgames_db',
  user: 'sa',          // <-- ajusta
  password: '1234',    // <-- ajusta
  options: {
    encrypt: true,                // en Windows/Local puede requerir trustServerCertificate
    trustServerCertificate: true, // úsalo en dev; en producción coloca certificado
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Pool global
let pool;

// Inicializar conexión
async function initDB() {
  try {
    pool = await sql.connect(dbConfig);
    console.log('Conectado a SQL Server');
  } catch (err) {
    console.error('Error conectando a la base de datos:', err);
    process.exit(1);
  }
}
initDB();

// ================== ENDPOINTS BOARDGAMES ==================

// GET /boardgame - Listar todos los juegos
app.get('/boardgame', async (req, res) => {
  try {
    const result = await pool
      .request()
      .query(`
        SELECT
          bg.*,
          CASE WHEN f.id IS NOT NULL THEN CAST(1 AS bit) ELSE CAST(0 AS bit) END AS isFavorite
        FROM dbo.boardgames AS bg
        LEFT JOIN dbo.favorites AS f ON bg.id = f.idBoardgame
      `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener juegos', error: error.message });
  }
});

// GET /boardgame/:id - Obtener un juego específico
app.get('/boardgame/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool
      .request()
      .input('id', sql.Int, Number(id))
      .query(`
        SELECT
          bg.*,
          CASE WHEN f.id IS NOT NULL THEN CAST(1 AS bit) ELSE CAST(0 AS bit) END AS isFavorite
        FROM dbo.boardgames AS bg
        LEFT JOIN dbo.favorites AS f ON bg.id = f.idBoardgame
        WHERE bg.id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el juego', error: error.message });
  }
});

// POST /boardgame - Crear nuevo juego
app.post('/boardgame', async (req, res) => {
  try {
    const { name, publisher, category, description, year } = req.body;

    // Validaciones
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'El campo name es obligatorio' });
    }
    if (!publisher || publisher.trim() === '') {
      return res.status(400).json({ message: 'El campo publisher es obligatorio' });
    }
    if (!category || category.trim() === '') {
      return res.status(400).json({ message: 'El campo category es obligatorio' });
    }
    if (name.length > 80) {
      return res.status(400).json({ message: 'El nombre no puede exceder 80 caracteres' });
    }
    if (publisher.length > 60) {
      return res.status(400).json({ message: 'El publisher no puede exceder 60 caracteres' });
    }
    if (category.length > 2) {
      return res.status(400).json({ message: 'La categoría no puede exceder 2 caracteres' });
    }
    if (description && description.length > 200) {
      return res.status(400).json({ message: 'La descripción no puede exceder 200 caracteres' });
    }
    if (year && String(year).length > 4) {
      return res.status(400).json({ message: 'El año no puede exceder 4 caracteres' });
    }

    const result = await pool
      .request()
      .input('name', sql.NVarChar(80), name)
      .input('publisher', sql.NVarChar(60), publisher)
      .input('category', sql.NVarChar(2), category)
      .input('description', sql.NVarChar(200), description ?? null)
      .input('year', sql.NVarChar(4), year ?? null)
      .query(`
        INSERT INTO dbo.boardgames (name, publisher, category, description, year)
        OUTPUT INSERTED.id
        VALUES (@name, @publisher, @category, @description, @year)
      `);

    const insertedId = result.recordset[0]?.id;
    res.status(201).json({
      message: 'Juego de mesa creado exitosamente',
      id: insertedId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el juego', error: error.message });
  }
});

// PUT /boardgame/:id - Actualizar juego
app.put('/boardgame/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { publisher, category, description, year } = req.body;

    // Validaciones
    if (!publisher || publisher.trim() === '') {
      return res.status(400).json({ message: 'El campo publisher es obligatorio' });
    }
    if (!category || category.trim() === '') {
      return res.status(400).json({ message: 'El campo category es obligatorio' });
    }
    if (publisher.length > 60) {
      return res.status(400).json({ message: 'El publisher no puede exceder 60 caracteres' });
    }
    if (category.length > 2) {
      return res.status(400).json({ message: 'La categoría no puede exceder 2 caracteres' });
    }
    if (description && description.length > 200) {
      return res.status(400).json({ message: 'La descripción no puede exceder 200 caracteres' });
    }
    if (year && String(year).length > 4) {
      return res.status(400).json({ message: 'El año no puede exceder 4 caracteres' });
    }

    const result = await pool
      .request()
      .input('id', sql.Int, Number(id))
      .input('publisher', sql.NVarChar(60), publisher)
      .input('category', sql.NVarChar(2), category)
      .input('description', sql.NVarChar(200), description ?? null)
      .input('year', sql.NVarChar(4), year ?? null)
      .query(`
        UPDATE dbo.boardgames
        SET publisher = @publisher,
            category = @category,
            description = @description,
            year = @year
        WHERE id = @id
      `);

    const affected = result.rowsAffected[0] ?? 0;
    if (affected === 0) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
    res.json({ message: 'Juego de mesa actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el juego', error: error.message });
  }
});

// DELETE /boardgame/:id - Eliminar juego
app.delete('/boardgame/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool
      .request()
      .input('id', sql.Int, Number(id))
      .query(`DELETE FROM dbo.boardgames WHERE id = @id`);

    const affected = result.rowsAffected[0] ?? 0;
    if (affected === 0) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
    res.json({ message: 'Juego de mesa eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el juego', error: error.message });
  }
});

// ================== ENDPOINTS FAVORITES ==================

// GET /favorites - Listar juegos favoritos
app.get('/favorites', async (req, res) => {
  try {
    const result = await pool
      .request()
      .query(`
        SELECT
          f.id,
          bg.name,
          bg.publisher,
          bg.category,
          bg.year
        FROM dbo.favorites AS f
        INNER JOIN dbo.boardgames AS bg ON f.idBoardgame = bg.id
      `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener favoritos', error: error.message });
  }
});

// POST /favorites - Agregar a favoritos
app.post('/favorites', async (req, res) => {
  try {
    const { idBoardgame } = req.body;
    if (!idBoardgame) {
      return res.status(400).json({ message: 'El campo idBoardgame es obligatorio' });
    }

    // Verificar si el juego existe
    const game = await pool
      .request()
      .input('idBoardgame', sql.Int, Number(idBoardgame))
      .query(`SELECT id FROM dbo.boardgames WHERE id = @idBoardgame`);

    if (game.recordset.length === 0) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    // Verificar si ya está en favoritos
    const existing = await pool
      .request()
      .input('idBoardgame', sql.Int, Number(idBoardgame))
      .query(`SELECT id FROM dbo.favorites WHERE idBoardgame = @idBoardgame`);

    if (existing.recordset.length > 0) {
      return res.status(400).json({ message: 'El juego ya está en favoritos' });
    }

    const insertResult = await pool
      .request()
      .input('idBoardgame', sql.Int, Number(idBoardgame))
      .query(`
        INSERT INTO dbo.favorites (idBoardgame)
        OUTPUT INSERTED.id
        VALUES (@idBoardgame)
      `);

    const insertedId = insertResult.recordset[0]?.id;
    res.status(201).json({
      message: 'Juego agregado a favoritos exitosamente',
      id: insertedId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar a favoritos', error: error.message });
  }
});

// DELETE /favorites/:id - Eliminar de favoritos
app.delete('/favorites/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool
      .request()
      .input('idBoardgame', sql.Int, Number(id))
      .query(`DELETE FROM dbo.favorites WHERE idBoardgame = @idBoardgame`);

    const affected = result.rowsAffected[0] ?? 0;
    if (affected === 0) {
      return res.status(404).json({ message: 'Favorito no encontrado' });
    }
    res.json({ message: 'Juego eliminado de favoritos exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar de favoritos', error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
