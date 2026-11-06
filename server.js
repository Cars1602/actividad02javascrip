import express from 'express';
import pg from 'pg';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const app = express();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000, enableChannelBinding: true });
pool.on('error', () => console.error('La conexión con Neon se interrumpió.'));
app.use(express.json({ limit: '10kb' }));
app.get('/api/productos', async (req, res) => {
    try { res.json((await pool.query('SELECT id,nombre,precio,cantidad FROM productos ORDER BY id DESC')).rows); }
    catch { res.status(503).json({ error: 'No se pudieron cargar los productos.' }); }
});
app.post('/api/productos', async (req, res) => {
    const { nombre, precio, cantidad } = req.body ?? {};
    if (typeof nombre !== 'string' || !nombre.trim() || nombre.length > 200 || typeof precio !== 'number' || !Number.isFinite(precio) || precio <= 0 || precio > 9999999999.99 || Math.abs(precio * 100 - Math.round(precio * 100)) > 0.0001 || !Number.isInteger(cantidad) || cantidad < 0 || cantidad > 2147483647) return res.status(400).json({ error: 'Revisa el nombre, precio (máximo dos decimales) y cantidad.' });
    try { const result = await pool.query('INSERT INTO productos(nombre,precio,cantidad) VALUES($1,$2,$3) RETURNING id,nombre,precio,cantidad', [nombre.trim(), precio, cantidad]); res.status(201).json(result.rows[0]); }
    catch { res.status(503).json({ error: 'No se pudo guardar el producto.' }); }
});
app.delete('/api/productos/:id', async (req, res) => {
    if (!/^[1-9]\d{0,18}$/.test(req.params.id)) return res.status(400).json({ error: 'Identificador inválido.' });
    try { const result = await pool.query('DELETE FROM productos WHERE id=$1 RETURNING id', [req.params.id]); if (!result.rowCount) return res.status(404).json({ error: 'El producto ya no existe.' }); res.sendStatus(204); }
    catch { res.status(503).json({ error: 'No se pudo eliminar el producto.' }); }
});
// Solo se publican los archivos de la interfaz; .env permanece privado.
app.get('/', (req, res) => res.sendFile(fileURLToPath(new URL('./index.html', import.meta.url))));
app.get('/estilos.css', (req, res) => res.sendFile(fileURLToPath(new URL('./estilos.css', import.meta.url))));
app.use('/img', express.static(fileURLToPath(new URL('./img', import.meta.url))));
app.use('/js', express.static(fileURLToPath(new URL('./js', import.meta.url))));
try {
    await pool.query(await readFile(new URL('./schema.sql', import.meta.url), 'utf8'));
    app.listen(Number(process.env.PORT) || 3000, '0.0.0.0', () => console.log('Formulario disponible en http://localhost:3000'));
} catch { console.error('No se pudo iniciar: comprueba la conexión de Neon en .env.'); await pool.end(); process.exitCode = 1; }


