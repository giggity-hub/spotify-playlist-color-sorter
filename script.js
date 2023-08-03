const clientId = '9ef61e274da44d36a493e489f6a57139';
const redirectUri = 'http://localhost:5500';

const codeVerifierLength = 128

async function loadPkce(){
    return new Promise((resolve) => {
        getPkce(128, (error, { verifier, challenge }) => {
          if (error) throw error;
          resolve({ verifier, challenge });
        });
      });
}

async function getProfile() {
    let accessToken = localStorage.getItem('access_token');
  
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
  
    const data = await response.json();
    console.log(data);
  }

async function main(){
    const urlParams = new URLSearchParams(window.location.search);
    code = urlParams.get('code');

    if (! code){
        return 
    }

    let codeVerifier = localStorage.getItem('pkce_verifier');

    let body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier
        });
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    })

    if (!response.ok){
        throw new Error('HTTP status ' + response.status);
    }


    const data = await response.json()
    localStorage.setItem('access_token', data.access_token);

}

async function signIn(){
    const {verifier, challenge} = await loadPkce()


    let scope = 'user-read-private user-read-email';
  
    
  
    let args = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
    //   state: state,
      code_challenge_method: 'S256',
      code_challenge: challenge
    });


    localStorage.setItem('pkce_verifier', verifier);
    console.log(verifier, challenge);

    window.location = 'https://accounts.spotify.com/authorize?' + args;
}

main()