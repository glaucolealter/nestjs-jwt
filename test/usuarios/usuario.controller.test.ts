import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('UsuarioController (e2e)', () => {
    let app: INestApplication;
    let idUsuarioTeste: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET - Deve retornar a listagem de todos os usuários', async () => {
        const response = await request(app.getHttpServer()).get('/usuarios');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.usuarios)).toBe(true);
    });

    it('POST - Deve criar um novo usuário', async () => {
        const novoUsuario = {
            nome: 'Novo usuário',
            email: 'novo@usuario.com',
            senha: '87654321'
        };

        const response = await request(app.getHttpServer())
            .post('/usuarios')
            .send(novoUsuario);

        expect(response.status)
            .toBe(201);
        expect(response.body)
            .toHaveProperty('usuario');
        expect(response.body.usuario)
            .toHaveProperty('id');
        expect(response.body.usuario.nome)
            .toEqual(novoUsuario.nome);
        
        idUsuarioTeste = response.body.usuario.id;
    });

    it('DELETE - Deve excluir o novo usuário', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/usuarios/${idUsuarioTeste}`);

        expect(response.status)
            .toBe(200);
    });
});
