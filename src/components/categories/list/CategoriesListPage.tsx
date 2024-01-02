import React, { useEffect, useState } from "react";
import { ICategoryItem } from "./types";
import Table, { ColumnsType } from "antd/es/table";
import http_common from "../../../http_common";
import { APP_ENV } from "../../../env";
import { Button, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const CategoriesListPage: React.FC = () => {
    const [list, setList] = useState<ICategoryItem[]>([]);

    const urlServerImage = APP_ENV.BASE_URL + "/upload/150_";

    useEffect(() => {
        http_common.get("/api/categories")
            .then(resp => {
                console.log(resp.data);
                setList(resp.data);
            });
    }, []);

    const deleteCategory = async (id: number) => {
        try {
            await http_common.delete(`/api/categories/${id}`);
        }
        catch (ex) {
            message.error('Category creating error!');
            return;
        }

        setList(prevCategories => prevCategories.filter(category => category.id !== id));
    }

    const columns: ColumnsType<ICategoryItem> = [
        {
            title: "#",
            dataIndex: 'id'
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (src: string) => {
                return (
                    <img src={urlServerImage + src} alt="" width={150} />
                );
            }
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            render: (id) => {
                return (
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <Link to={`edit/${id}`}>
                            <Button type="primary" 
                                    icon={<EditOutlined />} 
                                    size="large" 
                                    style={{ backgroundColor: '#eb8934' }} />
                            </Link>
                        <Button type="primary"
                            icon={<DeleteOutlined />}
                            size="large"
                            style={{ backgroundColor: '#8c1c1c' }}
                            onClick={() => { deleteCategory(id) }} />
                    </div>
                );
            }
        }
    ];

    return (
        <>
            <h1>Список категорій</h1>
            <Table dataSource={list} columns={columns} />
        </>
    )
}

export default CategoriesListPage;