const bodyParser = require('body-parser');
const express = require('express');
const PDFDocument = require('pdfkit');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('home'));
app.use(express.static(path.join(__dirname, 'public')));

const laboratorios = [
    { id: 1, nome: 'lab I', capacidade: 20, descricao: 'laboratorio 1' },
    { id: 2, nome: 'lab II', capacidade: 15, descricao: 'laboratorio 2' },
    { id: 3, nome: 'lab III', capacidade: 30, descricao: 'laboratorio 3' },
    { id: 4, nome: 'lab IV', capacidade: 10, descricao: 'laboratorio 4' },
    { id: 5, nome: 'lab V', capacidade: 15, descricao: 'laboratorio 5' },
    { id: 6, nome: 'lab VI', capacidade: 20, descricao: 'laboratorio 6' },
];

app.get('/laboratorio/todos', (req, res) => {
    res.json(laboratorios);
});

app.get('/laboratorio/novo', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'novo.html'));
});

app.post('/laboratorio/novo', (req, res) => {
    const resposta = req.body;
    const id = laboratorios.length > 0 ? laboratorios[laboratorios.length - 1].id + 1 : 1;
 
    const novoLab = { id, ...resposta };
    laboratorios.push(novoLab);

    res.send('laboratorio adicionado com sucesso');
});

app.get('/laboratorio/relatorio', (req, res) => {
    const doc = new PDFDocument();
    doc.pipe(res);
    
    doc.fontSize(16).text('relatorio de laboratorios\n\n');

    laboratorios.forEach(laboratorio => {
        doc.text(`id: ${laboratorio.id}`);
        doc.text(`nome: ${laboratorio.nome}`);
        doc.text(`capacidade: ${laboratorio.capacidade}`);
        doc.text(`descrição: ${laboratorio.descricao}`);
        doc.text('----------------------------------------');
    });

    doc.end();
});

const middleware = (req, res, next) => {
    const horaAtual = new Date().getHours();
    console.log('hora atual:', horaAtual);
    if (horaAtual >= 8 && horaAtual < 17) {
        next();
    } else {
        res.status(403).send('acesso permitido somente entre 08h e 17h');
    }
};

app.use('/laboratorio/novo', middleware);
app.use('/laboratorio/relatorio', middleware);

app.listen(port, () => console.log(`rodando na porta ${port}! http://localhost:${port}/`));
