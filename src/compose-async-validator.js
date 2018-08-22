/**
 * Compose async validator function.
 *
 * @param validators {object}
 * @returns {function}
 */
export function composeAsyncValidator(validators) {
  /**
   * Async validator function.
   *
   * @param values {object}
   * @param dispatch {function}
   * @param props {object}
   * @param blurredField {string}
   *
   * @returns Promise<object|undefined>
   */
  return async (values, dispatch, props, blurredField) => {
    // `blurredField` wil be undefined when the asyncValidation function is invoked on
    // form submission.

    // This guard assumes that when the user is able to submit the form, there will
    // be no async errors.
    if (typeof blurredField === 'undefined') {
      return Promise.resolve();
    }

    let asyncErrors = Object.assign({}, props.asyncErrors);

    const fieldValue = values[blurredField];
    const [asyncFieldValidator, message] = validators[blurredField];

    await asyncFieldValidator(fieldValue)
      .then(() => {
        delete asyncErrors[blurredField];
      })
      .catch(() => asyncErrors[blurredField] = message);

    return Object.keys(asyncErrors).length
      ? Promise.reject(asyncErrors)
      : Promise.resolve();
  };
}