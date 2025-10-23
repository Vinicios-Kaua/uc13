const express = require ('express');
const app = express();
const mysql = require('mysql2')
const { engine } = require ('express-handlebars');

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/static', express.static(__dirname + '/static'));
const session = require('express-session');
const bcrypt = require ('bcrypt');
app.use (express.urlencoded({extended: true}));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views')

app.use(session({
    secret: 'chave-secreta-ultra-segura',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 3600000}
}));


const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senac',
    port: '3306',
    database: 'ecommerce_pc'
});

conexao.connect((erro) => {
    if (erro){
        console.error('Erro ao conectar ao banco de dados:', erro);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
});


app.get ("/", (req, res) => {
    let sql = 'SELECT * FROM Produtos';
    conexao.query(sql,function(erro, produtos_qs){
        if(erro){
            console.error('Erro ao consultar produtos:', erro);
            res.status(500).send('Erro ao consultar produtos');
            return;
        }
    res.render('index', { produtos: produtos_qs });
});
});


app.get ("/Clientes", (req, res) => {
    let sql = 'SELECT * FROM Clientes';
    conexao.query(sql,function(erro, clientes_qs){
        if(erro){
            console.error('Erro ao consultar clientes:', erro);
            res.status(500).send('Erro ao consultar clientes');
            return; 
        }
    res.render('clientes', { clientes: clientes_qs });
});
});

app.get('/produtos/add',(req, res) => {
    
    let sql = 'SELECT id_categoria, nome FROM Categorias';
    conexao.query(sql, function(erro, categorias_qs) {
        if (erro) {
            console.error('Erro ao consultar cliente: ', erro);
            res.status(500).send('Erro ao consultar cliente');
            return;
            
        }
        res.render('form_produto', {categorias: categorias_qs});
    });
});

app.post('/produtos/add', (req, res) => {
    const { nome, descricao, preco, estoque, id_categoria } = req.body;

    const sql = `
        INSERT INTO Produtos (nome, descricao, preco, estoque, id_categoria)
        VALUES (?, ?, ?, ?, ?)
    `;

    conexao.query(sql, [nome, descricao, preco, estoque, id_categoria], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao inserir produto:', erro);
            return res.status(500).send('Erro ao adicionar produto.');
        }

        res.redirect('/');
    });    
});

app.get('/produtos/:id', (req, res) => {
    const id = req.params.id
    const sql = `
    SELECT Produtos.*,
        Categorias.nome AS categoria_nome
FROM Produtos
JOIN Categorias ON Produtos.id_categoria = Categorias.id_categoria
WHERE id_produto = ?
`;

conexao.query(sql, [id], function(erro, produtos_qs){
    if(erro){
        console.error('Erro ao consultar produto: ', erro)
        res.status(500).send('Erro ao consultar produto');
        return;
    }
    if (produtos_qs.length === 0){
        return res.status(404).send('Produto não encontrado')
    }
    res.render('produto', {produto: produtos_qs[0]});
});
});

app.get ("/Categorias", (req, res) => {
    let sql = 'SELECT * FROM Categorias';
    conexao.query(sql,function(erro, categorias_qs){
        if(erro){
            console.error('Erro ao consultar a tabela de Categoria:', erro);
            res.status(500).send('Erro ao consultar Categoria');
            return; 
        }
    res.render('categorias', { categorias: categorias_qs });
});
});

app.get ("/Produto", (req, res) => {
    let sql = 'SELECT * FROM Produtos';
    conexao.query(sql,function(erro, produto_qs){
        if(erro){
            console.error('Erro ao consultar produtos:', erro);
            res.status(500).send('Erro ao consultar produtos');
            return;
        }
    res.render('produto', { produtos: produto_qs });
});
});


app.get('/Clientes/cadastrar', (req, res) => {
    res.render ('cadastrar')
});

app.post('/Clientes/cadastrar', (req, res) => {
    const {nome, email, senha, endereco} = req.body

    bcrypt.bash(senha, 10, (erro,Hash)=>{
        if (erro){
            console.error('Erro ao criptografar a senha', erro);
            return res.status(500).send('Erro interno no servidor.');
        }
        const slqUsuario = 'INSERT INTO Usuarios(nome, email, senha, tipo)VALUES (?,?,?,?)';
        conexao.query(slqUsuario,[nome, email, hash, 'comum'], (erro, resultado)=>{
            if(erro){
                console.error('Erro ao inserir usúario', erro);
                return res.status(500).send('Erro ao cadastrar usuário')
            }

            const usuario_id = resultado.insertId
            const sqlCliente = 'INSERT INTO CLientes (nome, endereco, usuario_id) VALUES (?, ?, ?)';
                if(erro2){
                    console.error('Erro ao inserir cliente:', erro2);
                    return res.status(500).send('Erro ao cadastrar cliente.')
                }
                res.redirect('/')
        });
    });
});


app.listen(8080);

