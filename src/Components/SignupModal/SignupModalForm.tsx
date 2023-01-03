import React from "react";
import { Formik, Field, Form } from "formik";
import { SIGNUP_MODAL_NAME } from "../../Core/Consts/consts";
import { REGISTER_ROUTE } from "../../Core/Consts/routeNames";

function getSendVals(values: any) {
  return {
    email: values.email,
    username: values.username,
    password: values.password,
  };
}

export default function SignupModalForm() {
  return (
    <Formik
      initialValues={{
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={async (values) => {
        const res = await fetch(REGISTER_ROUTE, {
          method: "POST",
          body: JSON.stringify(getSendVals(values)),
        });
        document.getElementById(SIGNUP_MODAL_NAME)?.click();
      }}
    >
      <Form className="mx-auto flex w-fit flex-grow flex-col items-center justify-around">
        <div>
          <label className="label " htmlFor="email">
            <span className="label-text text-lg">Email</span>
          </label>
          <Field
            id="email"
            name="email"
            placeholder="jane@acme.com"
            type="email"
            className="input-bordered input w-full max-w-xs"
          />
        </div>
        <div>
          <label className="label " htmlFor="username">
            <span className="label-text text-lg">username</span>
          </label>
          <Field
            id="username"
            name="username"
            placeholder="JohnnyCool"
            className="input-bordered input w-full max-w-xs"
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            <span className="label-text text-lg">Password</span>
          </label>
          <Field
            id="password"
            name="password"
            className="input-bordered input w-full max-w-xs"
          />
        </div>
        <div>
          <label className="label" htmlFor="confirmPassword">
            <span className="label-text text-lg">Confirm Password</span>
          </label>
          <Field
            id="confirmPassword"
            name="confirmPassword"
            className="input-bordered input w-full max-w-xs"
          />
        </div>
        <button
          type="submit"
          className="text-md btn-ghost btn mx-auto block bg-green-500 text-slate-50"
        >
          Submit
        </button>
      </Form>
    </Formik>
  );
}
