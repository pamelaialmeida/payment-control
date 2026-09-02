const request = require('supertest');
const { expect } = require('chai');

describe('Mutation - Login', () => {

    const base_URL = 'http://localhost:4000';
    const endpoint = '/graphql';

    it('Deve realizar login com sucesso quando informo credenciais validas', async () => {
        const response = await request(base_URL)
            .post(endpoint)
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                        }`,
                variables: {
                    "email": "admin@admin.com",
                    "senha": "123456"
                }
            });

        expect(response.status).to.equal(200);
        expect(response.body.data.login).to.have.property('token');
        expect(response.body.data.login.token).to.be.a('string');
        expect(response.body.data.login.token).to.not.be.empty;
    });

    it('Nao deve realizar login quando informo ambas credenciais invalidas', async () => {
        const response = await request(base_URL)
            .post(endpoint)
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                        }`,
                variables: {
                    "email": "admins@admin.com",
                    "senha": "1234567"
                }
            });

        expect(response.status).to.equal(200);
        expect(response.body.errors).to.be.an('array');
        expect(response.body.errors).to.have.length.greaterThan(0);
        expect(response.body.errors[0]).to.have.property('message');
        expect(response.body.errors[0].message).to.be.a('string');
        expect(response.body.errors[0].message).to.equal('Credenciais inválidas ou usuário inativo.');
    });

    it('Nao deve realizar login quando informo email inexistente', async () => {
        const response = await request(base_URL)
            .post(endpoint)
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                        }`,
                variables: {
                    "email": "admin01@admin.com",
                    "senha": "123456"
                }
            });

        expect(response.status).to.equal(200);
        expect(response.body.errors[0]).to.have.property('message');
        expect(response.body.errors[0].message).to.equal('Credenciais inválidas ou usuário inativo.');
    });

    it('Nao deve realizar login quando informo senha incorreta', async () => {
        const response = await request(base_URL)
            .post(endpoint)
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                        }`,
                variables: {
                    "email": "admin@admin.com",
                    "senha": "1234567"
                }
            });

        expect(response.status).to.equal(200);
        expect(response.body.errors[0]).to.have.property('message');
        expect(response.body.errors[0].message).to.equal('Credenciais inválidas ou usuário inativo.');
    });

    it('Nao deve realizar login quando informo email em formato invalido - Sem @', async () => {
        const response = await request(base_URL)
            .post(endpoint)
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                        }`,
                variables: {
                    "email": "adminadmin.com",
                    "senha": "123456"
                }
            });
        
            expect(response.status).to.equal(200);
            expect(response.body.errors[0]).to.have.property('message');
            expect(response.body.errors[0].message).to.equal('Credenciais inválidas ou usuário inativo.');
    });

    it('Nao deve realizar login quando informo atributo email com tipo invalido', async () => {
        const response = await request(base_URL)
            .post(endpoint)
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                        }`,
                variables: {
                    "email": true,
                    "senha": "123456"
                }
            });
        
        expect(response.status).to.equal(400);
        expect(response.body.errors[0]).to.have.property('message');
        expect(response.body.errors[0].message).to.equal(`Variable \"$email\" got invalid value true; String cannot represent a non string value: true`);
    });

    it('Nao deve realizar login quando informo atributo senha com tipo invalido', async () => {
        const response = await request(base_URL)
            .post(endpoint)
            .send({
                  query: `mutation Login($email: String!, $senha: String!) {
                            login(email: $email, senha: $senha) {
                                token
                            }
                        }`,
                variables: {
                    "email": "admin@admin.com",
                    "senha": 123456
                }              
            });
        
        expect(response.status).to.equal(400);
        expect(response.body.errors[0]).to.have.property('message');
        expect(response.body.errors[0].message).to.equal('Variable \"$senha\" got invalid value 123456; String cannot represent a non string value: 123456');
    });

});