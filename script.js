const API_URL = 'http://localhost:3000/api';

// گوهڕینا پشکان (Tabs)
function switchTab(sectionId, element) {
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
    });
    element.classList.add('active');

    if (sectionId === 'buySection') {
        loadProducts();
    }
}

// پشکنینا هژمارا وێنەیان (نە ژ 30 زێدەتر بێت)
function checkImageCount(input) {
    const warning = document.getElementById('imageCountWarning');
    if (input.files.length > 30) {
        warning.style.display = 'block';
        input.value = '';
    } else {
        warning.style.display = 'none';
    }
}

// هنارتنا تشتەکی بۆ فرۆشتنێ ب رێیا API
async function postItem(event) {
    event.preventDefault();

    const title = document.getElementById('itemTitle').value;
    const notes = document.getElementById('itemNotes').value;
    const phone = document.getElementById('itemPhone').value;
    const imagesInput = document.getElementById('itemImages');
    const imagesCount = imagesInput.files ? imagesInput.files.length : 0;

    if (phone.length < 6) {
        alert('ژمارا پەیوەندیێ دڤێت ژ 6 ژمارەیان کێمتر نەبێت!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, notes, phone, imagesCount })
        });

        const data = await response.json();
        if (data.success) {
            alert(data.message);
            document.getElementById('sellForm').reset();
            document.querySelector('.nav-item').click(); // ڤەگەر بۆ کڕینێ
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error posting item:', error);
        alert('خەلەتیەک چێبوو د پەیوەندیکردنێ دگەل سێرڤەری!');
    }
}

// دابەزاندنا تشتان ژ سێرڤەری
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = '';

        if (!data.products || data.products.length === 0) {
            grid.innerHTML = '<p>چ تشت هێشتا ل LEGEND STORE نەهاتینە عەرزکرن.</p>';
            return;
        }

        data.products.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <h3>${item.title}</h3>
                <p><strong>تێبینی:</strong> ${item.notes}</p>
                <p style="font-size: 12px; color: #64748b;">هژمارا وێنەیان: ${item.imagesCount}</p>
                <div class="contact-buttons" style="margin-top: 10px;">
                    <a href="https://wa.me/${item.phone}" target="_blank" class="whatsapp-btn">
                        <i class="fa-brands fa-whatsapp"></i> واتسئاپ
                    </a>
                    <a href="viber://chat?number=${item.phone}" target="_blank" class="viber-btn">
                        <i class="fa-brands fa-viber"></i> ڤایبەر
                    </a>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// کۆنترۆلا پەنجەرا تومارکرنێ و چوونە ژوورێ
function openAuthModal() {
    document.getElementById('authModal').style.display = 'block';
    switchAuthMode('login');
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function switchAuthMode(mode) {
    const loginForm = document.getElementById('loginFormContainer');
    const registerForm = document.getElementById('registerFormContainer');
    const loginBtn = document.getElementById('loginTabBtn');
    const regBtn = document.getElementById('registerTabBtn');

    if (mode === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginBtn.classList.add('active');
        regBtn.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        regBtn.classList.add('active');
        loginBtn.classList.remove('active');
    }
}

// ئەنجامدانا چوونە ژوورێ (Login API)
async function performLogin() {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    if (!username || !password) {
        alert('تکایە ناڤێ بەکارهێنەری و پاسوۆردی بنڤیسە!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (data.success) {
            alert(data.message);
            document.getElementById('profileName').innerText = data.user.username;
            document.getElementById('profileStatus').innerText = 'حسابا تە ل LEGEND STORE یا چالاکە.';
            document.getElementById('loginBtn').innerText = data.user.username;
            closeAuthModal();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('خەلەتیەک چێبوو!');
    }
}

// ئەنجامدانا دروستکرنا حسابا نوو و وەرگرتنا SMS ب ناڤێ LEGEND STORE
async function performRegister() {
    const username = document.getElementById('regUser').value;
    const password = document.getElementById('regPass').value;
    const phone = document.getElementById('regPhone').value;

    if (!username || !password || !phone) {
        alert('تکایە هەمی خانەیان تژی بکە!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, phone })
        });
        const data = await response.json();

        if (data.success) {
            alert(`${data.message} (کۆدێ تاقیکرنێ: ${data.code})`);
            document.getElementById('profileName').innerText = username;
            document.getElementById('profileStatus').innerText = 'حسابا نوو یا هاتیە دروستکرن و پشکنین.';
            document.getElementById('loginBtn').innerText = username;
            closeAuthModal();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('خەلەتیەک چێبوو د دروستکرنا حسابێ دا!');
    }
}
