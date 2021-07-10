import React, { useRef } from 'react';
import {
    Layout,
    Button,
    Popconfirm,
    Form,
    Typography,
    Divider,
    Space,
} from 'antd';
const { Header, Content, Footer } = Layout;
import EditTable, { sendToParentT } from "./components/EditTable";


interface recordT {
    key: string
    name: string
    age: number
    address: string
    gender: "male" | "female"
    country: 'china'
}

const originData: recordT[] = [];

for (let i = 0; i < 5; i++) {
    originData.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        age: 18,
        address: `London Park no. ${i}`,
        gender: i % 2 === 0 ? "male" : "female",
        country: 'china'
    });
}

const initRow: recordT = {
    key: '',
    name: "Edrward 100",
    age: 18,
    address: "London Park no. 100",
    gender: "female",
    country: 'china',
}
const columns = [
    {
        title: 'name',
        dataIndex: 'name',
        editable: true,
        inputType: "text"
    },
    {
        title: 'age',
        dataIndex: 'age',
        editable: true,
        inputType: "number"
    },
    {
        title: 'gender',
        dataIndex: 'gender',
        editable: true,
        inputType: "radio"
    },
    {
        title: 'address',
        dataIndex: 'address',
        editable: true,
    },
    {
        title: 'country',
        dataIndex: 'country',
    },
];

const IndexPage = () => {
    const tableRef = useRef<sendToParentT<recordT>>(null);
    const getData = () => {
        const { current: tableObj } = tableRef
        if (!tableObj) {
            return
        }
        console.log("tableObj.data==", tableObj.data);
        tableObj.childFun()
    }

    return (
        <Layout className="layout">
            <Header>
                <div className="logo" />
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Divider>可编辑、拖拽排序table</Divider>
                <EditTable
                    originData={originData}
                    initRow={initRow}
                    ref={tableRef}
                    columns={columns}
                />
                <Button style={{marginTop:24}} onClick={getData} type={"primary"}>submit</Button>
                <Divider></Divider>
            </Content>
            <Footer style={{ textAlign: 'center' }}> xiao_feiji</Footer>
        </Layout>
    )
}

export default IndexPage