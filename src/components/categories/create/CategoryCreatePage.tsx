import { Button, Divider, Form, Input, Upload, message, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { ICategoryCreate } from "./types.ts";
import http_common from "../../../http_common.ts";
import { useCheckImageFile } from "../../../utils/hooks.ts";

type FieldType = {
    name?: string;
};

const customDividerStyle = {
    borderTop: '2px solid #1890ff',
    margin: '5px 0 50px 0',
};

const CategoryCreatePage = () => {

    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        console.log('file:', file);

        if (file == null) {
            setErrorMessage("Choose image!");
            return;
        }

        const model: ICategoryCreate = {
            name: values.name,
            image: file
        };

        try {
            await http_common.post("/api/categories", model, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            //Return to home page
            navigate("/");
        }
        catch (ex) {
            message.error('Category creating error!');
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleImageFileChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            const file = info.file.originFileObj as File;
            setLoading(false);
            setFile(file);
            setErrorMessage("");
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const checkImageFile = (file: RcFile) => useCheckImageFile(file);

    return (
        <>
            <Divider style={customDividerStyle}>Create category</Divider>
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
                    rules={[{ required: true, message: 'Category name is required!' }]} >
                    <Input />
                </Form.Item>

                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={checkImageFile}
                    onChange={handleImageFileChange}
                    accept={"image/*"} >
                    {file ? <img src={URL.createObjectURL(file)} alt="Category image" style={{ width: '100%' }} /> : uploadButton}
                </Upload>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default CategoryCreatePage;