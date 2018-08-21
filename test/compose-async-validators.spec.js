import { composeAsyncValidators } from '../src/compose-async-validators';

describe('composeAsyncValidators', () => {
  const valuesMock = {};
  const dispatchMock = function () {
  };
  const propsMock = {};
  const validatorsMock = {};

  test('is a function', () => {
    expect(composeAsyncValidators).toBeFunction();
  });

  test('returns a function when invoked', () => {
    expect(composeAsyncValidators()).toBeFunction();
  })

  test('invokes the validator function corresponding to the blurred field', () => {
    const valuesMock = { username: 'johndoe' };
    const usernameValidator = jest.fn().mockResolvedValue('foo');

    const validators = {
      username: [usernameValidator, 'Username is invalid!!!'],
      email: [jest.fn(), 'Email is invalid!!!']
    };

    composeAsyncValidators(validators)(valuesMock, dispatchMock, propsMock, 'username');

    expect(usernameValidator).toHaveBeenCalledWith(valuesMock.username);
  });

  test('returns rejected promise with an error object containing the given error message when the associated validator function rejects', async () => {
    const validators = {
      username: [jest.fn().mockRejectedValue('foo'), 'Username is not available'], // validator rejects
      email: [jest.fn(), 'Email is not available']
    };

    await expect(composeAsyncValidators(validators)(valuesMock, dispatchMock, propsMock, 'username'))
      .rejects.toEqual({ username: 'Username is not available' });
  });

  test('returns rejected promise with the previous async errors of other fields even if the validator for the current blurred field resolves', async () => {
    const valuesMock = {};
    const propsMock = {
      asyncErrors: {
        email: 'Email is not available' // another field has errors
      }
    };

    const validators = {
      username: [jest.fn().mockResolvedValue('foo'), 'Username is not available'],
      email: [jest.fn(), 'email is not available']
    };

    await expect(composeAsyncValidators(validators)(valuesMock, dispatchMock, propsMock, 'username'))
      .rejects.toEqual({ email: 'Email is not available' });
  });

  test('returns resolved promise with value of undefined if the validator for blurred field resolves and no other field had errors', async () => {
    const valuesMock = {};
    const propsMock = {}; // props.asyncErrors is not defined so no other errors

    const validators = {
      username: [jest.fn().mockResolvedValue('bar'), 'foo'],
      password: [jest.fn(), 'foo']
    };

    await expect(composeAsyncValidators(validators)(valuesMock, dispatchMock, propsMock, 'username'))
      .resolves.toBe(undefined);
  });

  test('returns resolved promise with value of undefined if the blurred field previously had an error but its validator now resolved', async () => {
    const propsMock = {
      asyncErrors: {
        username: 'Username is not available'
      }
    };

    const validators = {
      username: [jest.fn().mockResolvedValue('bar'), 'foo'],
      password: [jest.fn(), 'foo']
    };

    await expect(composeAsyncValidators(validators)(valuesMock, dispatchMock, propsMock, 'username'))
      .resolves.toBe(undefined);
  });

  test('returns resolved promise with value of undefined if blurredField param is undefined', async () => {
    await expect(composeAsyncValidators(validatorsMock)(valuesMock, dispatchMock, propsMock, undefined))
      .resolves.toBe(undefined);
  });
});
