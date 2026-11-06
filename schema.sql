CREATE TABLE IF NOT EXISTS productos (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 nombre TEXT NOT NULL CHECK (length(trim(nombre)) > 0),
 precio NUMERIC(12,2) NOT NULL CHECK (precio > 0 AND precio <> 'NaN'::numeric),
 cantidad INTEGER NOT NULL CHECK (cantidad >= 0),
 creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
