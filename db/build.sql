----------------------------------------------------------------------------------------------------------------------- [ BUILD ]
CREATE DATABASE  IF NOT EXISTS empresa;
USE empresa;
SHOW tables;
DROP DATABASE empresa;
----------------------------------------------------------------------------------------------------------------------- [ USUARIOS TABLA ]
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    nombre VARCHAR(50) NOT NULL, 
    usuario VARCHAR(50) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL, 
    fk_perfil_id INT NOT NULL,
    estado BOOLEAN DEFAULT TRUE, 
    sesion BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (fk_perfil_id) REFERENCES perfiles(id) ON DELETE CASCADE ON UPDATE CASCADE
);
----------------------------------------------------------------------------------------------------------------------- [ USUARIOS FUNSIONES ]
DESCRIBE usuarios;
DROP TABLE usuarios;
TRUNCATE TABLE usuarios;
----------------------------------------------------------------------------------------------------------------------- [ USUARIOS INTERACTUAR ]
INSERT INTO usuarios(
	nombre,
	usuario, 
    password,
    fk_perfil_id
) VALUES (
	'Luis Andres',
	'larcword', 
    '12345678',
    1
);

SELECT 
	usuarios.id,
    usuarios.nombre, 
    usuarios.usuario, 
    perfiles.nombre AS perfil
FROM usuarios JOIN perfiles 
ON usuarios.fk_perfil_id = perfiles.id;
----------------------------------------------------------------------------------------------------------------------- [ PERFILES TABLA ]
CREATE TABLE perfiles (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    nombre VARCHAR(50) NOT NULL UNIQUE, 
    estado BOOLEAN DEFAULT TRUE
);
----------------------------------------------------------------------------------------------------------------------- [ PERFILES FUNSIONES ]
DESCRIBE perfiles;
SELECT * FROM perfiles;
DROP TABLE perfiles;
TRUNCATE TABLE perfiles;
----------------------------------------------------------------------------------------------------------------------- [ PERFILES INTERACTUAR ]
INSERT INTO perfiles(
	nombre
) VALUES (
	'Sistemas'
);
----------------------------------------------------------------------------------------------------------------------- [ SESIONES TABLA ]
CREATE TABLE sesiones (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    fk_user_id INT NOT NULL, 
    dispositivo VARCHAR(255) NULL,
    token VARCHAR(255) NOT NULL, 
    session_start DATETIME NOT NULL,
    session_expiry DATETIME NOT NULL,
    FOREIGN KEY (fk_user_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE INDEX idx_token (token)
);
----------------------------------------------------------------------------------------------------------------------- [ SESIONES FUNSIONES ]
SELECT * FROM sesiones;
DESCRIBE sesiones;
DROP TABLE sesiones;
TRUNCATE TABLE sesiones;
----------------------------------------------------------------------------------------------------------------------- [ SESIONES INTERACTUAR ]
INSERT INTO sesiones(
	fk_usuario_id,
	dispositivo, 
    token
) VALUES (
	1,
	'Chrome', 
    'kdgflhsgdfkjaghsdawljhsd;jhfk'
);
----------------------------------------------------------------------------------------------------------------------- [ MODULOS TABLA ]
CREATE TABLE modulos (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    nombre VARCHAR(50) NOT NULL UNIQUE, 
    descripcion VARCHAR(50),
    tipo BOOLEAN,
    estado BOOLEAN DEFAULT TRUE
);
----------------------------------------------------------------------------------------------------------------------- [ MODULOS FUNSIONES ]
SELECT * FROM modulos;
DESCRIBE modulos;
DROP TABLE modulos;
TRUNCATE TABLE modulos;
----------------------------------------------------------------------------------------------------------------------- [ MODULOS INTERACTUAR ]
INSERT INTO modulos(
	nombre,
    descripcion,
	tipo 
) VALUES (
	'Sistemas', 
    'Modulo para la administracion del sistema en general',
    true
);
----------------------------------------------------------------------------------------------------------------------- [ PROCESOS TABLA ]
CREATE TABLE procesos (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    nombre VARCHAR(50) NOT NULL UNIQUE, 
    url  VARCHAR(50) NOT NULL UNIQUE, 
    fk_modulo_id INT NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (fk_modulo_id) REFERENCES modulos(id) ON DELETE CASCADE ON UPDATE CASCADE
);
----------------------------------------------------------------------------------------------------------------------- [ PROCESOS FUNSIONES ]
SELECT * FROM procesos;
DESCRIBE procesos;
DROP TABLE procesos;
TRUNCATE TABLE procesos;
----------------------------------------------------------------------------------------------------------------------- [ PROCESOS INTERACTUAR ]
INSERT INTO procesos(
	nombre,
	url,
    fk_modulo_id
) VALUES (
	'Modulos', 
    'modulos/modulos',
    1
);