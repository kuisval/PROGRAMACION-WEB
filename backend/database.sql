-- Crear base de datos
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'boardgames_db')
BEGIN
    CREATE DATABASE boardgames_db;
END
GO

USE boardgames_db;
GO

-- Tabla BOARDGAMES
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'boardgames')
BEGIN
    CREATE TABLE boardgames (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(80) NOT NULL,
        publisher VARCHAR(60) NOT NULL,
        category VARCHAR(2) NOT NULL,
        description VARCHAR(200) NULL,
        year VARCHAR(4) NULL,
        created_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- Tabla FAVORITES
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'favorites')
BEGIN
    CREATE TABLE favorites (
        id INT IDENTITY(1,1) PRIMARY KEY,
        idBoardgame INT NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_favorites_boardgames FOREIGN KEY (idBoardgame) 
            REFERENCES boardgames(id) ON DELETE CASCADE
    );
END
GO

-- Datos de ejemplo
IF NOT EXISTS (SELECT * FROM boardgames)
BEGIN
    INSERT INTO boardgames (name, publisher, category, description, year) VALUES
    ('Catan', 'Catan Studio', '14', 'Juego de estrategia sobre colonización de islas', '1995'),
    ('Azul', 'Plan B Games', '12', 'Juego de construcción de mosaicos', '2017'),
    ('Wingspan', 'Stonemaier Games', '13', 'Juego de colección de aves', '2019'),
    ('Gloomhaven', 'Cephalofair Games', '11', 'Juego de aventuras cooperativo', '2017'),
    ('Terraforming Mars', 'FryxGames', '15', 'Colonización y terraformación de Marte', '2016');
END
GO