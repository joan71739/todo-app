
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const BASE_URL = BASE + '/api'

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('token');
    const headers = options.headers ? { ...options.headers } : {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 預設的 fetch 選項
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });


    // 只有在非登入請求且驗證失敗時才跳轉
    if (res.status !== 200 && path !== '/login') {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return { status: res.status, data: null };
    }

    //驗證成功
    const contentType = res.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
        data = await res.json();
    } else {
        data = await res.text();
    }
    return { status: res.status, data };
};

// 統一使用你的 apiFetch，不用 axios
export const login = async (username, password) => {
    try {
        const result = await apiFetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (result.status === 200) {
            return result.data; // 成功回傳 token
        } else {
            throw new Error('登入失敗');
        }
    } catch (error) {
        throw error.message || '登入失敗';
    }
};
