import React, { useState } from 'react';
import {
    Table,
    Input,
    InputNumber,
    Popconfirm,
    Form,
    Typography,
    Divider,
    Radio,
    Button,
} from 'antd';
const originData = [];

for (let i = 0; i < 5; i++) {
    originData.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        age: 18,
        address: `London Park no. ${i}`,
        gender: i % 2 === 0 ? "male" : "female"
    });
}
const initRow = {
    key: "100",
    name: "Edrward 100",
    age: 18,
    address: "London Park no. 100",
    gender: "female",
}
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    let inputNode = <Input />;
    if (inputType === 'radio') {
        inputNode = <Radio.Group >
            <Radio value={"male"}>male</Radio>
            <Radio value={"female"}>female</Radio>
        </Radio.Group>
    }
    if (inputType === 'number') {
        inputNode = <InputNumber />
    }
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const EditableTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };
    const deleteRow = (record) => {
        const dataSub = data.filter(row => row.key !== record.key)
        setData(dataSub)
    };
    const addRow = (record: any = {}) => {
        const newRowKey = record.key ? record.key + Date.now() : String(Date.now())
        let newRow = { ...initRow, key: newRowKey }
        const newData = [...data];
        const index = newData.findIndex((row) => record.key === row.key);
        if (index > -1) {
            newRow = { ...record, key: newRowKey }
            newData.splice(index + 1, 0, newRow);
            setData(newData);
            edit(newRow)
        } else {
            newData.push(newRow);
            setData(newData);
            edit(newRow)
        }
    };
    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'name',
            dataIndex: 'name',
            editable: true,
        },
        {
            title: 'age',
            dataIndex: 'age',
            editable: true,
        },
        {
            title: 'gender',
            dataIndex: 'gender',
            editable: true,
        },
        {
            title: 'address',
            dataIndex: 'address',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const isEditingRow = isEditing(record);
                return isEditingRow ? (
                    <span>
                        <a
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </a>
                        <Divider type="vertical" />
                        <a onClick={cancel}>Cancel</a>
                    </span>
                ) : (
                    <>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Divider type="vertical" />
                        <Typography.Link disabled={editingKey !== ''} >
                            <Popconfirm title="Sure to delete?" onConfirm={() => deleteRow(record)}>
                                delete
                            </Popconfirm>
                        </Typography.Link>
                        <Divider type="vertical" />
                        <Typography.Link disabled={editingKey !== ''} onClick={() => addRow(record)} >
                            addRow
                        </Typography.Link>
                    </>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        let type = 'text'
        if (col.dataIndex === 'age') {
            type = 'number'
        }
        if (col.dataIndex === 'gender') {
            type = 'radio'
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: type,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    console.log("datadata==", data);
    const toSubmit = () => {
        form.validateFields()
            .then(vals => {
                console.log("vals==", vals);

            })
            .catch((err => {
                console.log("form err==", err);

            }))
    }
    return (
        <>
            <Button disabled={false} onClick={() => addRow()}>addRow</Button>
            <Button onClick={toSubmit}>submit</Button>

            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={false}
                />
            </Form>
        </>
    );
};

export default EditableTable