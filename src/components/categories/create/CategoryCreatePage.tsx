import { Button, Divider, Form, Input, Upload, message, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { ICategoryCreate } from "./types.ts";
import http_common from "../../../http_common.ts";
import { useCheckImageFile, useImagePreview } from "../../../utils/hooks.ts";
import ImagePreviewModal from "../../ImagePreviewModal.tsx";

type FieldType = {
    name?: string;
};

const customDividerStyle = {
    borderTop: '2px solid #1890ff',
    margin: '5px 0 50px 0',
};

const CategoryCreatePage = () => {

    const navigate = useNavigate();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const { previewOpen, previewImage, previewTitle, handleCancel, handlePreview } = useImagePreview();

    const onFinish = async (values: any) => {
        console.log('Success:', values);

        if (fileList == null) {
            setErrorMessage("Choose image!");
            return;
        }

        const fileListAsFile = fileList.map(file => file.originFileObj ? file.originFileObj : file.url) as File[];

        const model: ICategoryCreate = {
            name: values.name,
            image: fileListAsFile[0]
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

    const handleImageFileListChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

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
                    showUploadList={true}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={checkImageFile}
                    onChange={handleImageFileListChange}
                    onPreview={handlePreview}
                    accept={"image/*"} >
                    {fileList?.length > 0 ? null : <PlusOutlined />}
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

export default CategoryCreatePage;