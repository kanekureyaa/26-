const SUPABASE_URL = 
    "https://yccvpxeguydxdchtjfhj.supabase.co";
const SUPABASE_KEY = "sb_publishable_XV3iddOwfequC8_6hhdYpw_WQ-RwEQx";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let workers = [];
let timeSlots = [];


// ==============================
// 読み仮名をひらがなに統一する
// ==============================
function normalizeKana(str) {
    return str
        .trim()
        .replace(/[\u30A1-\u30F6]/g, char => {
            return String.fromCharCode(
                char.charCodeAt(0) - 0x60
            );
        });
}

// ==============================
// Supabaseからシフトを読み込む
// ==============================
async function loadShifts() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    console.log("ログインセッション:", session);
    
    if (!session) {
        window.location.href = "index.html";
        return;
    }

    try {

        // URLから何日目か取得
        const params = new URLSearchParams(location.search);
        const day = params.get("day");

        if (!day) {
            throw new Error("日程が指定されていません");
        }

        // タイトルを変更
        document.getElementById("title").textContent =
            day + "日目のシフト検索";


        // ==============================
        // Supabaseからデータを取得
        // ==============================

        const { data, error } = await supabaseClient
            .from("shifts")
            .select("*")
            .eq("day", Number(day));


        // エラーがあった場合
        if (error) {
            throw error;
        }


        // ==============================
        // データが取得できなかった場合
        // ==============================

        if (!data || data.length === 0) {

            workers = [];

            console.log("シフトデータがありません");

            return;
        }


        // ==============================
        // workersを作る
        // ==============================

        workers = [];


        // 人ごとにまとめる
        data.forEach(row => {

            // すでにworkersにいる人を探す
            let person = workers.find(
                worker => worker.name === row.name
            );


            // まだ登録されていない人なら追加
            if (!person) {

                person = {
                    name: row.name,
                    kana: row.kana,
                    jobs: []
                };

                workers.push(person);
            }


            // 仕事内容を追加
            person.jobs.push({
                time: row.time,
                job: row.job
            });

        });


        console.log("日程:", day);
        console.log("取得データ:", data);
        console.log("workers:", workers);


    } catch (error) {

        console.error(error);

        document.getElementById("result").innerHTML =
            "<p>シフト情報を読み込めませんでした。</p>";
    }
}


// ==============================
// 人を検索する
// ==============================
function searchPerson() {

    const keyword =
        document.getElementById("search").value.trim();


    // 何も入力されていない場合
    if (keyword === "") {

        document.getElementById("result").innerHTML =
            "<p>読み仮名を入力してください。</p>";

        return;
    }


    // 検索文字をひらがなに統一
    const normalizedKeyword =
        normalizeKana(keyword);


    // 該当する人を探す
    const matches = workers.filter(person => {

        const normalizedKana =
            normalizeKana(person.kana);

        return normalizedKana.includes(
            normalizedKeyword
        );
    });


    // 該当者がいない場合
    if (matches.length === 0) {

        document.getElementById("result").innerHTML =
            "<p>該当する人が見つかりませんでした。</p>";

        return;
    }


    // 表示するHTML
    let html = "";


    // 該当者を順番に表示
    matches.forEach(person => {

        html += `
            <h2>${person.name}</h2>

            <table>

                <tr>
                    <th>時間</th>
                    <th>仕事内容</th>
                </tr>
        `;


        person.jobs.forEach(jobData => {

            let jobText = jobData.job || "-";
        
            const time = jobData.time || "";
        
            if (time !== "") {
        
                html += `
                    <tr>
                        <td>${time}</td>
                        <td>${jobText}</td>
                    </tr>
                `;
            }
        
        });


        html += `
            </table>
            <br>
        `;
    });


    // 画面に表示
    document.getElementById("result").innerHTML =
        html;
}


// ==============================
// ページを開いたらCSVを読み込む
// ==============================
loadShifts();