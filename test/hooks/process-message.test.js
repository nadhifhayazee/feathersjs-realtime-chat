const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const processMessage = require('../../src/hooks/process-message');

describe('\'process-message\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/messages', {
      async create(data){
        return data;
      }
    });

    app.service('messages').hooks({
      before: {
        create: processMessage()
      }
    });

  });

    it('processes the message as expected', async () => {

      const user = { _id: 'test' };
      const params = { user };
      
      const message = await app.service('messages').create({
        text: 'Hi there',
        additional: 'should be removed'
      }, params);

      assert.equal(message.text, 'Hi there');

      assert.equal(message.userId, 'test');

      assert.ok(!message.additional);

    });

});
