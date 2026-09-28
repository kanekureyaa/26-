const SUPABASE_URL =
    "https://yccvpxeguydxdchtjfhj.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_XV3iddOwfequC8_6hhdYpw_WQ-RwEQx";

const LOGIN_EMAIL = 
    "test@example.com";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

// ログイン状態を確認
async function checkLogin() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    // すでにログインしている
    if (session) {
        window.location.href = "menu.html";
    }
}


// ログイン処理
async function login() {

    const password =
        document.getElementById("password").value;

    if (password === "") {
        document.getElementById("error").textContent =
            "パスワードを入力してください。";
        return;
    }

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: LOGIN_EMAIL,
            password: password
        });

    if (error) {
        console.error(error);

        document.getElementById("error").textContent =
            "パスワードが正しくありません。";

        return;
    }

    console.log("ログイン成功:", data);

    window.location.href = "menu.html";
}


// ページを開いたときに確認
checkLogin();