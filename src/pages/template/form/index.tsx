import React, { useState } from "react";
import { Form, Button, Input, Space, Select } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDynamicList } from "ahooks";
const { Option } = Select
export default () => {
    const { list, remove, getKey, push } = useDynamicList([[1,8]]);
    const [form] = Form.useForm();

    const handleSubmit = () => {
        form
            .validateFields()
            .then((vals) => {
                console.log("valsvals=", vals);


            })
            .catch(() => { })
    }

    const Row = (item: any, index: number) => (
        <div style={{ display: "flex" }} key={getKey(index)}>
            <div>
                <Form.Item
                    // rules={[{ required: true, message: "required" }]}
                    name={["address", getKey(index)]}
                // initialValue={item}
                >
                    <Input.Group >
                        <Input style={{ width: '50%' }} placeholder="Input street" />
                        <Input style={{ width: '50%' }} placeholder="Input street" />
                        <Select placeholder="Select province">
                            <Option value="Zhejiang">Zhejiang</Option>
                            <Option value="Jiangsu">Jiangsu</Option>
                        </Select>

                    </Input.Group>
                </Form.Item>
            </div>
            <div style={{ marginTop: 4 }}>
                {list.length > 1 && (
                    <MinusCircleOutlined
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                            remove(index);
                        }}
                    />
                )}
                <PlusCircleOutlined
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                        push("");
                    }}
                />
            </div>
        </div>
    );

    const opts = [
        {
            name: " 类型1",
            id: 1,
        },
        {
            name: " 类型2",
            id: 2,
        },
        {
            name: " 类型3",
            id: 3,
        },
        {
            name: " 类型4",
            id: 4,
        },
    ]
    return (
        <>
            <Form form={form}>
                {list.map((item, index) => Row(item, index))}
            </Form>
            <Button
                style={{ marginTop: 8 }}
                type="primary"
                onClick={handleSubmit}
            >
                Submit
             </Button>
        </>
    );
};
