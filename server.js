import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 상담 전화번호 알림톡 전송
app.post("/send-kakao", async (req, res) => {
  const { phoneNumber } = req.body;
  const apiKey = process.env.KAKAO_API_KEY;

  if (!apiKey) {
    console.error("❌ KAKAO_API_KEY가 설정되지 않았습니다.");
    return res.status(500).json({ success: false, error: "KAKAO_API_KEY 없음" });
  }

  if (!phoneNumber) {
    return res.status(400).json({ success: false, error: "전화번호가 없습니다." });
  }

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
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ M2Net 서버 실행 중... 포트: ${PORT}`));
