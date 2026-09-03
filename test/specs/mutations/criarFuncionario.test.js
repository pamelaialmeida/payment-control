const request = require('supertest');
const { expect } = require('chai');
const { faker } = require('@faker-js/faker');
const { base_URL, endpoint } = require('../../support/urls.js');

describe('Mutation - Criar Funcionario', () => {

    // const base_URL = 'http://localhost:4000';
    // const endpoint = '/graphql';

    it('Deve criar funcionario quando preencho somente os campos obrigatorios', async () => {

        const userData = {
            cpf: faker.string.numeric(11),
            nome: faker.person.fullName(),
            salario_base: faker.number.float({ min: 1000, max: 500000, fractionDigits: 2 }),
            admissao: faker.date.between({
                from: '1998-01-01',
                to: '2026-08-31'
            }).toISOString().split('T')[0]
        };

        const response = await request(base_URL)
            .post(endpoint)
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTQwMDAtODAwMC0wMDAwMDAwMDAwMDEiLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTc4ODM4NzEyMywiZXhwIjoxNzg4NDE1OTIzfQ.A2xoTdqAnELxGkc_2S4ZY6tsdlopnb2SfTbe4Mgq5F0')
            .send({
                query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
                        id
                        cpf
                        nome
                        salario_base
                        admissao
                    }
                    }`,
                variables: {
                    "input": {
                        "cpf": userData.cpf,
                        "nome": userData.nome,
                        "salario_base": userData.salario_base,
                        "admissao": userData.admissao
                    }
                }
            });

        expect(response.status).to.equal(200);
        expect(response.body.data).to.have.property('criarFuncionario');
        expect(response.body.data.criarFuncionario).to.have.property('id').that.is.a('string').and.not.empty;

        expect(response.body.data.criarFuncionario).to.have.property('cpf').that.is.a('string').and.not.empty;
        expect(response.body.data.criarFuncionario.cpf).to.equal(userData.cpf);

        expect(response.body.data.criarFuncionario).to.have.property('nome').that.is.a('string').and.not.empty;
        expect(response.body.data.criarFuncionario.nome).to.equal(userData.nome);

        expect(response.body.data.criarFuncionario).to.have.property('salario_base').that.is.a('number');
        expect(response.body.data.criarFuncionario.salario_base).to.equal(userData.salario_base);

        expect(response.body.data.criarFuncionario).to.have.property('admissao').that.is.a('string').and.not.empty;
        expect(response.body.data.criarFuncionario.admissao).to.equal(userData.admissao);
    });

})