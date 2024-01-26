import { Button, Divider, Form, Input, Upload, message, Alert, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { IProductCreate } from "./types.ts";
import http_common from "../../../http_common.ts";
import { useCheckImageFile, useImagePreview } from "../../../utils/hooks.ts";

type FieldType = {
    category_id?: string;
    name?: string;
    description?: string;
    price?: string;
    quantity?: string;
};

const customDividerStyle = {
    borderTop: '2px solid #1890ff',
    margin: '5px 0 50px 0',
};

const ProductCreatePage = () => {

    const navigate = useNavigate();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const { previewOpen, previewImage, previewTitle, handleCancel, handlePreview } = useImagePreview();  

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        console.log('file:', fileList);

        if (fileList.length === 0) {
            setErrorMessage("Choose image!");
            return;
        }

        const model: IProductCreate = {
            category_id: values.category_id,
            name: values.name,
            description: values.description,
            price: values.price,
            quantity: values.quantity,
            images: fileList.map(file => file.originFileObj as File)
        };
        console.log(model);

        try {
            await http_common.post("/api/products", model, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            //Return to home page
            navigate("/products");
        }
        catch (ex) {
            message.error('Product creating error!');
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleImageFileListChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const checkImageFile = (file: RcFile) => useCheckImageFile(file);

    return (
        <>
            <Divider style={customDividerStyle}>Create product</Divider>
            {errorMessage && <Alert message={errorMessage} style={{ marginBottom: "20px" }} type="error" />}
            <Form
                style={{ maxWidth: 1000 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off" >
                <Form.Item<FieldType>
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Product name is required!' }]} >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Product description is required!' }]} >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Product price is required!' }]} >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Quantity"
                    name="quantity"
                    rules={[{ required: true, message: 'Product quantity is required!' }]} >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Category Id"
                    name="category_id"
                    rules={[{ required: true, message: 'Category Id is required!' }]} >
                    <Input />
                </Form.Item>

                <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    showUploadList={true}
                    fileList={fileList}
                    beforeUpload={checkImageFile}
                    onChange={handleImageFileListChange}
                    onPreview={handlePreview}
                    accept={"image/*"}>
                    <PlusOutlined />
                </Upload>

                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default ProductCreatePage;