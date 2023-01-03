import React from "react";
import { SIGNIN_MODAL_NAME } from "../../Core/Consts/consts";
import SigninModalForm from "./SigninModalForm";

export default function SigninModal() {
  return (
    <div>
      <input type="checkbox" id={SIGNIN_MODAL_NAME} className="modal-toggle" />
      <label htmlFor={SIGNIN_MODAL_NAME} className="modal cursor-pointer ">
        <label className="modal-box relative flex h-[90%] max-h-[550px] flex-col">
          <label
            htmlFor={SIGNIN_MODAL_NAME}
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="pt-2 text-center text-xl font-bold">Sign In</h3>
          <SigninModalForm />
        </label>
      </label>
    </div>
  );
}
