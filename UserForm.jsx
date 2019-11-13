/* eslint-disable react/prop-types */

import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styled from "styled-components";

const UserForm = props => {
  const {cancle, errors, submit, submitButtonText, elements, passwordErrors} = props;


  function handleSubmit(evt) {
    evt.preventDefault();
    submit();
  }

  function handleCancel(evt) {
    evt.preventDefault();
    cancle();
  }

  return (
    <>
      <ErrorsDisplay errors={errors} passwordErrors={passwordErrors} />
      <Form onSubmit={handleSubmit}>
        {elements}
        <Button className="mr-1" variant="primary" type="submit">
          {submitButtonText}
        </Button>
        <Button className="mr-1" variant="secondary" onClick={handleCancel}>
          Cancle
        </Button>
      </Form>
    </>
  );
};

function ErrorsDisplay({ errors, passwordErrors }) {
  let errorsDisplay = null;

  if (errors.length) {
    errorsDisplay = (
        <>
        <ValidationLabel>Errors</ValidationLabel>
        <ValidationUl>
          {errors.map((error, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={i}>{error}</li>
          ))}
        </ValidationUl>
      </>
    );
  } else if (!passwordErrors) {
    errorsDisplay = (
        <>
        <ValidationLabel>Errors</ValidationLabel>
        <ValidationUl>
          <li>Passowrd must match</li>
        </ValidationUl>
      </>
    );
  }
  return errorsDisplay;
}

const ValidationUl = styled.div`
  color: red;
  padding: 15px 0 40px 10px;
  `;
const ValidationLabel = styled.h2`
  color: #0069c0;
  font-size: 28px;
  `;

export default UserForm;
