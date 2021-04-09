const chai = require('chai');

const expect = chai.expect;
const request = require('supertest');
const app = require('../server').app;
const should = chai.should();

describe('GraphQL', () => {
    it('should create url', (done) => {
        // const isObscured = true;
        const data = {
            query: 'mutation { shortenUrl(url: "https://exampleofalongpost.com/C/Foo") { hash, short_url } }'
        };
        request(app).post('/graphiql')
        .send(data)
        .expect(200)
        .end((err,res) => {
            // res will contain object with url, hash and short_url
            if (err) return done(err);
            should.exist(res.body);
            res.body.data.shortenUrl.should.have.property('hash');
            res.body.data.shortenUrl.should.have.property('short_url');
            done();
        })
    })

    it('Returns all URLs', (done) => {
        request(app).post('/graphiql')
        .send({ query: '{ listURLs { url short_url hash } }' })
        .expect(200)
        .end((err, res) => {
            // res will contain array of all urls
            if (err) return done(err);
            // assume there is 1 url in the database
            should.exist(res.body);
            res.body.data.listURLs[0].should.have.property('short_url');
            res.body.data.listURLs[0].should.have.property('url');
            res.body.data.listURLs.should.be.a('array');
            done();
        })  
    })
});