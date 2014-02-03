var request = require('supertest')
, express = require('express');

require('../app.js');

describe;('login page', function(){
    it('may respond with ', function(done){
        setTimeout(function(){
            request(app)
            .get('/')
            .expect(200, done);
        },10);
    });
});

describe('Login with false crednetials', function(){

    it(' should respond with ', function(done){
         request(app)
        .post("/logincheck")
        .send( {'username':'false', 'userpass': 'wrong'} )
        .expect(200, { 
                data: 0
            }, 
            done
        )
    })
});

describe('Login with correct crednetials', function(){
    //before("Get the user's id", function(){
    user_id = "528f2b38340cc51a1b000001";
    //})
    it(' should respond with ', function(done){
         request(app)
        .post("/logincheck")
        .send( {'username':'arya', 'userpass': 'test'} )
        .expect(200, { 
                data: 1, 
                user_id: user_id }, 
                done
        )
    })
});

describe('user page, without logging in', function(){
    //before("Get the user's id", function(){
    user_id = "528f2b38340cc51a1b000001";
    //})
    
    it(' should respond with ', function(done){
         request(app)
        .get("/user/52a70db0f9270faf1e681fe4")
        .expect(302, {}, 
                done
        )
    })
});
