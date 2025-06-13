from authlib.integrations.starlette_client import OAuth
from app.core.config import settings

oauth = OAuth()

# Configure Google OAuth (only if credentials are provided)
if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
    oauth.register(
        name='google',
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={
            'scope': 'openid email profile',
            'redirect_uri': settings.GOOGLE_REDIRECT_URI
        }
    )

# Configure GitHub OAuth (only if credentials are provided)
if settings.GITHUB_CLIENT_ID and settings.GITHUB_CLIENT_SECRET:
    oauth.register(
        name='github',
        client_id=settings.GITHUB_CLIENT_ID,
        client_secret=settings.GITHUB_CLIENT_SECRET,
        access_token_url='https://github.com/login/oauth/access_token',
        access_token_params=None,
        authorize_url='https://github.com/login/oauth/authorize',
        authorize_params=None,
        api_base_url='https://api.github.com/',
        client_kwargs={
            'scope': 'user:email',
            'redirect_uri': settings.GITHUB_REDIRECT_URI
        }
    )

# Configure Facebook OAuth (optional)
if settings.FACEBOOK_CLIENT_ID and settings.FACEBOOK_CLIENT_SECRET:
    oauth.register(
        name='facebook',
        client_id=settings.FACEBOOK_CLIENT_ID,
        client_secret=settings.FACEBOOK_CLIENT_SECRET,
        authorize_url='https://www.facebook.com/dialog/oauth',
        access_token_url='https://graph.facebook.com/oauth/access_token',
        api_base_url='https://graph.facebook.com/',
        client_kwargs={
            'scope': 'email',
            'redirect_uri': settings.FACEBOOK_REDIRECT_URI
        }
    )

# Configure Twitter OAuth (optional)
if settings.TWITTER_CLIENT_ID and settings.TWITTER_CLIENT_SECRET:
    oauth.register(
        name='twitter',
        client_id=settings.TWITTER_CLIENT_ID,
        client_secret=settings.TWITTER_CLIENT_SECRET,
        authorize_url='https://twitter.com/i/oauth2/authorize',
        access_token_url='https://api.twitter.com/2/oauth2/token',
        api_base_url='https://api.twitter.com/',
        client_kwargs={
            'scope': 'tweet.read users.read',
            'redirect_uri': settings.TWITTER_REDIRECT_URI
        }
    )

# Configure LinkedIn OAuth (optional)
if settings.LINKEDIN_CLIENT_ID and settings.LINKEDIN_CLIENT_SECRET:
    oauth.register(
        name='linkedin',
        client_id=settings.LINKEDIN_CLIENT_ID,
        client_secret=settings.LINKEDIN_CLIENT_SECRET,
        authorize_url='https://www.linkedin.com/oauth/v2/authorization',
        access_token_url='https://www.linkedin.com/oauth/v2/accessToken',
        api_base_url='https://api.linkedin.com/',
        client_kwargs={
            'scope': 'r_liteprofile r_emailaddress',
            'redirect_uri': settings.LINKEDIN_REDIRECT_URI
        }
    )

# Helper function to check which OAuth providers are configured
def get_configured_providers():
    """Return list of configured OAuth providers"""
    providers = []
    
    if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
        providers.append('google')
    
    if settings.GITHUB_CLIENT_ID and settings.GITHUB_CLIENT_SECRET:
        providers.append('github')
        
    if settings.FACEBOOK_CLIENT_ID and settings.FACEBOOK_CLIENT_SECRET:
        providers.append('facebook')
        
    if settings.TWITTER_CLIENT_ID and settings.TWITTER_CLIENT_SECRET:
        providers.append('twitter')
        
    if settings.LINKEDIN_CLIENT_ID and settings.LINKEDIN_CLIENT_SECRET:
        providers.append('linkedin')
    
    return providers