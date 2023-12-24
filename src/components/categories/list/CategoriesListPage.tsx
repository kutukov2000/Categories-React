import React, { useEffect, useState } from "react";
import { ICategoryItem } from "./types";
import Table, { ColumnsType } from "antd/es/table";
import http_common from "../../../http_common";
import { APP_ENV } from "../../../env";

const CategoriesListPage: React.FC = () => {
    const [list, setList] = useState<ICategoryItem[]>([]);

    const urlServerImage = APP_ENV.BASE_URL +"/upload/150_";

    useEffect(() => {
        http_common.get("/api/categories")
            .then(resp => {
                console.log(resp.data);
                setList(resp.data);
            });
    }, []);

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
                    <img src={urlServerImage+src} alt="" width={150} />
                );
            }
        },
        {
            title: 'Name',
            dataIndex: 'name'
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