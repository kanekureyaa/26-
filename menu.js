const SUPABASE_URL =
    "https://yccvpxeguydxdchtjfhj.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_XV3iddOwfequC8_6hhdYpw_WQ-RwEQx";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==============================
// ログイン確認
// ==============================
async function checkLogin() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    // ログインしていなければ
    // ログイン画面へ戻す
    if (!session) {

        window.location.href = "index.html";

    }

}


// ==============================
// ログアウト
// ==============================
async function logout() {

    await supabaseClient.auth.signOut();

    window.location.href = "index.html";

}


checkLogin();