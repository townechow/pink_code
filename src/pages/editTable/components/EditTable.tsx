import React, {
    useState,
    useCallback,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';
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
import { ColumnsType, ColumnType } from 'antd/es/table';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface propsT<recordT> {
    originData: recordT[]
    initRow: recordT
    columns: columnsT<recordT>
    // refSup: any
}
export declare type columnsT<recordT = unknown> = columnT<recordT>[];
export interface columnT<recordT> extends ColumnType<recordT> {
    editable?: boolean
    inputType?: "text" | "number" | "radio"
    radioOps?: radioT[]
}
interface radioT {
    label: string
    value: any
}
interface T {
    rowKey: string
}
export interface sendToParentT<recordT> {
    data: recordT[]
    childFun: () => void
}

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    radioOps = [],
    children,
    ...restProps
}: any) => {

    let inputNode = <Input />;

    if (inputType === 'radio') {
        inputNode = <Radio.Group >
            {
                radioOps.map((op: radioT) => {
                    return <Radio key={op.label} value={op.value}>{op.label}</Radio>
                })
            }
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

const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }: any) => {
    const DragType = 'DragableBodyRow';
    const ref = useRef();
    const [{ isOver, dropClassName }, drop] = useDrop({
        accept: DragType,
        collect: (monitor: any) => {
            const { index: dragIndex } = monitor.getItem() || {};
            if (dragIndex === index) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
            };
        },
        drop: (item: any) => {
            moveRow(item.index, index);
        },
    });
    const [_, drag] = useDrag({
        type: DragType,
        item: { index },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drop(drag(ref));

    return (
        <tr
            ref={ref}
            className={`${className}${isOver ? dropClassName : ''}`}
            style={{ cursor: 'move', ...style }}
            {...restProps}
        />
    );
};
function EditableTable<recordT extends T>(props: propsT<recordT>, ref: any) {
    const { originData, initRow, columns } = props
    const [form] = Form.useForm();
    const [data, setData] = useState<recordT[]>(originData);
    const [editingKey, setEditingKey] = useState('');
    const [newRowKey, setNewRowKey] = useState('');
    const refTable = useRef(null);
    const isEditing = (record: recordT) => record.rowKey === editingKey;

    const edit = (record: recordT) => {
        form.setFieldsValue({
            ...initRow,
            ...record,
        });
        setEditingKey(record.rowKey);
    };
    const deleteRow = (record: recordT) => {
        const dataSub = data.filter(row => row.rowKey !== record.rowKey)
        setData(dataSub)
    };
    const addRow = (record: recordT) => {
        const newRowKey = record.rowKey ? record.rowKey + Date.now() : String(Date.now())
        let newRow = { ...initRow, rowKey: newRowKey }
        const newData = [...data];
        const index = newData.findIndex((row) => record.rowKey === row.rowKey);
        if (index > -1) {
            newRow = { ...record, rowKey: newRowKey }
            newData.splice(index + 1, 0, newRow);
            setData(newData);
            edit(newRow)
        } else {
            newData.push(newRow);
            setData(newData);
            edit(newRow)
        }
        setNewRowKey(newRowKey)
    };
    const cancel = () => {
        setData(data.filter(item => item.rowKey !== newRowKey));
        setEditingKey('');
    };

    const save = async (rowKey: string) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => rowKey === item.rowKey);

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

    const columnMore = [
        ...columns,
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_val: any, record: recordT) => {
                const isEditingRow = isEditing(record);
                return isEditingRow ? (
                    <span>
                        <a
                            onClick={() => save(record.rowKey)}
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
                                Delete
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

    const mergedColumns = columnMore.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: recordT) => ({
                record,
                inputType: col.inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                radioOps: col.radioOps
            }),
        };
    });

    const moveRow = useCallback(
        (dragIndex, hoverIndex) => {
            const newData = [...data]
            const dragRow = data[dragIndex];
            newData.splice(dragIndex, 1)
            newData.splice(hoverIndex, 0, dragRow)
            setData(newData);
        },
        [data],
    );
    useImperativeHandle(ref, (): sendToParentT<recordT> => {
        // return 的内容可通过父组件ref current 访问
        return {

            childFun() {
                console.log("data==", data);
            },
            data,
        }
    })
    // console.log("datadata==", data);
    return (
        <div ref={refTable} className="edit-sort-table">
            <Button disabled={editingKey !== ''} type={"primary"} style={{ marginBottom: 20 }} onClick={() => addRow(initRow)}>addRow</Button>
            <DndProvider backend={HTML5Backend}>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                                row: DragableBodyRow,
                            },
                        }}
                        bordered
                        dataSource={data}
                        columns={mergedColumns as ColumnsType<recordT>}
                        rowClassName="editable-row"
                        pagination={false}
                        onRow={(_record, index) => ({
                            index,
                            moveRow,
                        }) as any}
                        rowKey={"rowKey"}
                        style={{ pointerEvents: data.length ? "all" : "none" }}
                    />
                </Form>
            </DndProvider>
        </ div>
    );
};
export default forwardRef(EditableTable)