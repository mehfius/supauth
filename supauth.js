// ╔══════════════════════╗
// ║  supauth v1.0.0      ║
// ║  Production Ready    ║
// ║  MIT Licensed        ║
// ╚══════════════════════╝

const supauth = (async function(success_callback) {

    if (!globalThis.auth) {
        throw new Error('globalThis.auth is not defined');
    }

    const UHP = globalThis.auth.URL_HOST_PRODUCTION || '';
    const UDP = globalThis.auth.URL_REDIRECT_PRODUCTION || '';
    const URD = globalThis.auth.URL_REDIRECT_DEV || '';
    const SUPABASE_URL = globalThis.auth.SUPABASE_URL || '';
    const SUPABASE_KEY = globalThis.auth.SUPABASE_KEY || '';

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error('Supabase URL and KEY must be defined in globalThis.auth');
    }

    const { createClient } = supabase;
    if (!createClient) {
        throw new Error('supabase.createClient is not available');
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

    try {
        const { data: { session } } = await supabaseClient.auth.getSession();

        if (session) {
            
            globalThis.auth.ACCESS_TOKEN = session.access_token;  

            const user_name = session.user.user_metadata.full_name || "Usuário sem nome";
            const user_email = session.user.email || "Email não disponível";
            const provider = session.user.app_metadata.provider || "plataforma desconhecida";        
            const decoded_token = decodeJWT(session.access_token);           

            if (typeof success_callback === 'function') {   
                success_callback({
                    user_name,
                    user_email,
                    provider,
                    access_token: session.access_token,
                    decoded_token
                });
            }

        } else {
            console.log('Nenhuma sessão ativa, por favor faça login.');
            navdialog.show_dialog(navdialog.create_dialog_login());        
        }

    } catch (err) {
        console.error('Erro ao verificar estado da autenticação:', err);
    }
    
    async function signInWithOAuth(provider) {
       
        try {
            const { data, error } = await supabaseClient.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.host === UHP ? UDP : URD
                }
            });
        
            if (error) throw new Error(error.message);

        } catch (err) {
            console.error(`Erro ao fazer login com ${provider}:`, err.message);
        }

    }

    async function signOut() {
     
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw new Error(error.message);

            console.log('Logout realizado com sucesso');
            window.location.reload();

        } catch (err) {
            console.error('Erro ao fazer logout:', err.message);
        }
    }

    function decodeJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Erro ao decodificar JWT:', e);
            return null;
        }
    }

    const signInWithGitHub = () => signInWithOAuth('github');
    const signInWithGoogle = () => signInWithOAuth('google');
    const authSignAuth = () => signOut();

    globalThis.authSignAuth = authSignAuth;
    globalThis.signInWithGitHub = signInWithGitHub;
    globalThis.signInWithGoogle = signInWithGoogle;

});