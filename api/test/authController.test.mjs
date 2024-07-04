import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import escapeHtml from 'escape-html';
import db from '../models/index.js';
import * as authController from '../controllers/authController.js';

const User = db.User;

describe('AuthController', () => {
  describe('register', () => {
    let req, res, userStub, validationResultStub;

    beforeEach(() => {
      req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          isAdmin: false
        }
      };

      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      userStub = sinon.stub(User, 'create').resolves({
        id: 1,
        username: escapeHtml(req.body.username),
        email: escapeHtml(req.body.email),
        password: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.isAdmin
      });

      validationResultStub = sinon.stub(validationResult(req), 'isEmpty');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should register a new user', async () => {
      validationResultStub.returns(true);

      await authController.register(req, res);
      
      expect(userStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ message: 'User registered successfully' })).to.be.true;
    });

    

    it('should handle server errors', async () => {
      userStub.rejects(new Error('Server error'));

      await authController.register(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Server error' })).to.be.true;
    });
  });

});


