# redux-form-async-validator
---

`redux-form-async-validator` aims to provide an easy way to perform asynchronous validation on multiple [redux-form](https://github.com/erikras/redux-form) fields.

## Installation
npm: `npm install redux-form-async-validator --save`

yarn: `yarn add redux-form-async-validator`

## Usage
See below for an example usage:
```javascript
import { composeAsyncValidator } from 'redux-form-async-validator';

const asyncValidateUsername = /* Some validator */
const asyncValidateEmail = /* Some validator */

export default reduxForm({
  form: 'some-form',
  asyncValidate: composeAsyncValidator({
    username: [asyncValidateUsername, 'Username is not available'],
    email: [asyncValidateEmail, 'Email is not available']
  }),
  asyncChangeFields: ['email', 'username']
})(YourFormComponent);
```

## API

#### `composeAsyncValidator (validatorObj: object) -> (asyncValidator: function)`

##### Parameters

`validatorObj: object` (required): An object in which each key corresponds to a field name and each value is an array containing an asynchronous validator function and the error message should the validation fail.
All validator functions **must** return a `Promise` -  a resolved promise to indicate successful validation or a rejected promise to indicate a failed validation.

##### Return

`asyncValidator: function`: The resulting validator function uses the provided `validatorObj` to ensure that the correct validator function runs whenever an async field changes. This resulting `asyncValidator` function will be invoked everytime any fields listed in the `asyncChangeFields` prop changes (See the [redux-form docs](https://redux-form.com/7.4.2/examples/asyncchangevalidation/) for more info).