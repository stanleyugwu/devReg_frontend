import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { ethers } from "ethers";
import DevRegAbi from "../abis/DevReg.json";
import contract from "../constants/contract";

export type SignupFormFields = {
  username: string;
  title: string;
  bio: string;
  openToWork: boolean;
  githubUsername: string;
  devPicUrl: string;
};

export type FormProps = {
  onClose: () => void;
  walletConnector: () => void;
  address: string;
};

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

const ErrorField = ({ error }: { error?: string }) =>
  !!error ? (
    <p className="text-rose-600 font-normal text-md my-2">{error}</p>
  ) : null;

const Form = ({ onClose, walletConnector, address }: FormProps) => {
  // handle submission
  const onSubmit = async (values: SignupFormFields) => {
    // everything is valid at this point
    // lets make sure wallet is still connected
    if (
      (
        await (window.ethereum as any).request({
          method: "eth_accounts",
        })
      ).length === 0
    )
      return walletConnector();

    // wallet connected!!
    // let's get a signer from metamask
    const metamaskProvider = new ethers.providers.Web3Provider(
      window.ethereum as any,5
    );
    const signer = metamaskProvider.getSigner(address);

    try {
      // lets create a fresh provider. we dont connect to metamask because we have our own provider
      // we just get a signer from metamask
      const goerliProvider = new ethers.providers.JsonRpcProvider(
        "https://rpc.goerli.mudit.blog/",
        5
        );
        


      // lets instantiate our contract and call register function
      let contractAbi: ethers.ContractInterface = DevRegAbi;
      const devReg = new ethers.Contract(
        contract.CONTRACT_ADDRESS,
        contractAbi,
        signer
      );
      const { bio, devPicUrl, githubUsername, openToWork, title, username } =
        values;

      // return console.log(values);
      const tx = await devReg
        .register("", title, bio, openToWork, githubUsername, devPicUrl, {
          gasLimit: 2000000,
        });

      const receipt = await tx.wait();
      console.log(receipt);
    } catch (error: any) {
      console.log("CONTRACT ERROR");
      const message:string = error.message;
      console.log(message.match(/reverted with reason string '.*'$/))
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
    <div className="w-11/12 lg:w-1/2 text-center min-h-screen self-center m-auto my-4">
      <div className="flex flex-row justify-between mb-8 items-center mt-4">
        <h2 className="text-dark text-3xl font-semibold ml-3">
          💪 Join Great Devs
        </h2>
        <span
          className="font-mono bg-dark hover:bg-opacity-90 p-2 px-4 rounded-lg font-bold text-3xl text-lime-500 cursor-pointer"
          onClick={onClose}
        >
          X
        </span>
      </div>
      <form
        className="w-full p-4 rounded-lg shadow-lg bg-lime-50 shadow-slate-400"
        action="#"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <fieldset className="flex flex-col text-left my-6">
          <label className="mb-2 text-sm uppercase font-semibold">
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
          <label className="mb-2 text-sm uppercase font-semibold">
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
            <label className="mb-2 text-sm uppercase font-semibold">
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
            <label className="mb-2 text-sm uppercase font-semibold">
              Are you open for hire/jobs?
            </label>
            <div className="uppercase bg-white shadow-sm p-3 rounded-lg">
              <label htmlFor="openforwork">
                <input
                  onChange={() => setFieldValue("openToWork", true)}
                  checked={values.openToWork}
                  type={"radio"}
                  name="openToWork"
                  id="openforwork"
                  className="uppercase active:bg-lime-500"
                />
                <span className="pl-2">Yes, sure</span>
              </label>

              <label htmlFor="notopenforwork">
                <input
                  type={"radio"}
                  checked={!values.openToWork}
                  onChange={() => setFieldValue("openToWork", false)}
                  id="notopenforwork"
                  className="ml-6 uppercase font-semibold"
                  name="openToWork"
                />
                <span className="pl-2">Nope</span>
              </label>
            </div>
          </fieldset>
          <ErrorField error={errors.githubUsername} />
        </div>
        <fieldset className="flex flex-col text-left my-6">
          <label className="mb-2 text-sm uppercase font-semibold">
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
          <label className="mb-2 text-sm uppercase font-semibold">
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
          className="p-4 px-12 shadow-md disabled:bg-opacity-50 hover:bg-opacity-70 bg-dark text-white font-semibold uppercase rounded-lg"
        >
          {isSubmitting ? (
            <span className="animate-pulse">JOINING...PLEASE WAIT ❤</span>
          ) : (
            "JOIN THE TALENTS"
          )}
        </button>
      </form>
    </div>
  );
};

export default Form;
