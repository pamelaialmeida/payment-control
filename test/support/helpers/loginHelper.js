const request = require('supertest');
const { base_URL, endpoint } = require('../urls.js');

async function login(credentials) {
    return request(base_URL)
        .post(endpoint)
        .send({
            query: `mutation Login($email: String!, $senha: String!) {
                                login(email: $email, senha: $senha) {
                                    token
                                }
                            }`,
            variables: credentials
        });
}

module.exports = {
    login
}