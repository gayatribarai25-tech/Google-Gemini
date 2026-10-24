const question = document.getElementById("question");
const submitBtn = document.getElementById("submit-btn");
const answerBox = document.getElementById("answer-box");
const loadingMessage = document.getElementById("loading-message");


submitBtn.addEventListener("click", async function () {
    const prompt = question.value.trim();

    if (prompt === "") {
        answerBox.textContent = "Please enter your question!";
        return;
    }

    submitBtn.disabled = true;
    loadingMessage.hidden = false;
    answerBox.textContent = "";
    answerBox.appendChild(loadingMessage);

    try {
        const response = await axios.post("/app", {
            prompt: prompt
        });

        const data = response.data;
        answerBox.textContent = data.answer;
        question.value = "";
    

    } catch (error) {
        answerBox.textContent =
            error.response?.data?.error ||
            "Sorry, something went wrong. Please try again.";

        console.error(error);

    } finally {
        loadingMessage.hidden = true;
        submitBtn.disabled = false;
    }
});