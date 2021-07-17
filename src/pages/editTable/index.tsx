import React, { useRef } from 'react';
import {
    Layout,
    Button,
    Divider,
} from 'antd';
const { Header, Content, Footer } = Layout;
import EditTable, { sendToParentT, columnsT } from "./components/EditTable";
import './style.less'
interface recordT {
    rowKey: string
    name: string
    age: number
    address: string
    gender: number
    country: 'china'
}

const originData: recordT[] = [];

for (let i = 0; i < 5; i++) {
    originData.push({
        rowKey: i.toString(),
        name: `Edrward ${i}`,
        age: 18,
        address: `London Park no. ${i}`,
        gender: i % 2 === 0 ? 0 : 1,
        country: 'china'
    });
}

const initRow: recordT = {
    rowKey: '',
    name: "Edrward 100",
    age: 18,
    address: "London Park no. 100",
    gender: 1,
    country: 'china',
}
const columns: columnsT<recordT> = [
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
        inputType: "radio",
        radioOps: [{ label: "male", value: 1 }, { label: "female", value: 0 }, { label: "unknown", value: 1.5 }],
        render: (val) => val === 1 ? "male" : val === 0 ? "female" : "unknown"
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
            <Content style={{ padding: '0 40px' }}>
                <Divider>可编辑、拖拽排序table</Divider>
                <EditTable
                    originData={originData}
                    initRow={initRow}
                    ref={tableRef}
                    columns={columns as any}
                />
                <Button style={{ marginTop: 24 }} onClick={getData} type={"primary"}>submit</Button>
                <Divider></Divider>
            </Content>
            <Footer style={{ textAlign: 'center' }}> xiao_feiji</Footer>
        </Layout>
    )
}

export default IndexPage