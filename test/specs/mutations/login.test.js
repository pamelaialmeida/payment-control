const request = require('supertest');
const { expect } = require('chai');
const { login } = require('../../support/helpers/loginHelper.js');
const loginData = require('../../support/fixtures/loginData.json');

describe('Mutation - Login', () => {


    it('Deve realizar login com sucesso quando informo credenciais validas', async () => {
        const response = await login(loginData.admin);

        expect(response.status).to.equal(200);
        expect(response.body.data.login).to.have.property('token');
        expect(response.body.data.login.token).to.be.a('string');
        expect(response.body.data.login.token).to.not.be.empty;
    });

    it('Nao deve realizar login quando informo ambas credenciais invalidas', async () => {
        const credentials = {
            "email": "admins@admin.com",
            "senha": "1234567"
        }

        const response = await login(credentials);

        expect(response.status).to.equal(200);
        expect(response.body.errors).to.be.an('array');
        expect(response.body.errors).to.have.length.greaterThan(0);
        expect(response.body.errors[0]).to.have.property('message').that.is.a('string').equal('Credenciais inválidas ou usuário inativo.');
    });

    it('Nao deve realizar login quando informo email inexistente', async () => {
        // ... >> clona informacoes do user admin, mas substitui o atributo email pelo novo valor -> Spread (construindo novo objeto)
        const credentials = { ...loginData.admin, email: 'admin01@admin.com'};
        
        const response = await login(credentials);

        expect(response.status).to.equal(200);
        expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.');
    });

    it('Nao deve realizar login quando informo senha incorreta', async () => {
        const credentials = { ...loginData.admin, senha: '1234567'};

        const response = await login(credentials);

        expect(response.status).to.equal(200);
        expect(response.body.errors[0]).to.have.property('message');
        expect(response.body.errors[0].message).to.equal('Credenciais inválidas ou usuário inativo.');
    });

    it('Nao deve realizar login quando informo email em formato invalido - Sem @', async () => {
        const credentials = { ...loginData.admin, email:'adminadmin.com'};

        const response = await login(credentials);

        expect(response.status).to.equal(200);
        expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.');
    });

    it('Nao deve realizar login quando informo atributo email com tipo invalido', async () => {
        const credentials = { ...loginData.admin, email: true};

        const response = await login(credentials);

        expect(response.status).to.equal(400);
        expect(response.body.errors[0]).to.have.property('message');
        expect(response.body.errors[0].message).to.equal(`Variable \"$email\" got invalid value true; String cannot represent a non string value: true`);
    });

    it('Nao deve realizar login quando informo atributo senha com tipo invalido', async () => {
        const credentials = { ...loginData.admin, senha: 123456 };

        const response = await login(credentials);

        expect(response.status).to.equal(400);
        expect(response.body.errors[0]).to.have.property('message');
        expect(response.body.errors[0].message).to.equal('Variable \"$senha\" got invalid value 123456; String cannot represent a non string value: 123456');
    });

    it("Nao deve realizar login quando atributo email nao eh enviado", async () => {
        // cria duas constantes, onde a primeira indica qual atributo e valor deve ser 'retirado' do objeto que esta sendo copiado (e a primeira constante fica com este valor)
        // ... >> clona informacoes do user admin para a segunda constante (que tem o ... na frente), mas sem o atributo correspondente a primeira constante criada 
        // -> Rest (destructuring; primeira variavel indica o que extrair individualmente do objeto e variavel com ... na frente recebe o resto das propriedades do objeto)
        const { email, ...credentials } = loginData.admin;

        const response = await login(credentials);

        expect(response.status).to.equal(400);
        expect(response.body.errors[0]).to.have.property('message');
        expect(response.body.errors[0].message).to.equal('Variable \"$email\" of required type \"String!\" was not provided.');
    });

    it("Nao deve realizar login quando atributo senha nao eh enviado", async () => {
        const { senha, ...credentials } = loginData.admin;

        const response = await login(credentials);

        expect(response.status).to.equal(400);
        expect(response.body.errors[0]).to.have.property('message');
        expect(response.body.errors[0].message).to.equal('Variable \"$senha\" of required type \"String!\" was not provided.');
    });

    // TODO: Adicionar teste para nao logar com usuario inativo

});