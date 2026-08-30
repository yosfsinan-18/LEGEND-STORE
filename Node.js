const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// داتابەیسا دەمکی (بۆ نموونە؛ دشێی MongoDB یان PostgreSQL ل جهـ بێنەی)
let users = [];
let products = [];

// ۱. پشکێ تۆمارکرنا حسابا نوو و هنارتنا SMS
app.post('/api/register', async (req, res) => {
    const { username, password, phone } = req.body;
    
    // پشکنینا هەبوونا بەکارهێنەری
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ success: false, message: "ئەڤ ناڤێ بەکارهێنەری هەییە!" });
    }

    const newUser = { username, password, phone };
    users.push(newUser);

    // Simulated SMS Gateway Integration ب ناڤێ LEGEND STORE
    const verificationCode = Math.floor(1000 + Math.random() * 9000);
    console.log(`[SMS Gateway - LEGEND STORE] بۆ ژمارا ${phone} | کۆدێ پشکنینێ: ${verificationCode}`);

    res.status(200).json({ 
        success: true, 
        message: "حساب هاتە دروستکرن و کۆدێ SMS ب ناڤێ LEGEND STORE هاتە هنارتن!",
        code: verificationCode // بۆ تاقیکردنێ ل لایێ پێشێ
    });
});

// ۲. چوونە ژوور (Login)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(400).json({ success: false, message: "ناڤێ بەکارهێنەری یان پاسوۆرد هەڵە یە!" });
    }

    res.status(200).json({ success: true, message: "ب سەرکەفتیانە چوویە ژوورڤە!", user });
});

// ۳. وەرگرتنا هەمی تشت و ئۆتۆمبێلان
app.get('/api/products', (req, res) => {
    res.status(200).json({ success: true, products });
});

// ۴. زێدەکرنا تشتەکێ نوو (فروتن)
app.post('/api/products', (req, res) => {
    const { title, notes, phone, imagesCount } = req.body;

    if (!title || !notes || !phone) {
        return res.status(400).json({ success: false, message: "تکایە هەمی خانەیان تژی بکە!" });
    }

    if (imagesCount > 30) {
        return res.status(400).json({ success: false, message: "تەنها دشێی هەتا 30 وێنەیان بار بکەی!" });
    }

    const newProduct = {
        id: Date.now(),
        title,
        notes,
        phone,
        imagesCount: imagesCount || 0
    };

    products.unshift(newProduct); // زێدەکرنا تشتێ نوو بۆ سەرێ لیستی
    res.status(200).json({ success: true, message: "تشتێ تە ل LEGEND STORE هاتە عەرزکرن!", product: newProduct });
});

const PORT = process.0 || 3000;
app.listen(PORT, () => {
    console.log(`LEGEND STORE Server is running on port ${PORT}`);
});
