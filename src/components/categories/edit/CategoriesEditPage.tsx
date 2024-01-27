import { useEffect, useState } from "react";
import { Button, Divider, Form, Input, Upload, message, Alert } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { ICategoryEdit } from "./types.ts";
import { APP_ENV } from "../../../env/index.ts";
import http_common from "../../../http_common.ts";
import { useCheckImageFile, useImagePreview } from "../../../utils/hooks.ts";
import { PlusOutlined } from "@ant-design/icons";
import ImagePreviewModal from "../../ImagePreviewModal.tsx";

type FieldType = {
    name?: string;
};

const customDividerStyle = {
    borderTop: '2px solid #1890ff',
    margin: '5px 0 50px 0',
};

const CategoriesEditPage = () => {
    const { id } = useParams();

    // const [category, setCategory] = useState<ICategoryEdit>();
    const navigate = useNavigate();
    const urlServerImage = APP_ENV.BASE_URL + "/upload/150_";

    const [form] = Form.useForm(); // Using Ant Design useForm hook

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const { previewOpen, previewImage, previewTitle, handleCancel, handlePreview } = useImagePreview();

    useEffect(() => {
        http_common.get(`/api/categories/${id}`)
            .then(response => {
                console.log(response.data);
                // setCategory(response.data);
                form.setFieldsValue({ name: response.data?.name });

                setFileList([
                    {
                        uid: response.data?.id,
                        name: response.data?.image,
                        status: 'done',
                        url: urlServerImage + response.data?.image
                    }
                ]);
                console.log(urlServerImage + response.data?.image);
            });
    }, [id]);

    const onFinish = async (values: any) => {
        console.log('Success:', values);

        if (fileList == null) {
            setErrorMessage("Choose image!");
            return;
        }

        const fileListAsFile = fileList.map(file => file.originFileObj ? file.originFileObj : file.url) as File[];

        const model: ICategoryEdit = {
            name: values.name,
            image: fileListAsFile[0]
        };

        try {
            await http_common.post(`/api/categories/edit/${id}`, model, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            // Return to home page or handle success as needed
            navigate("/");
        } catch (ex) {
            message.error('Category editing error!');
        }
    };

    const handleImageFileListChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const checkImageFile = (file: RcFile) => useCheckImageFile(file);

    return (
        <>
            <Divider style={customDividerStyle}>Edit category</Divider>
            {errorMessage && <Alert message={errorMessage} style={{ marginBottom: "20px" }} type="error" />}
            <Form
                form={form} // Pass the form instance to the Form component
                style={{ maxWidth: 1000 }}
                onFinish={onFinish}
                autoComplete="off">
                <Form.Item<FieldType>
                    label="Name"
                    name="name"
                    key="name"
                    rules={[{ required: true, message: 'Category name is required!' }]} >
                    <Input />
                </Form.Item>

                <Upload
                    name="image"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={true}
                    fileList={fileList}
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
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default CategoriesEditPage;


