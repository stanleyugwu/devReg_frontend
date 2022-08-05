import React from "react";

export type DeveloperProps = {
  username: string;
  title: string;
  reputationPoints: number;
  openToWork: boolean;
  githubUsername: string;
  regDate: number;
  walletAddress: string;
  devPicUrl: string;
  bio: string;
};

function Developer({
  devPicUrl,
  githubUsername,
  openToWork,
  bio,
  regDate,
  reputationPoints,
  title,
  username,
  walletAddress,
}: DeveloperProps) {
  return (
    <div className="bg-dark h-max p-0 rounded-2xl min-h-max border-t-4 max-w-fit border-t-yellow-500 px-4 pb-4 xl:w-1/4 w-11/12 m-2">
      {!openToWork && (
        <div className="text-xs w-max mx-auto px-4 mb-4 bg-white font-semibold rounded-b-full text-dark uppercase">
          OPEN TO WORK
        </div>
      )}
      <div className="flex flex-row justify-between mb-4 items-center">
        <p>
          <span className="text-2xl text-lime-500 font-medium">
            {(reputationPoints as any).toNumber()}
          </span>
          <span className="text-sm font-medium uppercase text-white">REPS</span>
        </p>
        <span className="text-gray-300 font-medium text-sm">
          {new Date((regDate as any).toNumber()).toDateString()}
        </span>
      </div>

      <div className="flex justify-center flex-col items-center">
        <img
          src={devPicUrl}
          alt="Developer"
          className="rounded-full w-40 h-40 border-4 border-lime-400"
        />
        <p className="text-xl mt-2 font-medium text-white">{username}</p>
        <p className=" text-gray-300 text-sm font-semibold uppercase">
          {title}
        </p>
        <p className="text-xs font-bold text-gray-300 font-mono">
          {walletAddress}
        </p>

        <p className="text-white my-4">{bio}</p>
        <a
          href={`http://github.com/${githubUsername}`}
          className="p-3 text-sm ml-4 mb-2 bg-lime-500 text-white rounded-md px-10 font-semibold hover:bg-lime-600"
        >
          Visit Workshop
        </a>
      </div>
    </div>
  );
}

export default Developer;
