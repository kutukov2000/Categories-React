import React, { useEffect, useState } from "react";
import { IProduct } from "./types";
import Table, { ColumnsType } from "antd/es/table";
import http_common from "../../../http_common";
import { APP_ENV } from "../../../env";
import { Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const ProductsListPage: React.FC = () => {
    const [list, setList] = useState<IProduct[]>([]);

    const urlServerImage = APP_ENV.BASE_URL + "/upload/150_";

    useEffect(() => {
        http_common.get("/api/products")
            .then(resp => {
                console.log(resp.data);
                setList(resp.data);
            });
    }, []);

    const deleteProduct = async (id: number) => {
        try {
            await http_common.delete(`/api/products/${id}`);
        }
        catch (ex) {
            message.error('Product deleting error!');
            return;
        }

        setList(prevProducts => prevProducts.filter(product => product.id !== id));
    }

    const columns: ColumnsType<IProduct> = [
        {
            title: "#",
            dataIndex: 'id'
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Description',
            dataIndex: 'description'
        },
        {
            title: 'Price',
            dataIndex: 'price'
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity'
        },
        {
            title: 'Images',
            dataIndex: 'product_images',
            render: (src: { name: string }[]) => (
                <>
                    {src.map((image) => (
                        <img key={image.name} src={urlServerImage + image.name} alt="" width={150} />
                    ))}
                </>
            )
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            render: (id) => {
                return (
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {/* <Link to={`edit/${id}`}>
                            <Button type="primary"
                                icon={<EditOutlined />}
                                size="large"
                                style={{ backgroundColor: '#eb8934' }} />
                        </Link> */}
                        <Button type="primary"
                            icon={<DeleteOutlined />}
                            size="large"
                            style={{ backgroundColor: '#8c1c1c' }}
                            onClick={() => { deleteProduct(id) }} />
                    </div>
                );
            }
        }
    ];

    return (
        <>
            <h1>Products list</h1>
            <Table dataSource={list} columns={columns} rowKey="id" />
        </>
    )
}

export default ProductsListPage;