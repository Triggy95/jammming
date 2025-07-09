export function generateCodeVerifier (length) {
  // string of possible characters
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // create a strong random array of 8-bit unsigned integers at specified length
  const values = crypto.getRandomValues(new Uint8Array(length));
  // using the random integers, assign the a place in the random string to one
  // of the characters from the possible string. using x % length ensures that it
  // will always be within the range of possible indexes. 57%52 = 57 which is "5"
  // in the possible string.
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}


// ** GENERATE CHALLENGE CODE

const sha256 = async (plain) => {
  // create encoder object
  const encoder = new TextEncoder() 
  // encode data to a Uint8Array
  const data = encoder.encode(plain)
  // create the digest using the encoded data
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function generateCodeChallenge(verifier){
  const hashed = await sha256(verifier);
  return base64encode(hashed)};