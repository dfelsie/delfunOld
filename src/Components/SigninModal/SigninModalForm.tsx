import React from "react";
import { Formik, Field, Form } from "formik";
import { SIGNIN_MODAL_NAME } from "../../Core/Consts/consts";
import FETCH_BODY from "../../Core/Consts/fetchBody";
import { LOGIN_ROUTE } from "../../Core/Consts/routeNames";
import { signIn } from "next-auth/react";

export default function SigninModalForm() {
  return (
    <Formik
      initialValues={{
        password: "",
        email: "",
      }}
      onSubmit={async (values) => {
        signIn();
        /* const res = await fetch(LOGIN_ROUTE, {
          method: "POST",
          body: JSON.stringify(values),
          ...FETCH_BODY,
        });
        if ((await res.text()) === "Logged In!") {
          location.reload();
        } */
        document.getElementById(SIGNIN_MODAL_NAME)?.click();
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
          <label className="label" htmlFor="password">
            <span className="label-text text-lg">Password</span>
          </label>
          <Field
            id="password"
            name="password"
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
