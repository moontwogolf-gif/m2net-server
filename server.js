import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// 상담 요청 → 카카오톡 알림톡 전송
app.post("/send-kakao", async (req, res) => {
  const { phoneNumber } = req.body;
  const accessToken = process.env.KAKAO_ACCESS_TOKEN;

  try {
    const response = await axios.post(
      "https://kapi.kakao.com/v2/api/talk/memo/default/send",
      {
        object_type: "text",
        text: `📞 M2Net 상담 요청\n\n고객 전화번호: ${phoneNumber}\n\n빠른 시일 내 연락드리겠습니다.`,
        link: { web_url: "https://moontwonet.imweb.me" },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("✅ 카카오톡 전송 성공:", response.data);
    res.json({ success: true, message: "카카오톡 전송 성공" });
  } catch (err) {
    console.error("❌ 카카오톡 전송 실패:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ M2Net 서버 실행 중... 포트: ${PORT}`));
