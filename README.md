# Supauth

Supauth is a lightweight authentication wrapper for Supabase, providing easy-to-use authentication methods and session management.

## Features

- Simple OAuth integration (GitHub, Google)
- Automatic session management
- JWT token decoding
- Success callback handling
- Production-ready configuration

## Installation

Include the following in your HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
<script src="https://jte.mehfi.us/src/jte.js"></script>
<script src="path/to/supauth.js"></script>
```

## Usage

1. Configure your Supabase credentials:

```javascript
globalThis.auth = {
    SUPABASE_KEY: "your-supabase-key",
    SUPABASE_URL: "your-supabase-url",
    URL_HOST_PRODUCTION: "your-production-domain",
    URL_REDIRECT_PRODUCTION: "your-production-redirect-url",
    URL_REDIRECT_DEV: "your-dev-redirect-url"
};
```

2. Initialize Supauth with a success callback:

```javascript
supauth(function(session_data) {
    console.log('User authenticated:', session_data);
});
```

3. Use the provided authentication methods:

```javascript
// Sign in with GitHub
globalThis.signInWithGitHub();

// Sign in with Google
globalThis.signInWithGoogle();

// Sign out
globalThis.authSignAuth();
```

## License

MIT License 