import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 카카오 알림톡 전송 API
app.post("/send-kakao", async (req, res) => {
  const { phoneNumber } = req.body;
  const apiKey = process.env.KAKAO_API_KEY;
  const templateCode = process.env.TEMPLATE_CODE || "CONSULT_ALERT";

  if (!phoneNumber) {
    return res.status(400).json({ success: false, error: "전화번호가 누락되었습니다." });
  }

  try {
    // 실제 카카오 API 호출
    const response = await axios.post(
      "https://kapi.kakao.com/v2/api/talk/memo/default/send",
      {
        object_type: "text",
        text: `📞 상담 요청이 접수되었습니다.\n\n고객 전화번호: ${phoneNumber}\n템플릿 코드: ${templateCode}\n\n👉 M2Net 상담 전용`,
        link: { web_url: "https://moontwonet.imweb.me" },
      },
      {
        headers: { Authorization: `KakaoAK ${apiKey}` },
      }
    );

    console.log("✅ 알림톡 전송 완료:", response.data);
    res.json({ success: true, response: response.data });
  } catch (err) {
    console.error("❌ 알림톡 전송 실패:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ 헬스체크 (Render에서 자동으로 확인용)
app.get("/", (req, res) => {
  res.send("M2Net KakaoTalk API 서버 정상 작동 중 ✅");
});

// ✅ 포트 설정
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 M2Net 서버 실행 중... 포트: ${PORT}`));
