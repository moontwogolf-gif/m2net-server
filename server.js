import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/send-kakao", async (req, res) => {
  const { phoneNumber } = req.body;
  const apiKey = process.env.KAKAO_API_KEY; // Render 환경변수에서 가져오기

  try {
    const response = await axios.post(
      "https://kapi.kakao.com/v2/api/talk/memo/default/send",
      {
        object_type: "text",
        text: `📞 M2Net 상담 요청 전화번호: ${phoneNumber}`,
        link: { web_url: "https://moontwonet.imweb.me" }
      },
      {
        headers: { Authorization: `KakaoAK ${apiKey}` }
      }
    );

    res.json({ success: true, response: response.data });
  } catch (err) {
    console.error("카카오톡 전송 실패:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ M2Net 서버 실행 중... 포트: ${PORT}`));
