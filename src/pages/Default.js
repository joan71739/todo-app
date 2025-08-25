import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DataTable from 'react-data-table-component';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/esm/CardBody';
import { apiFetch } from '../services/api'

function Default() {
    // const [tasks, setTasks] = useState([
    //     // 範例資料
    //     { id: 1, title: '學習 React', status: '待辦', detail: '需要學習時間48小時', due: '2025-08-20' },
    //     { id: 2, title: '寫作業', status: '進行中', detail: '', due: '2025-07-02' },
    // ]);

    const [tasks, setTasks] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchTasks = async () => {
        try {
            const res = await apiFetch('/tasks');
            setTasks(res.data);
            setErrorMsg('');
        } catch (e) {
            setErrorMsg('取得任務失敗');
            setTasks([]);
        }
    }

    //畫面載入完成後loading
    useEffect(() => {
        fetchTasks();
    }, []);






    // 狀態分類計算
    const todoCount = tasks.filter(t => t.status === '待辦').length;
    const doingCount = tasks.filter(t => t.status === '進行中').length;
    const doneCount = tasks.filter(t => t.status === '已完成').length;
    // 今日到期計算
    const today = new Date().toISOString().slice(0, 10);
    const dueTodayCount = tasks.filter(t => t.due === today).length;





    //datatables使用
    // columns 設定
    const columns = [
        { name: '任務標題', selector: row => row.title, sortable: true, $center: true },
        { name: '狀態', selector: row => row.status, sortable: true, $center: true },
        { name: '說明', selector: row => row.detail, sortable: true, $center: true },
        { name: '截止日期', selector: row => row.due, sortable: true, $center: true },
        {
            name: '編輯',
            cell: row => (
                <Button variant="warning" size="sm" onClick={() => handleEditClick(row)}>
                    編輯
                </Button>
            ),
            ignoreRowClick: true,
            $center: true,
        },
        {
            name: '刪除',
            cell: row => (
                <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>
                    刪除
                </Button>
            ),
            ignoreRowClick: true,
            $center: true,
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                justifyContent: 'center',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '1rem',
            },
        },
        cells: {
            style: {
                justifyContent: 'center',
                textAlign: 'center',
                fontSize: '1rem',
            },
        },
        rows: {
            style: {
                minHeight: '48px',
            },
        },
    };
    const paginationComponentOptions = {
        rowsPerPageText: '每頁顯示筆數',
        rangeSeparatorText: '共',
        selectAllRowsItem: false,
        selectAllRowsItemText: '全部',
    };


    //新增任務
    const [newTitle, setNewTitle] = useState('');
    const [newStatus, setNewStatus] = useState('待辦');
    const [newDue, setNewDue] = useState('');
    const [newDetail, setNewDetail] = useState('');
    const [addErrorMsg, setAddErrorMsg] = useState('');

    const handleAdd = async () => {
        if (!newTitle.trim()) return;
        try {
            const res = await apiFetch('/tasks', {
                method: 'POST',
                body: JSON.stringify({
                    title: newTitle,
                    status: newStatus,
                    due: newDue,
                    detail: newDetail,
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.status !== 200) {
                setAddErrorMsg('新增任務失敗');
            } else {
                setAddErrorMsg('');
            }
            setNewTitle('');
            setNewStatus('待辦');
            setNewDue('');
            setNewDetail('');
            fetchTasks(); // 新增後重新取得任務
        } catch (error) {
            setAddErrorMsg('新增任務失敗');
        }
    };

    //刪除任務
    const [deleteErrorMsg, setDeleteErrorMsg] = useState('');

    const handleDelete = async (id) => {
        try {
            const res = await apiFetch(`/tasks?id=${id}`, {
                method: 'DELETE',
            });
            if (res.status !== 200) {
                setDeleteErrorMsg('刪除任務失敗');
            } else {
                setDeleteErrorMsg('');
            }
            fetchTasks(); // 刪除成功後重新取得任務
        } catch (error) {
            setDeleteErrorMsg('刪除任務失敗');
        }
    };

    //編輯任務
    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [editingStatus, setEditingStatus] = useState('待辦');
    const [editingDue, setEditingDue] = useState('');
    const [editingDetail, setEditingDetail] = useState('');
    const [editErrorMsg, setEditErrorMsg] = useState('');

    // 編輯按鈕事件
    const handleEditClick = (task) => {
        const formattedDue = task.due ? task.due.replace(/\//g, '-') : '';
        setEditingId(task.id);
        setEditingTitle(task.title);
        setEditingStatus(task.status);
        setEditingDue(formattedDue);
        setEditingDetail(task.detail);
        setTimeout(() => {
            const editCard = document.getElementById('edit-card');
            if (editCard) {
                editCard.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    // 儲存編輯
    const handleEditSave = async () => {
        try {
            const formattedDue = editingDue ? editingDue.replace(/-/g, '/') : '';
            const res = await apiFetch(`/tasks/${editingId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: editingTitle,
                    status: editingStatus,
                    due: formattedDue,
                    detail: editingDetail,
                }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.status !== 200) {
                setEditErrorMsg('編輯任務失敗');
            } else {
                setEditErrorMsg('');
                fetchTasks(); // 編輯成功後重新取得任務
            }
            setEditingId(null);
            setEditingTitle('');
            setEditingStatus('待辦');
            setEditingDue('');
            setEditingDetail('');
        } catch (error) {
            setEditErrorMsg('編輯任務失敗');
        }
    };

    return (
        <div>
            <h2>任務總覽</h2>
            {/* 今日到期卡片 */}
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
                <Card
                    bg="danger"
                    text="white"
                    style={{ width: '18rem' }}
                    className="mb-2"
                >
                    <Card.Header>今日到期</Card.Header>
                    <Card.Body>
                        <Card.Title>今日到期任務</Card.Title>
                        <Card.Text>
                            共 {dueTodayCount} 筆
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>

            {/* 狀態卡片區塊 */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <Card
                    bg="primary"
                    text="white"
                    style={{ width: '18rem' }}
                    className="mb-2"
                >
                    <Card.Header>待辦</Card.Header>
                    <Card.Body>
                        <Card.Title>待辦任務</Card.Title>
                        <Card.Text>
                            共 {todoCount} 筆
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card
                    bg="warning"
                    text="dark"
                    style={{ width: '18rem' }}
                    className="mb-2"
                >
                    <Card.Header>進行中</Card.Header>
                    <Card.Body>
                        <Card.Title>進行中任務</Card.Title>
                        <Card.Text>
                            共 {doingCount} 筆
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card
                    bg="success"
                    text="white"
                    style={{ width: '18rem' }}
                    className="mb-2"
                >
                    <Card.Header>已完成</Card.Header>
                    <Card.Body>
                        <Card.Title>已完成任務</Card.Title>
                        <Card.Text>
                            共 {doneCount} 筆
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>




            <h2>任務列表</h2>
            {errorMsg && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                    {errorMsg}
                </div>
            )}
            {addErrorMsg && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                    {addErrorMsg}
                </div>
            )}
            {deleteErrorMsg && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                    {deleteErrorMsg}
                </div>
            )}
            {editErrorMsg && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                    {editErrorMsg}
                </div>
            )}
            {/* 新增任務 */}
            <div className="add-task-row" style={{ marginBottom: '1rem', display: 'flex', alignItems: ' center', gap: '0.5rem' }}>
                <Form.Control
                    type="text"
                    placeholder="任務標題"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    style={{ width: '20rem' }}
                />
                <Form.Select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                    style={{ marginRight: '0.5rem', width: '10rem' }}
                >
                    <option value="待辦">待辦</option>
                    <option value="進行中">進行中</option>
                    <option value="已完成">已完成</option>
                </Form.Select>
                <Form.Control
                    type="text"
                    placeholder="任務說明"
                    value={newDetail}
                    onChange={e => setNewDetail(e.target.value)}
                    style={{ width: '30rem' }}
                />
                <Form.Control
                    type="date"
                    value={newDue}
                    onChange={e => setNewDue(e.target.value)}
                    style={{ marginRight: '0.5rem', width: '10rem' }}
                />
                <Button variant="outline-primary" onClick={handleAdd}>新增任務</Button>
            </div>
            <div className="table-responsive">
                <DataTable
                    columns={columns}
                    data={tasks}
                    pagination
                    highlightOnHover
                    striped
                    customStyles={customStyles}
                    paginationComponentOptions={paginationComponentOptions}
                />
            </div>
            {/* 編輯表單（只有選取任務時顯示） */}
            {editingId && (
                <Card id="edit-card" style={{ marginTop: '1rem', padding: '1rem' }}>
                    <CardBody>
                        <h4>編輯任務</h4>
                        <Form.Group style={{ marginBottom: '0.5rem' }}>
                            <Form.Label>任務標題</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingTitle}
                                onChange={e => setEditingTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group style={{ marginBottom: '0.5rem' }}>
                            <Form.Label>狀態</Form.Label>
                            <Form.Select
                                value={editingStatus}
                                onChange={e => setEditingStatus(e.target.value)}
                            >
                                <option value="待辦">待辦</option>
                                <option value="進行中">進行中</option>
                                <option value="已完成">已完成</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group style={{ marginBottom: '0.5rem' }}>
                            <Form.Label>說明</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingDetail}
                                onChange={e => setEditingDetail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group style={{ marginBottom: '0.5rem' }}>
                            <Form.Label>截止日期</Form.Label>
                            <Form.Control
                                type="date"
                                value={editingDue}
                                onChange={e => setEditingDue(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleEditSave} style={{ marginRight: '1rem', marginTop: '1rem' }}>
                            儲存編輯
                        </Button>
                        <Button variant="secondary" onClick={() => setEditingId(null)} style={{ marginTop: '1rem' }}>
                            取消編輯
                        </Button>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}

export default Default;