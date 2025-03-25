import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module'

describe('Rotas de Produto', () => {
    let app: INestApplication;
    let idProdutoTeste: string;

    beforeAll(async () => {
        const moduloTeste: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduloTeste.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET - Deve retornar a listagem de todos produtos', async () => {
        const response = await request(app.getHttpServer()).get('/produtos');

        expect(response.status)
            .toBe(200);
        expect(Array.isArray(response.body))
            .toBe(true);
    });

    it('POST - Deve criar um novo produto', async () => {
        const novoProduto = {
            nome: 'Novo Produto',
            valor: 10,
            quantidadeDisponivel: 20,
            descricao: 'Um produto apenas para teste',
            categoria: 'Alimentos',
            caracteristicas: [],
            imagens: [],
            itensPedido: []
        };

        const response = await request(app.getHttpServer())
            .post('/produtos')
            .send(novoProduto);

        expect(response.status)
            .toBe(201);
        expect(response.body)
            .toHaveProperty('produto');
        expect(response.body.produto)
            .toHaveProperty('id');
        expect(response.body.produto.nome)
            .toEqual(novoProduto.nome);
        
        idProdutoTeste = response.body.produto.id;
    });

    it('DELETE - Deve excluir o novo produto', async () => {
        const response = await request(app.getHttpServer())
        	.delete(`/produtos/${idProdutoTeste}`);

        expect(response.status)
            .toBe(200);
    });
});
