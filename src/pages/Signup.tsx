import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ethers } from "ethers";
import arrow from "../images/arrow.svg";
import laptopImg from "../images/laptop.png";
import { SignupFormFields } from "../types";
import useMetamaskConnect, { activeNetwork } from "../hooks/useMetamaskConnect";
import devRegInterface from "../utils/devRegInterface";
import Swal from "sweetalert";
import { useNavigate } from "react-router-dom";

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .max(29, "Username must be less than 30 characters")
    .matches(/^[a-z][a-z0-9\-_]+$/, "Username is invalid. E.g devvie-123_")
    .required("Please enter username"),

  title: Yup.string()
    .max(49, "Title must be less than 50 characters")
    .required("Please provide title"),
  bio: Yup.string().max(129, "Bio must be less than 130 characters"),
  openToWork: Yup.boolean(),
  githubUsername: Yup.string()
    .matches(/^[a-zA-Z0-9\-_]+$/, "Github username is invalid")
    .required("Please enter your github username"),
  devPicUrl: Yup.string()
    .min(6, "URL string must be greater than 5 characters")
    .required(
      "Please provide a URL to your picture. E.g URL/to/twitter/profile/pic.jpg"
    ),
});
export type EthersError = {
  reverted: boolean;
  reason?: string;
  code?: string;
  transactionHash?: string;
  transaction?: ethers.ContractTransaction;
  receipt?: ethers.ContractReceipt;
  message?: string;
};

// component for shoding form field errors in a unified way
const ErrorField = ({ error }: { error?: string }) =>
  !!error ? (
    <p className="text-rose-600 font-normal text-md my-2">{error}</p>
  ) : null;

/**
 * Sign up page for registering new name
 */
const Signup = () => {
  // this hook takes time to determine if user is connected, but it'd be done before
  // user is done filling form
  const { connectToMetamask, walletInfo, signer } = useMetamaskConnect();
  const navigate = useNavigate();

  // handle submission
  const onSubmit = async (values: SignupFormFields) => {
    // assert wallet connection
    if (!walletInfo?.address || activeNetwork() !== "GOERLI")
      return connectToMetamask();

    // since metamask can't sign transaction without broadcasting it through their node,
    // we'll use their goerli node to send transaction
    // lets instantiate our contract and call register function
    try {
      const { bio, devPicUrl, githubUsername, openToWork, title, username } =
        values;
      await devRegInterface(signer!).call(
        "register",
        undefined,
        username,
        title,
        bio,
        openToWork,
        githubUsername,
        devPicUrl,
        { gasLimit: 500_000 }
      );

      // registeration successful
      Swal({
        icon: "success",
        timer: 2000,
        title: "Success",
        text: "Registeration successful. You have been identified 💪",
      }).then(() => {
        navigate("/", { replace: true });
      });
    } catch (err: any) {
      const error = err as EthersError;
      console.log({ error });
      Swal({
        icon: "error",
        timer: 4000,
        title: "Request failed",
        text:
          error.code?.toString?.() === "4001"
            ? "You have to confirm the transaction in the metamask modal that pops up when you submit the form"
            : error.reason,
      });
    }
  };

  const {
    handleChange,
    errors,
    values,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  } = useFormik<SignupFormFields>({
    initialValues: {
      username: "",
      bio: "",
      devPicUrl:
        "https://miro.medium.com/max/1069/1*46eO0z9chPebfTkjw1vkzQ.png",
      githubUsername: "",
      openToWork: true,
      title: "",
    },
    onSubmit: onSubmit,
    validationSchema: SignupSchema,
    validateOnMount: true,
  });

  return (
    <div className="w-full border-t border-t-gray-100 lg:border-none text-center bg-dark min-h-screen self-center m-auto flex-wrap flex flex-row justify-center">
      <div className="w-full lg:w-5/12 bg-dark flex flex-col items-center p-4">
        <img src={laptopImg} alt="Laptop" className="w-full" />
        <h1 className="text-white text-center text-5xl font-semibold tracking-widest font-[fantasy] leading-tight">
          Create your developer identity today.
        </h1>
        <img src={arrow} alt="Arrow" className="w-28 my-8 hidden lg:block" />
        <h1 className="text-lime-500 hidden lg:block text-5xl font-semibold text-center font-serif leading-tight">
          Join a pool of identified software devs 💻💻
        </h1>
      </div>
      <form
        className="w-full lg:w-7/12 rounded-t-3xl p-4 px-2 lg:px-10 bg-gray-100"
        action="#"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <fieldset className="flex flex-col text-left my-6">
          <label className="mb-2 font-semibold">
            Take a dope unique username less than 30 characters
          </label>
          <input
            placeholder="Enter username"
            name="username"
            maxLength={29}
            required
            className="p-3 bg-white shadow-sm shadow-slate-400 rounded-md w-full"
            onChange={handleChange}
          />
          <ErrorField error={errors.username} />
        </fieldset>
        <fieldset className="flex flex-col text-left my-6">
          <label className="mb-2  font-semibold">
            Tell us your dev title (must be less than 50 characters) E.g
            "Fullstack Engineer"
          </label>
          <input
            placeholder="Enter title"
            name="title"
            maxLength={49}
            required
            className="p-3 bg-white shadow-sm shadow-slate-400 rounded-md w-full"
            onChange={handleChange}
          />
          <ErrorField error={errors.title} />
        </fieldset>
        <div className="flex flex-row justify-between items-center flex-wrap my-6">
          <fieldset className="flex flex-col text-left w-full lg:w-6/12">
            <label className="mb-2  font-semibold">
              What's your username on Github?
            </label>
            <input
              placeholder="Enter Github username"
              name="githubUsername"
              required
              className="p-3 bg-white shadow-sm shadow-slate-400 rounded-md w-full"
              onChange={handleChange}
            />
          </fieldset>
          <fieldset className="flex flex-col text-left w-full lg:w-5/12">
            <label className="mb-2  font-semibold">
              Are you open for hire/jobs?
            </label>
            <div className=" bg-white shadow-sm p-3 rounded-lg">
              <label htmlFor="openforwork">
                <input
                  onChange={() => setFieldValue("openToWork", true)}
                  checked={values.openToWork}
                  type={"radio"}
                  name="openToWork"
                  id="openforwork"
                  className=" active:bg-lime-500"
                />
                <span className="pl-2">Yes, sure</span>
              </label>

              <label htmlFor="notopenforwork">
                <input
                  type={"radio"}
                  checked={!values.openToWork}
                  onChange={() => setFieldValue("openToWork", false)}
                  id="notopenforwork"
                  className="ml-6  font-semibold"
                  name="openToWork"
                />
                <span className="pl-2">Nope</span>
              </label>
            </div>
          </fieldset>
          <ErrorField error={errors.githubUsername} />
        </div>
        <fieldset className="flex flex-col text-left my-6">
          <label className="mb-2  font-semibold">
            Link to your fav dev pic
          </label>
          <div className="w-full">
            <input
              placeholder="Enter URL"
              name="devPicUrl"
              value={values.devPicUrl}
              required
              minLength={5}
              className="p-3 bg-white shadow-sm shadow-slate-400 rounded-md inline w-full lg:w-10/12"
              onChange={handleChange}
            />
            <img
              src={values.devPicUrl}
              alt="url result"
              className="w-2/10 ml-2 inline-block h-16 rounded-md border-gray-300 border"
            />
          </div>
          <ErrorField error={errors.devPicUrl} />
        </fieldset>

        <fieldset className="flex flex-col text-left my-6">
          <label className="mb-2  font-semibold">
            Give us a brief bio/intro in less than 130 characters
          </label>
          <textarea
            placeholder="Enter brief bio"
            name="bio"
            onChange={handleChange}
            maxLength={129}
            className="p-3 bg-white shadow-sm shadow-slate-400 rounded-md h-24 w-full"
          />
          <ErrorField error={errors.bio} />
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting || Object.values(errors).length > 0}
          className="button disabled:hover:!bg-dark hover:!bg-opacity-70 !bg-dark w-11/12"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Processing ❤ ❤</span>
          ) : (
            "GET IDENTIFIED 💪"
          )}
        </button>
      </form>
    </div>
  );
};

export default Signup;
