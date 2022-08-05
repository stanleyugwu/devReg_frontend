/**
 * The data structure of individual developer
*/
export type DeveloperInfo = {
    // Developer's unique username.
    username:string;
    // Developer's title e.g "Fullstack developer"
    title: string ;
    // Developer's short bio
    bio:string;
    // Developer's reputation points
    reputationPoints:number;
    // Whether the developer is open to jobs or employment
    openToWork:boolean;
    // Developer's Github username
    githubUsername:string;
    // Registeration date
    regDate:number;
    // Link to dev's picture to use as profile pic
    devPicUrl:string ;
    // Developer's wallet address
    walletAddress:string;
}