import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.post("/send-kakao", async (req, res) => {
  const { phoneNumber } = req.body;
  const apiKey = process.env.KAKAO_API_KEY;
  const templateCode = process.env.TEMPLATE_CODE || "CONSULT_ALERT";

  try {
    const response = await axios.post(
      "https://kapi.kakao.com/v2/api/talk/memo/default/send",
      {
        object_type: "text",
        text: `상담 요청 전화번호: ${phoneNumber}`,
        link: { web_url: "https://moontwonet.imweb.me" }
      },
      {
        headers: { Authorization: `KakaoAK ${apiKey}` }
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
