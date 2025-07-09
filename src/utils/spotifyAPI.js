import { generateCodeChallenge, generateCodeVerifier } from "./pkce";


const Spotify = {};

Spotify.redirect_uri = "https://spotimix.netlify.app/";
//Spotify.redirect_uri = "http://localhost:3000/";

Spotify.getToken= async () =>{
    return localStorage.getItem("access_token");
}

Spotify.verifyAuthentication = async () => {
    try {
        // refresh token that has been previously stored
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
            Spotify.getRefreshToken(refreshToken);
        } else {
            const params = new URLSearchParams(
                window.location.search
            );
            const code = params.get("code");
            if (!code) {
                Spotify.redirectToAuthCodeFlow();
            } else {
                const accessToken =
                    await Spotify.getAccessToken(code);
                localStorage.setItem(
                    "access_token",
                    accessToken
                );
            }
        }
    } catch (error) {
        console.log(error);
    }
}

Spotify.redirectToAuthCodeFlow = async () => {
    try {

            const verifier = generateCodeVerifier(128);
            const challenge = await generateCodeChallenge(verifier);

            localStorage.setItem("verifier", verifier);

            const params = new URLSearchParams();
            params.append("client_id", process.env.REACT_APP_CLIENT_ID);
            params.append("response_type", "code");
            params.append("redirect_uri", Spotify.redirect_uri);
            params.append(
                "scope",
                "user-read-private playlist-modify-public"
            );
            params.append("code_challenge_method", "S256");
            params.append("code_challenge", challenge);

            document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
        
    } catch (error) {
        console.log(`Auth flow failure: ${error}`);
    }
}

Spotify.getRefreshToken = async (refreshToken) => {
    try {
        const url = "https://accounts.spotify.com/api/token";

        const payload = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: process.env.REACT_APP_CLIENT_ID,
            }),
        };
        const body = await fetch(url, payload);
        const response = await body.json();
        const {refresh_token, access_token} = response;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);                
    } catch (error) {
        console.log(`Unable to get refresh token: ${error}`);
    }
}

Spotify.getAccessToken = async (code) => {
    try {
        // get verifier from local storage
        const verifier = localStorage.getItem("verifier");

        // create params needed for access token request
        const params = new URLSearchParams();
        params.append("client_id", process.env.REACT_APP_CLIENT_ID);
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", Spotify.redirect_uri);
        params.append("code_verifier", verifier);

        // make the POST request for the access token to the correct endpoint
        const result = await fetch(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params,
            }
        );
        if(result.ok){
            const data = await result.json();
            console.log(data);
            const { access_token, refresh_token} =
                data;
            localStorage.setItem("refresh_token", refresh_token);

            return access_token;
        } else {
            console.log(`There was an issue: ${result.status}`);
        }
    } catch (error) {
        console.log(`Unable to get access token: ${error}`);
    }
}


export default Spotify;