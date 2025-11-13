import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-kakao", async (req, res) => {
  const { phoneNumber } = req.body;
  const accessToken = process.env.KAKAO_BIZ_ACCESS_TOKEN || "4f0e3017870c0e3032d2bcc4e6ba0278"; // 새 키
  const templateCode = process.env.KAKAO_TEMPLATE_CODE || "CONSULT_ALERT";

  if (!accessToken) return res.status(500).json({ success: false, error: "Access Token 미등록" });

  try {
    const response = await axios.post(
      "https://api.bizmsg.kakao.com/v1/messages",
      {
        template_code: templateCode,
        recipient_number: phoneNumber,
        message: `상담 요청 전화번호: ${phoneNumber}`
      },
      {
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }
      }
    );

    res.json({ success: true, response: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
