const baseUrl = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');

    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                forms.forEach(form => form.style.display = 'none');
                const targetId = tab.getAttribute('data-target');
                document.getElementById(targetId).style.display = 'block';
            });
        });
    }

    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value; 
            console.log(name, email, password);
            register(name, email, password);

        });
    }

    async function register(name,email,password) {
    try {
        console.log('Register attempt with:', name, email);
        const respose = await fetch(`${baseUrl}/registration`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        const data = await respose.text();
        console.log('Registration response:', data);

        if (respose.ok) {
            localStorage.setItem('currentUser', email);
            localStorage.setItem('userName', name);
            if (data.id) {
                localStorage.setItem('userId', data.id);
            }
            alert('OTP sent to your email');
            window.location.href = 'otp.html';
        } else {
            const errorMsg = typeof data === 'string' ? data : (data.message || 'Registration failed');
            alert(errorMsg);
            console.error('Registration failed:', errorMsg);
        }
    }catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed: ' + error.message);
    }
}

    const otpVerifyBtn = document.getElementById('otp-verify');
    if(otpVerifyBtn){
        otpVerifyBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const otp = document.getElementById('otp').value.trim();
            console.log(otp);
            verifyOtp(otp);
        });
    }

    async function verifyOtp(otp) {
        try {
            const email = localStorage.getItem('currentUser');
            console.log('OTP verification for:', email);
            const response = await fetch(`${baseUrl}/otp/verify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp })
            });
            const data = await response.text();
            console.log('OTP verification response:', data);

            if(response.ok){
                alert(data.message || 'OTP verified successfully');
                localStorage.setItem('isLoggedIn', 'true');
                if (data.id) {
                    localStorage.setItem('userId', data.id);
                }
                if (data.name) {
                    localStorage.setItem('userName', data.name);
                }
                window.location.href = 'index.html';
            } else {
                const errorMsg = typeof data === 'string' ? data : (data.message || 'OTP verification failed');
                alert(errorMsg);
                console.error('OTP verification failed:', errorMsg);
            }
        }catch (error) {
            console.error('OTP verification error:', error);
            alert('OTP verification failed: ' + error.message);
        }
    }

    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            console.log(email, password);
            login(email, password);
        });
    }

    async function login(email, password) {
        try {
            console.log('Login attempt with:', email);
            const response = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + btoa(`${email}:password`)
                },
                body: JSON.stringify({ email, password })
            });
            console.log('Response status:', response.status);
            const data = await response.text();
            console.log('Response data:', data);

            if(response.ok){
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', email);
                if (data.id) {
                    localStorage.setItem('userId', data.id);
                }
                if (data.name) {
                    localStorage.setItem('userName', data.name);
                }
                alert(data.message || 'Login successful');
                window.location.href = 'index.html';
            } else {
                const errorMsg = typeof data === 'string' ? data : (data.message || 'Login failed');
                alert(errorMsg);
                console.error('Login failed:', errorMsg);
            }
        }catch (error) {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message);
        }
    }
    

    const loginOtpBtn = document.getElementById('login-otp-btn');
    if (loginOtpBtn) {
        loginOtpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('otp-email').value.trim();
            loginWithOtp(email);
        });
    }

    async function loginWithOtp(email) {
        try {
            console.log('Login with OTP for:', email);
            const response = await fetch(`${baseUrl}/login/${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.text();
            console.log('Login OTP response:', data);

            if(response.ok){
                localStorage.setItem('currentUser', email);
                if (data.id) {
                    localStorage.setItem('userId', data.id);
                }
                if (data.name) {
                    localStorage.setItem('userName', data.name);
                }
                alert(data.message || 'OTP sent to your email');
                window.location.href = 'otp.html';
            } else {
                const errorMsg = typeof data === 'string' ? data : (data.message || 'Failed to send OTP');
                alert(errorMsg);
                console.error('Login OTP failed:', errorMsg);
            }
        }catch (error) {
            console.error('Login OTP error:', error);
            alert('Login failed: ' + error.message);
        }
    }












































































});