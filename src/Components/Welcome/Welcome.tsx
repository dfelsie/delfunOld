import React from "react";
import { trpc } from "../../utils/trpc";
export default function Welcome() {
  const setup = trpc.setup.setupCsv.useMutation();
  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button
              onClick={async () => {
                /*
                  await (await fetch(BACKEND_ROUTE + "/WeatherForecast")).json()
                ); */
              }}
              className="btn-primary btn"
            >
              Get Forecast
            </button>
            {/* <button
              onClick={async () => {
                setup.mutate();
              }}
              className="btn-primary btn"
            >
              Mutis
            </button> */}
          </div>
        </div>
      </div>
      <div className="hero min-h-screen bg-gradient-to-b from-indigo-400">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button className="btn-primary btn">Get Started</button>
          </div>
        </div>
      </div>
    </>
  );
}
