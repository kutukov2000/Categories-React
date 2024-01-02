import { useEffect, useState } from "react";
import { Button, Divider, Form, Input, Upload, message, Alert } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { ICategoryEdit } from "./types.ts";
import { APP_ENV } from "../../../env/index.ts";
import http_common from "../../../http_common.ts";

type FieldType = {
    name?: string;
};

const customDividerStyle = {
    borderTop: '2px solid #1890ff',
    margin: '5px 0 50px 0',
};

const CategoriesEditPage = () => {
    const { id } = useParams();

    const [category, setCategory] = useState<ICategoryEdit>();
    const navigate = useNavigate();
    const urlServerImage = APP_ENV.BASE_URL + "/upload/150_";

    const [form] = Form.useForm(); // Using Ant Design useForm hook

    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        http_common.get(`/api/categories/${id}`)
            .then(response => {
                console.log(response.data);
                setCategory(response.data);
                form.setFieldsValue({ name: response.data?.name });
            });
    }, [id]);

    const onFinish = async (values:any) => {
        console.log('Success:', values);
        console.log('file:', file);

        if (file == null) {
            setErrorMessage("Choose image!");
            return;
        }

        const model: ICategoryEdit = {
            name: values.name,
            image: file
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

    const handleImageFileChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'done') {
            const file = info.file.originFileObj as File;
            setFile(file);
            setErrorMessage("");
        }
    };

    const checkImageFile = (file: RcFile) => {
        const isImage = /^image\/\w+/.test(file.type);
        if (!isImage) {
            message.error('Choose an image file!');
        }

        const isSmallerThat10Mb = file.size / 1024 / 1024 < 10;
        if (!isSmallerThat10Mb) {
            message.error('File size should not exceed 10MB!');
        }

        return isImage && isSmallerThat10Mb;
    };

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
                    showUploadList={false}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={checkImageFile}
                    onChange={handleImageFileChange}
                    accept={"image/*"} >
                    <img src={file ? URL.createObjectURL(file) : urlServerImage + category?.image} alt="Category image" style={{ width: '100%' }} />
                </Upload>

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


