import './App.css';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';


function App() {

    const navigate = useNavigate();

    //確認登入狀態及跳轉login
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]
    );

    // //單筆資料
    // const [helloMsg, setHelloMsg] = useState('');
    // const fetchHello = async () => {
    //     try {
    //         const response = await apiFetch('');
    //         setHelloMsg(response.data)
    //     } catch (e) {
    //         setHelloMsg('取得失敗')
    //     }
    // };

    // //list資料
    // const [list, setList] = useState([]);
    // const [errorMsgList, setErrorMsgList] = useState('');

    // const fetchList = async () => {
    //     try {
    //         const response = await apiFetch('/people');
    //         setList(response.data)
    //         setErrorMsgList('');
    //     } catch (e) {
    //         setErrorMsgList('取得失敗');
    //         setList([]);
    //     }
    // }

    // //刪除資料
    // const [selectedId, setSelectedId] = useState(null);

    // const handleSelect = (id) => {
    //     setSelectedId(id);
    // }

    // const handleDelete = async () => {
    //     if (!selectedId) return;
    //     try {
    //         const response = await apiFetch(`/people?id=${selectedId}`, { method: 'DELETE' });
    //         if (response.status === 200) {
    //             setList(list.filter(item => item.id !== selectedId));
    //             setSelectedId(null);
    //             setErrorMsgList('')
    //         } else {
    //             setErrorMsgList('刪除失敗')
    //         }

    //     } catch (e) {
    //         setErrorMsgList('刪除失敗')
    //     }
    // }

    // //新增資料
    // const [newName, setNewName] = useState('');
    // const [addMsg, setAddMsg] = useState('');

    // const handleAdd = async () => {
    //     if (!newName.trim()) {
    //         setAddMsg('請輸入名稱');
    //         return;
    //     }
    //     try {
    //         const response = await apiFetch('/people', {
    //             method: 'POST',
    //             body: JSON.stringify({ name: newName }),
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         if (response.status === 201 || response.status === 200) {
    //             setList([...list, response.data]);
    //             setNewName('');
    //             setAddMsg('新增成功');
    //         } else {
    //             setAddMsg('新增失敗');
    //         }
    //     } catch (e) {
    //         setAddMsg('新增失敗');
    //     }
    // };

    // //編輯資料
    // const [editingId, setEditingId] = useState(null);
    // const [editingName, setEditingName] = useState('');
    // const [editMsg, setEditMsg] = useState('');

    // const handleEditClick = (id, name) => {
    //     setEditingId(id);
    //     setEditingName(name);
    //     setEditMsg('');
    // }

    // const handleEditChange = (e) => {
    //     setEditingName(e.target.value);
    // }

    // const handleEditSave = async () => {
    //     if (!editingName.trim()) {
    //         setEditMsg('請輸入名稱');
    //         return;
    //     }
    //     try {
    //         const response = await apiFetch(`/people/${editingId}`, {
    //             method: 'PUT',
    //             body: JSON.stringify({ name: editingName }),
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         if (response.status === 200) {
    //             setList(list.map(item => item.id === editingId ? { ...item, name: editingName } : item))
    //             setEditingId(null);
    //             setEditingName('');
    //             setEditMsg('編輯成功');
    //         } else {
    //             setEditMsg('編輯失敗');
    //         }
    //     } catch (error) {
    //         setEditMsg('編輯失敗');
    //     }
    // }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
        </Routes>
    );
}

export default App;