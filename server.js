require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.static("public"));
app.use(express.json());

app.post("/app", async (req, res) => {
    const prompt = req.body?.prompt;

    if (typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({
            error: "Please enter a valid question."
        });
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.apikey}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `Answer simply, clearly,remove extra space naturally. Keep the answer short.avoid unnessesary emojis and symbols. Question: ${prompt}`
                            }
                        ]
                    }
                ]
            }
        );

        const answer =
            response.data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!answer) {
            return res.status(502).json({
                error: "The AI service returned no answer."
            });
        }

        return res.json({ answer });

    } catch (error) {
        console.error(error.response?.data || error.message);

        return res.status(500).json({
            error: "Something went wrong."
        });
    }
});

app.listen(3001, () => {
    console.log("Server started at http://localhost:3001");
});
