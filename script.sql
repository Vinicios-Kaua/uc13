--Criação do Banco de dados
CREATE DATABASE IF NOT EXISTS ecommerce_pc
    DEFAULT CHARACTER SET = 'utf8mb4'

--Sinalizando a utilização do banco
USE ecommerce_pc;

CREATE TABLE Clientes{
    id_cliente INT primary key AUTO_INCREMENT,
    nome VARCHAR(100)NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    endereco TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
};

CREATE TABLE Categorias{
    id_categoria INT primary key AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT 
};

CREATE TABLE Produtos{
    id_produto INT primary key AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2)NOT NULL,
    estoque INT DEFAULT 0,
    id_categoria INT, 
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES Categorias (id_categoria)
};
CREATE TABLE Pedido{
    id_pedido INT primary key AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    status_pedido VARCHAR(50)DEFAULT 'Em andamento'
    FOREIGN KEY (cliente_id)REFERENCES Clientes(id_cliente)
};
CREATE TABLE Item_Pedido{
    id_item_pedido INT primary key AUTO_INCREMENT,
    pedido_id INT,
    produto_id INT,
    quantidade INT,
    preco_unitario DECIMAL(10,2)
    FOREIGN KEY (pedido_id)REFERENCES Pedido(id_pedido),
    FOREIGN KEY (produto_id)REFERENCES Produtos(id_produto)
};

