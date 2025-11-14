import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let accessToken = null;
let refreshToken = process.env.KAKAO_REFRESH_TOKEN; // 발급된 refresh token 넣기

// Access Token 갱신 함수
async function refreshAccessToken() {
  try {
    const res = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      null,
      {
        params: {
          grant_type: "refresh_token",
          client_id: process.env.KAKAO_REST_API_KEY, // REST API Key
          refresh_token: refreshToken,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    accessToken = res.data.access_token;
    console.log("🔄 Access Token 갱신 성공");
  } catch (err) {
    console.error("❌ Access Token 갱신 실패:", err.response?.data || err.message);
  }
}

// 서버 시작 시 토큰 갱신
await refreshAccessToken();
// 50분마다 자동 갱신
setInterval(refreshAccessToken, 50 * 60 * 1000);

// 카톡 알림톡 전송 API
app.post("/send-kakao", async (req, res) => {
  const { phoneNumber } = req.body;
  if (!accessToken) return res.status(500).json({ success: false, error: "Access token 없음" });

  try {
    const response = await axios.post(
      "https://kapi.kakao.com/v2/api/talk/memo/default/send",
      {
        object_type: "text",
        text: `📞 상담 요청 전화번호: ${phoneNumber}`,
        link: { web_url: "https://moontwonet.imweb.me" },
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.json({ success: true, response: response.data });
  } catch (err) {
    console.error("❌ 카카오 전송 실패:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// OAuth Redirect 테스트용
app.get("/oauth", (req, res) => {
  res.send("OAuth Redirect URI OK");
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ M2Net 서버 실행 중... 포트: ${PORT}`));
