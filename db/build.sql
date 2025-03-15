----------------------------------------------------------------------------------------------------------------------- [ BUILD ]
DROP DATABASE empresa;
CREATE DATABASE  IF NOT EXISTS empresa;
USE empresa;
SHOW tables;
----------------------------------------------------------------------------------------------------------------------- [ SUCURSALES TABLA ]
CREATE TABLE sucursales (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    nombre VARCHAR(50) NOT NULL, 
    descripcion VARCHAR(200),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    fecha_actualizacion TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    estado BOOLEAN DEFAULT TRUE,
    UNIQUE (nombre)
);
INSERT INTO sucursales (nombre, descripcion) 
    VALUES (
        'Torreón', 
        'Codigo postal 36000'
    ),(
        'Gomez palacio', 
        'Codigo postal 35000'
    );
----------------------------------------------------------------------------------------------------------------------- [ DEPARTAMENTOS TABLA ]
CREATE TABLE departamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    nombre VARCHAR(50) NOT NULL, 
    descripcion VARCHAR(200),
    estado BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    fecha_actualizacion TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    UNIQUE (nombre)
);
INSERT INTO departamentos (nombre, descripcion) 
    VALUES (
        'Sistemas', 
        'Departamento para el desarrollo de productos digitales.'
    ),(
        'Recursos humanos', 
        'Departamento para la gestion corporativa.'
    );





























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