import React from "react";
import { SIGNIN_MODAL_NAME, SIGNUP_MODAL_NAME } from "../../Core/Consts/consts";
import SignupModalForm from "./SignupModalForm";
import SigninModalForm from "./SignupModalForm";

export default function SigninModal() {
  return (
    <div>
      <input type="checkbox" id={SIGNUP_MODAL_NAME} className="modal-toggle" />
      <label htmlFor={SIGNUP_MODAL_NAME} className="modal cursor-pointer ">
        <label className="modal-box relative flex h-[90%] max-h-[550px] flex-col">
          <label
            htmlFor={SIGNUP_MODAL_NAME}
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="pt-2 text-center text-xl font-bold">Sign Up</h3>
          <SignupModalForm />
        </label>
      </label>
    </div>
  );
}
