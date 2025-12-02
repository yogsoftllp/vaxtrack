import { Octokit } from '@octokit/rest';

let connectionSettings;

async function getAccessToken() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function createRepository() {
  const accessToken = await getAccessToken();
  const octokit = new Octokit({ auth: accessToken });

  try {
    // Get authenticated user
    const user = await octokit.rest.users.getAuthenticated();
    const username = user.data.login;
    console.log(`Authenticated as: ${username}`);

    // Create repository
    const repo = await octokit.rest.repos.createForAuthenticatedUser({
      name: 'vaxtrack',
      description: 'VaxTrack - Smart vaccination management platform for parents and clinics',
      private: false,
      auto_init: false,
    });

    const repoUrl = repo.data.clone_url;
    console.log(`Repository created: ${repoUrl}`);
    console.log(`Full name: ${repo.data.full_name}`);

    return {
      owner: username,
      repo: 'vaxtrack',
      url: repoUrl,
      fullName: repo.data.full_name
    };
  } catch (error) {
    if (error.status === 422) {
      console.log('Repository already exists, using existing repo');
      const user = await octokit.rest.users.getAuthenticated();
      const username = user.data.login;
      return {
        owner: username,
        repo: 'vaxtrack',
        url: `https://github.com/${username}/vaxtrack.git`,
        fullName: `${username}/vaxtrack`
      };
    }
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Deploying VaxTrack to GitHub...\n');
    
    const repoInfo = await createRepository();
    console.log(`\n✅ Repository ready: ${repoInfo.fullName}`);
    console.log(`📍 URL: https://github.com/${repoInfo.fullName}`);
    
    // Output for shell script to use
    console.log(`\nREPO_URL=${repoInfo.url}`);
    console.log(`REPO_FULL_NAME=${repoInfo.fullName}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
