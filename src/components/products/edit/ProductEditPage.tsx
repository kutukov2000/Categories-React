import { Button, Divider, Form, Input, Upload, message, Alert } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { IProductEdit } from "./types.ts";
import http_common from "../../../http_common.ts";
import { APP_ENV } from "../../../env/index.ts";
import { useCheckImageFile, useImagePreview } from "../../../utils/hooks.ts";
import ImagePreviewModal from "../../ImagePreviewModal.tsx";

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

const ProductEditPage = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const urlServerImage = APP_ENV.BASE_URL + "/upload/150_";

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [form] = Form.useForm();

    const { previewOpen, previewImage, previewTitle, handleCancel, handlePreview } = useImagePreview();

    useEffect(() => {
        http_common.get(`/api/products/${id}`)
            .then(response => {
                console.log(response.data);

                const imageFileList = response.data?.product_images.map((image: any) => ({
                    uid: image.id,
                    name: image.name,
                    status: 'done',
                    url: urlServerImage + image.name
                }));

                console.log(imageFileList)
                setFileList(imageFileList);

                form.setFieldsValue(
                    {
                        name: response.data?.name,
                        category_id: response.data?.category_id,
                        description: response.data?.description,
                        price: response.data?.price,
                        quantity: response.data?.quantity
                    });

            });
    }, [id]);

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        console.log('file:', fileList);

        if (fileList.length === 0) {
            setErrorMessage("Choose image!");
            return;
        }

        const model: IProductEdit = {
            category_id: values.category_id,
            name: values.name,
            description: values.description,
            price: values.price,
            quantity: values.quantity,
            images: fileList.map(file => file.originFileObj ? file.originFileObj : file.url) as File[]

        };
        console.log(model);

        try {
            await http_common.post(`/api/products/${id}`, model, {
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

    const handleImageFileChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);


    const checkImageFile = (file: RcFile) => useCheckImageFile(file);

    return (
        <>
            <Divider style={customDividerStyle}>Create product</Divider>
            {errorMessage && <Alert message={errorMessage} style={{ marginBottom: "20px" }} type="error" />}
            <Form
                form={form}
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
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={true}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={checkImageFile}
                    onChange={handleImageFileChange}
                    onPreview={handlePreview}
                    fileList={fileList}
                    accept={"image/*"}>
                    <PlusOutlined />
                </Upload>

                <ImagePreviewModal open={previewOpen}
                    title={previewTitle}
                    image={previewImage}
                    onCancel={handleCancel} />

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default ProductEditPage;