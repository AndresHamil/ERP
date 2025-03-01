-- CREAR TABLA PERFILES
BEGIN
    CREATE TABLE usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,  
        nombre VARCHAR(50) NOT NULL, 
        apellido VARCHAR(50) NOT NULL, 
        usuario VARCHAR(50) NOT NULL UNIQUE, 
        email VARCHAR(100) UNIQUE, 
        telefono VARCHAR(15), 
        password VARCHAR(255) NOT NULL, 
        fk_sucursal_id INT NOT NULL,
        fk_departamento_id INT NOT NULL,
        fk_perfil_id INT NOT NULL,
        estado BOOLEAN DEFAULT TRUE, 
        sesion BOOLEAN DEFAULT FALSE,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        fecha_actualizacion TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
        FOREIGN KEY (fk_sucursal_id) REFERENCES sucursales(id) 
            ON DELETE RESTRICT
            ON UPDATE CASCADE,
        FOREIGN KEY (fk_departamento_id) REFERENCES departamentos(id) 
            ON DELETE RESTRICT
            ON UPDATE CASCADE,
        FOREIGN KEY (fk_perfil_id) REFERENCES perfiles(id) 
            ON DELETE RESTRICT
            ON UPDATE CASCADE,
        UNIQUE (fk_sucursal_id, fk_departamento_id, fk_perfil_id, nombre, apellido),
        UNIQUE (usuario, email)
    );
END;
-- INFORMACION DE LA TABLA
BEGIN
    DESCRIBE usuarios;
END;
-- MOSTRAR TODOS LOS REGISTROS
BEGIN
    SELECT 
        usuarios.id,
        usuarios.nombre,    
        usuarios.apellido,
        usuarios.usuario,  
        usuarios.email,
        usuarios.password,
        usuarios.telefono,
        sucursales.nombre AS sucursal,
        usuarios.fk_sucursal_id,
        departamentos.nombre AS departamento,
        usuarios.fk_departamento_id,
        perfiles.nombre AS perfil,
        usuarios.fk_perfil_id,
        usuarios.estado,
        usuarios.sesion,
        usuarios.fecha_registro as fechaRegistro, 
        usuarios.fecha_actualizacion as fechaActualizacion
    FROM 
        usuarios
    INNER JOIN 
        sucursales ON usuarios.fk_sucursal_id = sucursales.id
    INNER JOIN
        departamentos ON usuarios.fk_departamento_id = departamentos.id
    INNER JOIN 
        perfiles ON usuarios.fk_perfil_id = perfiles.id;
END;
-- INSERTAR REGISTRO
BEGIN
    INSERT INTO usuarios(
        nombre,
        apellido,
        telefono,
        email,
        usuario, 
        password,
        fk_sucursal_id,
        fk_departamento_id
        fk_perfil_id,
    ) VALUES (
        'Luis Andresss',
        'Rodriguez Camspos',
        '8713465734',
        'luis.rodriguesz@gmailss.com',
        'luissrodrsiguezs292025816', 
        '1234567890',
        1,
        1,
        1
    );
END;
-- FILTRAR REGISTROS
BEGIN
    SELECT 
        usuarios.id,
        usuarios.nombre,    
        usuarios.apellido,
        usuarios.usuario,  
        usuarios.password, 
        usuarios.email,
        usuarios.telefono,
        sucursales.nombre AS sucursal,
        usuarios.fk_sucursal_id,
        departamentos.nombre AS departamento,
        usuarios.fk_departamento_id,
        perfiles.nombre AS perfil,
        usuarios.fk_perfil_id,
        usuarios.estado,
        usuarios.sesion,
        usuarios.fecha_registro as fechaRegistro, 
        usuarios.fecha_actualizacion as fechaActualizacion
    FROM 
        usuarios
    INNER JOIN 
        sucursales ON usuarios.fk_sucursal_id = sucursales.id
    INNER JOIN
        departamentos ON usuarios.fk_departamento_id = departamentos.id
    INNER JOIN 
        perfiles ON usuarios.fk_perfil_id = perfiles.id
    WHERE
        usuarios.id = 1
    ORDER BY perfiles.nombre ASC LIMIT 20;
END;
-- EDITAR TODOS LOS CAMPOS DE UN REGISTRO POR ID
BEGIN
    UPDATE usuarios
    SET 
        usuarios.nombre = "Luis Andres",
        usuarios.apellido = "Rodriguez Campos",
        usuarios.telefono = "1234567890",
        usuarios.email = "andres.rodriguez@gmail.com",
        usuarios.password = "1234567890",
        usuarios.fk_sucursal_id = 2,
        usuarios.fk_departamento_id = 1,
        usuarios.fk_perfil_id = 1
    WHERE usuarios.id = 2;
END;
-- ELIMINAR UN REGISTRO POR ID
BEGIN
    DELETE FROM usuarios
    WHERE id = 1;
END;
-- BORRAR TODOS LOS REGISTROS
BEGIN
    TRUNCATE TABLE usuarios;
END;
-- ELIMINAR TABLA
BEGIN
    DROP TABLE usuarios;
END;
